// Card definitions
export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Create a single deck
export const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, value: getCardValue(rank) });
    }
  }
  return deck;
};

// Get card value for blackjack
export const getCardValue = (rank) => {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
};

// Create 6-deck shoe
export const createShoe = () => {
  const shoe = [];
  for (let i = 0; i < 6; i++) {
    shoe.push(...createDeck());
  }
  return shoe;
};

// Shuffle deck using Fisher-Yates algorithm
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Cut the shoe (random position between 60-80% through the deck)
export const cutShoe = (shoe) => {
  const minCut = Math.floor(shoe.length * 0.6);
  const maxCut = Math.floor(shoe.length * 0.8);
  const cutPoint = Math.floor(Math.random() * (maxCut - minCut + 1)) + minCut;
  return cutPoint;
};

// Calculate hand value
export const calculateHandValue = (cards) => {
  let value = 0;
  let aces = 0;
  
  for (const card of cards) {
    if (card.rank === 'A') {
      aces++;
      value += 11;
    } else {
      value += card.value;
    }
  }
  
  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
};

// Check if hand is blackjack
export const isBlackjack = (cards) => {
  return cards.length === 2 && calculateHandValue(cards) === 21;
};

// Check if hand is bust
export const isBust = (cards) => {
  return calculateHandValue(cards) > 21;
};

// Side bet calculations
export const checkPair = (playerCards) => {
  if (playerCards.length < 2) return false;
  return playerCards[0].rank === playerCards[1].rank;
};

export const checkTrip = (playerCards, dealerUpCard) => {
  if (playerCards.length < 2 || !dealerUpCard) return false;
  return playerCards[0].rank === playerCards[1].rank && 
         playerCards[0].rank === dealerUpCard.rank;
};

export const checkPerfectPair = (playerCards) => {
  if (playerCards.length < 2) return false;
  return playerCards[0].rank === playerCards[1].rank && 
         playerCards[0].suit === playerCards[1].suit;
};

export const checkStraightFlush = (playerCards, dealerUpCard) => {
  if (playerCards.length < 2 || !dealerUpCard) return false;
  
  const allCards = [...playerCards, dealerUpCard];
  if (allCards.length !== 3) return false;
  
  // Check if all same suit
  const suit = allCards[0].suit;
  if (!allCards.every(card => card.suit === suit)) return false;
  
  // Check if in sequence
  const ranks = allCards.map(card => {
    if (card.rank === 'A') return 1;
    if (card.rank === 'J') return 11;
    if (card.rank === 'Q') return 12;
    if (card.rank === 'K') return 13;
    return parseInt(card.rank);
  }).sort((a, b) => a - b);
  
  return ranks[1] === ranks[0] + 1 && ranks[2] === ranks[1] + 1;
};

// Generate room code
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Chip values in VND
export const CHIP_VALUES = {
  '5000': 5000,
  '10000': 10000,
  '20000': 20000,
  '50000': 50000
};

export const INITIAL_CHIPS = 100000; // 100,000 VND
export const MIN_BET = 5000;
export const MAX_BET = 50000;
export const MAX_DOUBLE_BET = 100000;
