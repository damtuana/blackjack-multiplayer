import { 
  calculateHandValue, 
  isBlackjack, 
  isBust,
  checkPair,
  checkTrip,
  checkPerfectPair,
  checkStraightFlush,
  CHIP_VALUES,
  MIN_BET,
  MAX_BET
} from '../utils/gameLogic';
import { 
  updateGameState, 
  updatePlayerHand,
  updatePlayerChips 
} from './firebaseService';

export class GameService {
  constructor(roomCode) {
    this.roomCode = roomCode;
  }

  // Deal initial cards to all players
  async dealInitialCards(roomData, shoe) {
    const players = roomData.players;
    const newShoe = [...shoe];
    const dealerCards = [];
    
    // Deal two cards to each player and dealer
    for (let i = 0; i < 2; i++) {
      // Deal to players first
      for (const [playerId, player] of Object.entries(players)) {
        if (player.hands && Object.keys(player.hands).length > 0) {
          for (const [handIndex, hand] of Object.entries(player.hands)) {
            if (hand.status === 'active') {
              const card = newShoe.pop();
              await this.addCardToHand(playerId, parseInt(handIndex), card);
            }
          }
        }
      }
      
      // Deal to dealer
      const dealerCard = newShoe.pop();
      dealerCards.push(dealerCard);
    }

    // Update dealer cards
    await updateGameState(this.roomCode, {
      dealerCards: dealerCards,
      shoe: newShoe
    });

    // Check for dealer blackjack with 10 or A
    if (dealerCards[0].rank === '10' || dealerCards[0].rank === 'A') {
      await this.checkDealerBlackjack(dealerCards, players);
    }

    return newShoe;
  }

  // Check for dealer blackjack when showing 10 or A
  async checkDealerBlackjack(dealerCards, players) {
    const dealerValue = calculateHandValue(dealerCards);
    
    if (isBlackjack(dealerCards)) {
      // Dealer has blackjack - resolve all hands
      await this.resolveAllHands(players, true);
      await updateGameState(this.roomCode, {
        gameState: 'finished',
        dealerCards: dealerCards
      });
    }
  }

  // Add card to specific hand
  async addCardToHand(playerId, handIndex, card) {
    const handRef = `rooms/${this.roomCode}/players/${playerId}/hands/${handIndex}`;
    // This would need to be implemented in firebaseService
    // For now, we'll update the entire hand
  }

  // Player hit action
  async playerHit(playerId, handIndex, shoe) {
    const card = shoe.pop();
    // Add card to hand logic here
    await updateGameState(this.roomCode, { shoe: shoe });
    
    // Check if bust
    // This would need to get current hand data first
    return shoe;
  }

  // Player stand action
  async playerStand(playerId, handIndex) {
    // Mark hand as standing
    // This would update the hand status
  }

  // Player double down
  async playerDoubleDown(playerId, handIndex, shoe) {
    // Double the bet and deal one more card
    // Check if bust after the card
  }

  // Player split
  async playerSplit(playerId, handIndex, shoe) {
    // Split the hand into two hands
    // Deal one card to each new hand
  }

  // Dealer play
  async dealerPlay(shoe) {
    const roomData = await this.getRoomData();
    const dealerCards = roomData.dealerCards;
    
    // Dealer hits until 17 or bust
    while (calculateHandValue(dealerCards) < 17) {
      const card = shoe.pop();
      dealerCards.push(card);
    }
    
    await updateGameState(this.roomCode, {
      dealerCards: dealerCards,
      shoe: shoe
    });
    
    return shoe;
  }

  // Resolve all hands after dealer play
  async resolveAllHands(players, dealerBlackjack = false) {
    const roomData = await this.getRoomData();
    const dealerCards = roomData.dealerCards;
    const dealerValue = calculateHandValue(dealerCards);
    const dealerBust = isBust(dealerCards);
    
    for (const [playerId, player] of Object.entries(players)) {
      if (player.hands) {
        for (const [handIndex, hand] of Object.entries(player.hands)) {
          await this.resolveHand(playerId, parseInt(handIndex), hand, dealerCards, dealerValue, dealerBust, dealerBlackjack);
        }
      }
    }
  }

  // Resolve individual hand
  async resolveHand(playerId, handIndex, hand, dealerCards, dealerValue, dealerBust, dealerBlackjack) {
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
    const sideBetPayout = this.calculateSideBetPayout(hand.sideBets, hand.cards, dealerCards[0]);
    
    // Update player chips
    const totalPayout = payout + sideBetPayout;
    await this.updatePlayerChips(playerId, totalPayout);
    
    // Update hand status
    await updatePlayerHand(this.roomCode, playerId, handIndex, {
      ...hand,
      status: result,
      payout: totalPayout
    });
  }

  // Calculate side bet payouts
  calculateSideBetPayout(sideBets, playerCards, dealerUpCard) {
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
  }

  // Update player chips
  async updatePlayerChips(playerId, payout) {
    // This would need to get current chips and add payout
    // Implementation depends on Firebase service
  }

  // Get room data
  async getRoomData() {
    // This would fetch current room data from Firebase
    // Implementation depends on Firebase service
  }

  // Start new round
  async startNewRound() {
    // Reset game state for new round
    await updateGameState(this.roomCode, {
      gameState: 'betting',
      dealerCards: [],
      currentHand: 0
    });
  }

  // End game
  async endGame() {
    await updateGameState(this.roomCode, {
      gameState: 'finished'
    });
  }
}
