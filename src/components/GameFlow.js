import React, { useState, useEffect } from 'react';
import { 
  calculateHandValue, 
  isBlackjack, 
  isBust,
  checkPair,
  checkTrip,
  checkPerfectPair,
  checkStraightFlush
} from '../utils/gameLogic';
import { 
  subscribeToRoom, 
  updateGameState, 
  updatePlayerHand,
  updatePlayerChips 
} from '../services/firebaseService';

const GameFlow = ({ roomCode, playerId, isDealer }) => {
  const [roomData, setRoomData] = useState(null);
  const [gamePhase, setGamePhase] = useState('betting'); // betting, dealing, playing, dealer, resolving, finished
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [shoe, setShoe] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerHands, setPlayerHands] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomCode, (snapshot) => {
      const data = snapshot.val();
      setRoomData(data);
      
      if (data && data.players && data.players[playerId]) {
        setCurrentPlayer(data.players[playerId]);
        setPlayerHands(data.players[playerId].hands || {});
      }
      
      if (data) {
        setShoe(data.shoe || []);
        setDealerCards(data.dealerCards || []);
        setGamePhase(data.gameState || 'betting');
      }
    });

    return unsubscribe;
  }, [roomCode, playerId]);

  // Deal initial cards
  const dealInitialCards = async () => {
    if (!isDealer || gamePhase !== 'betting') return;
    
    const newShoe = [...shoe];
    const newDealerCards = [];
    const updatedPlayers = { ...roomData.players };
    
    // Deal two cards to each active hand
    for (let round = 0; round < 2; round++) {
      // Deal to players first
      for (const [playerId, player] of Object.entries(updatedPlayers)) {
        if (player.hands) {
          for (const [handIndex, hand] of Object.entries(player.hands)) {
            if (hand.status === 'active') {
              const card = newShoe.pop();
              if (!updatedPlayers[playerId].hands[handIndex].cards) {
                updatedPlayers[playerId].hands[handIndex].cards = [];
              }
              updatedPlayers[playerId].hands[handIndex].cards.push(card);
            }
          }
        }
      }
      
      // Deal to dealer
      const dealerCard = newShoe.pop();
      newDealerCards.push(dealerCard);
    }
    
    // Update game state
    await updateGameState(roomCode, {
      shoe: newShoe,
      dealerCards: newDealerCards,
      players: updatedPlayers,
      gameState: 'playing'
    });
    
    // Check for dealer blackjack with 10 or A
    if (newDealerCards[0].rank === '10' || newDealerCards[0].rank === 'A') {
      await checkDealerBlackjack(newDealerCards, updatedPlayers);
    }
  };

  // Check dealer blackjack
  const checkDealerBlackjack = async (cards, players) => {
    if (isBlackjack(cards)) {
      // Resolve all hands immediately
      await resolveAllHands(players, true);
      await updateGameState(roomCode, {
        gameState: 'finished',
        dealerCards: cards
      });
    }
  };

  // Player actions
  const playerHit = async (handIndex) => {
    if (gamePhase !== 'playing') return;
    
    const card = shoe.pop();
    const currentHand = playerHands[handIndex];
    
    if (currentHand && currentHand.cards) {
      const newCards = [...currentHand.cards, card];
      calculateHandValue(newCards);
      
      let newStatus = 'active';
      if (isBust(newCards)) {
        newStatus = 'bust';
      }
      
      await updatePlayerHand(roomCode, playerId, handIndex, {
        ...currentHand,
        cards: newCards,
        status: newStatus
      });
      
      await updateGameState(roomCode, { shoe: shoe });
    }
  };

  const playerStand = async (handIndex) => {
    if (gamePhase !== 'playing') return;
    
    await updatePlayerHand(roomCode, playerId, handIndex, {
      ...playerHands[handIndex],
      status: 'stand'
    });
  };

  const playerDoubleDown = async (handIndex) => {
    if (gamePhase !== 'playing') return;
    
    const currentHand = playerHands[handIndex];
    const doubleAmount = Math.min(currentHand.bet, 50000); // Max double bet
    
    if (currentPlayer.chips >= doubleAmount) {
      const card = shoe.pop();
      const newCards = [...currentHand.cards, card];
      
      await updatePlayerChips(roomCode, playerId, currentPlayer.chips - doubleAmount);
      await updatePlayerHand(roomCode, playerId, handIndex, {
        ...currentHand,
        cards: newCards,
        bet: currentHand.bet + doubleAmount,
        status: isBust(newCards) ? 'bust' : 'stand'
      });
      
      await updateGameState(roomCode, { shoe: shoe });
    }
  };

  // Dealer play
  const dealerPlay = async () => {
    if (!isDealer || gamePhase !== 'playing') return;
    
    let newDealerCards = [...dealerCards];
    let newShoe = [...shoe];
    
    // Dealer hits until 17 or bust
    while (calculateHandValue(newDealerCards) < 17) {
      const card = newShoe.pop();
      newDealerCards.push(card);
    }
    
    await updateGameState(roomCode, {
      shoe: newShoe,
      dealerCards: newDealerCards,
      gameState: 'resolving'
    });
    
    // Resolve all hands
    await resolveAllHands(roomData.players, false);
  };

  // Resolve all hands
  const resolveAllHands = async (players, dealerBlackjack = false) => {
    const dealerValue = calculateHandValue(dealerCards);
    const dealerBust = isBust(dealerCards);
    
    for (const [playerId, player] of Object.entries(players)) {
      if (player.hands) {
        for (const [handIndex, hand] of Object.entries(player.hands)) {
          await resolveHand(playerId, parseInt(handIndex), hand, dealerValue, dealerBust, dealerBlackjack);
        }
      }
    }
    
    await updateGameState(roomCode, { gameState: 'finished' });
  };

  // Resolve individual hand
  const resolveHand = async (playerId, handIndex, hand, dealerValue, dealerBust, dealerBlackjack) => {
    const playerValue = calculateHandValue(hand.cards);
    const playerBust = isBust(hand.cards);
    const playerBlackjack = isBlackjack(hand.cards);
    
    let result = 'lose';
    let payout = 0;
    
    if (playerBust) {
      result = 'lose';
    } else if (dealerBlackjack && playerBlackjack) {
      result = 'push';
      payout = hand.bet;
    } else if (dealerBlackjack) {
      result = 'lose';
    } else if (playerBlackjack) {
      result = 'win';
      payout = Math.floor(hand.bet * 2.5); // 3:2 blackjack payout
    } else if (dealerBust) {
      result = 'win';
      payout = hand.bet * 2;
    } else if (playerValue > dealerValue) {
      result = 'win';
      payout = hand.bet * 2;
    } else if (playerValue === dealerValue) {
      result = 'push';
      payout = hand.bet;
    } else {
      result = 'lose';
    }
    
    // Calculate side bet payouts
    const sideBetPayout = calculateSideBetPayout(hand.sideBets, hand.cards, dealerCards[0]);
    const totalPayout = payout + sideBetPayout;
    
    // Update player chips
    const currentPlayer = roomData.players[playerId];
    await updatePlayerChips(roomCode, playerId, currentPlayer.chips + totalPayout);
    
    // Update hand status
    await updatePlayerHand(roomCode, playerId, handIndex, {
      ...hand,
      status: result,
      payout: totalPayout
    });
  };

  // Calculate side bet payouts
  const calculateSideBetPayout = (sideBets, playerCards, dealerUpCard) => {
    let totalPayout = 0;
    
    if (sideBets.pair && checkPair(playerCards)) {
      totalPayout += sideBets.pair * 6; // 5:1 payout
    }
    
    if (sideBets.trip && checkTrip(playerCards, dealerUpCard)) {
      totalPayout += sideBets.trip * 16; // 15:1 payout
    }
    
    if (sideBets.perfectPair && checkPerfectPair(playerCards)) {
      totalPayout += sideBets.perfectPair * 21; // 20:1 payout
    }
    
    if (sideBets.straightFlush && checkStraightFlush(playerCards, dealerUpCard)) {
      totalPayout += sideBets.straightFlush * 51; // 50:1 payout
    }
    
    return totalPayout;
  };

  // Start new round
  const startNewRound = async () => {
    if (!isDealer) return;
    
    await updateGameState(roomCode, {
      gameState: 'betting',
      dealerCards: [],
      currentHand: 0
    });
  };

  // Render game controls based on phase
  const renderGameControls = () => {
    if (gamePhase === 'betting' && isDealer) {
      return (
        <div className="game-controls">
          <button 
            className="control-btn primary"
            onClick={dealInitialCards}
            disabled={!roomData || Object.keys(roomData.players).length < 2}
          >
            Deal Cards
          </button>
        </div>
      );
    }
    
    if (gamePhase === 'playing') {
      return (
        <div className="game-controls">
          <p>Your turn to play</p>
          <div className="player-actions">
            {Object.entries(playerHands).map(([handIndex, hand]) => (
              <div key={handIndex} className="hand-controls">
                <h4>Hand {parseInt(handIndex) + 1}</h4>
                <div className="action-buttons">
                  <button 
                    className="action-btn hit"
                    onClick={() => playerHit(parseInt(handIndex))}
                    disabled={hand.status !== 'active'}
                  >
                    Hit
                  </button>
                  <button 
                    className="action-btn stand"
                    onClick={() => playerStand(parseInt(handIndex))}
                    disabled={hand.status !== 'active'}
                  >
                    Stand
                  </button>
                  <button 
                    className="action-btn double"
                    onClick={() => playerDoubleDown(parseInt(handIndex))}
                    disabled={hand.status !== 'active' || hand.cards.length !== 2}
                  >
                    Double
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (gamePhase === 'playing' && isDealer) {
      return (
        <div className="game-controls">
          <button 
            className="control-btn primary"
            onClick={dealerPlay}
          >
            Dealer Play
          </button>
        </div>
      );
    }
    
    if (gamePhase === 'finished' && isDealer) {
      return (
        <div className="game-controls">
          <button 
            className="control-btn primary"
            onClick={startNewRound}
          >
            New Round
          </button>
        </div>
      );
    }
    
    return null;
  };

  if (!roomData || !currentPlayer) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  return (
    <div className="game-flow">
      <div className="game-status">
        <h3>Game Phase: {gamePhase}</h3>
        <p>Shoe Cards: {shoe.length}</p>
      </div>
      
      {renderGameControls()}
      
      <div className="game-results">
        {gamePhase === 'finished' && (
          <div className="round-summary">
            <h3>Round Complete!</h3>
            <p>Check your chips for winnings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameFlow;
