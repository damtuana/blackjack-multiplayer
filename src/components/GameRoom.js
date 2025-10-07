import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  createShoe, 
  shuffleDeck, 
  calculateHandValue,
  isBlackjack,
  isBust,
  CHIP_VALUES
} from '../utils/gameLogic';
import { 
  subscribeToRoom, 
  updatePlayerHand,
  updatePlayerChips,
  startGame
} from '../services/firebaseService';
import Card from './Card';
import Chip from './Chip';
import SideBetPanel from './SideBetPanel';
import GameFlow from './GameFlow';

const GameRoom = ({ roomCode, playerId, playerName }) => {
  const [roomData, setRoomData] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedChip, setSelectedChip] = useState(5000);
  const [sideBets, setSideBets] = useState({
    pair: 0,
    trip: 0,
    perfectPair: 0,
    straightFlush: 0
  });

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomCode, (snapshot) => {
      const data = snapshot.val();
      setRoomData(data);
      
      if (data && data.players && data.players[playerId]) {
        setCurrentPlayer(data.players[playerId]);
      }
    });

    return unsubscribe;
  }, [roomCode, playerId]);

  // Check if current player is dealer
  const isDealer = roomData && roomData.dealer && roomData.dealer.id === playerId;

  const handleStartGame = async () => {
    if (!isDealer) return;
    
    const shoe = shuffleDeck(createShoe());
    const cutPoint = Math.floor(Math.random() * (shoe.length * 0.2)) + Math.floor(shoe.length * 0.6);
    const cutShoe = shoe.slice(cutPoint);
    
    await startGame(roomCode, cutShoe);
  };

  const handleBet = (handIndex, amount) => {
    if (!currentPlayer || currentPlayer.chips < amount) return;
    
    const newChips = currentPlayer.chips - amount;
    updatePlayerChips(roomCode, playerId, newChips);
    
    const handData = {
      bet: amount,
      cards: [],
      status: 'active',
      sideBets: { ...sideBets }
    };
    
    updatePlayerHand(roomCode, playerId, handIndex, handData);
  };

  const handleSideBet = (betType, amount) => {
    if (!currentPlayer || currentPlayer.chips < amount) return;
    
    setSideBets(prev => ({
      ...prev,
      [betType]: prev[betType] + amount
    }));
  };

  const renderHand = (hand, handIndex) => {
    if (!hand || !hand.cards) return null;
    
    const handValue = calculateHandValue(hand.cards);
    const isBlackjackHand = isBlackjack(hand.cards);
    const isBustHand = isBust(hand.cards);
    
    return (
      <motion.div 
        key={handIndex}
        className="hand"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: handIndex * 0.1 }}
      >
        <div className="hand-header">
          <span>Hand {handIndex + 1}</span>
          <span>Bet: {hand.bet?.toLocaleString()} VND</span>
          <span>Value: {handValue}</span>
        </div>
        
        <div className="cards">
          {hand.cards.map((card, cardIndex) => (
            <Card 
              key={cardIndex}
              suit={card.suit}
              rank={card.rank}
              delay={cardIndex * 0.1}
            />
          ))}
        </div>
        
        {isBlackjackHand && (
          <div className="hand-status blackjack">BLACKJACK!</div>
        )}
        {isBustHand && (
          <div className="hand-status bust">BUST!</div>
        )}
      </motion.div>
    );
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
    <div className="game-room">
      <div className="game-header">
        <h1>Room: {roomCode}</h1>
        <div className="player-info">
          <span>Player: {playerName}</span>
          <span>Chips: {currentPlayer.chips.toLocaleString()} VND</span>
        </div>
      </div>

      <div className="game-area">
        {roomData.gameState === 'waiting' && (
          <div className="waiting-room">
            <h2>Waiting for players...</h2>
            <div className="players-list">
              {Object.values(roomData.players).map(player => (
                <div key={player.id} className="player-item">
                  {player.name} - {player.chips.toLocaleString()} VND
                </div>
              ))}
            </div>
            {isDealer && (
              <button 
                className="start-game-btn"
                onClick={handleStartGame}
                disabled={Object.keys(roomData.players).length < 2}
              >
                Start Game
              </button>
            )}
          </div>
        )}

        {roomData.gameState === 'playing' && (
          <div className="game-board">
            <div className="dealer-area">
              <h3>Dealer</h3>
              <div className="dealer-cards">
                {roomData.dealerCards?.map((card, index) => (
                  <Card 
                    key={index}
                    suit={card.suit}
                    rank={card.rank}
                    hidden={index === 1 && roomData.dealerCards.length === 2}
                  />
                ))}
              </div>
            </div>

            <div className="players-area">
              {Object.entries(roomData.players).map(([id, player]) => (
                <div key={id} className="player-area">
                  <h4>{player.name}</h4>
                  <div className="player-hands">
                    {Object.entries(player.hands || {}).map(([handIndex, hand]) => 
                      renderHand(hand, parseInt(handIndex))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <GameFlow 
          roomCode={roomCode}
          playerId={playerId}
          isDealer={isDealer}
        />
      </div>

      <div className="betting-panel">
        <div className="chip-selector">
          {Object.entries(CHIP_VALUES).map(([label, value]) => (
            <Chip
              key={value}
              value={value}
              label={label}
              selected={selectedChip === value}
              onClick={() => setSelectedChip(value)}
            />
          ))}
        </div>

        <div className="betting-actions">
          <button 
            className="bet-btn"
            onClick={() => handleBet(0, selectedChip)}
            disabled={currentPlayer.chips < selectedChip}
          >
            Bet {selectedChip.toLocaleString()} VND
          </button>
        </div>

        <SideBetPanel
          sideBets={sideBets}
          onSideBet={handleSideBet}
          playerChips={currentPlayer.chips}
        />
      </div>
    </div>
  );
};

export default GameRoom;
