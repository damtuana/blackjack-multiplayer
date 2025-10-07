import { 
  ref, 
  set, 
  onValue, 
  off, 
  update, 
  remove,
  serverTimestamp 
} from 'firebase/database';
import { rtdb } from '../firebase/config';

// Room management
export const createRoom = async (dealerId, dealerName) => {
  const roomCode = generateRoomCode();
  const roomRef = ref(rtdb, `rooms/${roomCode}`);
  
  const roomData = {
    code: roomCode,
    dealer: {
      id: dealerId,
      name: dealerName
    },
    players: {},
    gameState: 'waiting',
    shoe: null,
    currentHand: null,
    createdAt: serverTimestamp()
  };
  
  await set(roomRef, roomData);
  return roomCode;
};

export const joinRoom = async (roomCode, playerId, playerName) => {
  const playerRef = ref(rtdb, `rooms/${roomCode}/players/${playerId}`);
  
  const playerData = {
    id: playerId,
    name: playerName,
    chips: 100000, // Initial chips
    hands: {},
    isReady: false,
    joinedAt: serverTimestamp()
  };
  
  await set(playerRef, playerData);
  return true;
};

export const leaveRoom = async (roomCode, playerId) => {
  const playerRef = ref(rtdb, `rooms/${roomCode}/players/${playerId}`);
  await remove(playerRef);
};

// Game state management
export const startGame = async (roomCode, shoe) => {
  const roomRef = ref(rtdb, `rooms/${roomCode}`);
  await update(roomRef, {
    gameState: 'playing',
    shoe: shoe,
    currentHand: 0
  });
};

export const updateGameState = async (roomCode, gameData) => {
  const roomRef = ref(rtdb, `rooms/${roomCode}`);
  await update(roomRef, gameData);
};

export const updatePlayerHand = async (roomCode, playerId, handIndex, handData) => {
  const handRef = ref(rtdb, `rooms/${roomCode}/players/${playerId}/hands/${handIndex}`);
  await set(handRef, handData);
};

export const updatePlayerChips = async (roomCode, playerId, newChips) => {
  const playerRef = ref(rtdb, `rooms/${roomCode}/players/${playerId}`);
  await update(playerRef, { chips: newChips });
};

// Real-time listeners
export const subscribeToRoom = (roomCode, callback) => {
  const roomRef = ref(rtdb, `rooms/${roomCode}`);
  onValue(roomRef, callback);
  return () => off(roomRef);
};

export const subscribeToPlayer = (roomCode, playerId, callback) => {
  const playerRef = ref(rtdb, `rooms/${roomCode}/players/${playerId}`);
  onValue(playerRef, callback);
  return () => off(playerRef);
};

// Helper function to generate room code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
