import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createRoom, joinRoom } from '../services/firebaseService';
import { generateRoomCode } from '../utils/gameLogic';

const Lobby = ({ onPlayerJoin, playerId, playerName }) => {
  const [name, setName] = useState(playerName || '');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const newPlayerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const roomCode = await createRoom(newPlayerId, name);
      
      onPlayerJoin(newPlayerId, name);
      navigate(`/room/${roomCode}`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error('Error creating room:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!name.trim() || !roomCode.trim()) {
      setError('Please enter your name and room code');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const newPlayerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await joinRoom(roomCode.toUpperCase(), newPlayerId, name);
      
      onPlayerJoin(newPlayerId, name);
      navigate(`/room/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError('Failed to join room. Please check the room code.');
      console.error('Error joining room:', err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="lobby">
      <motion.div
        className="lobby-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="lobby-header">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            🃏 Blackjack Multiplayer
          </motion.h1>
          <p>Join a room or create your own to start playing!</p>
        </div>

        <div className="lobby-content">
          <motion.div
            className="player-info"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="playerName">Your Name</label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
            />
          </motion.div>

          <div className="room-actions">
            <motion.div
              className="create-room"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3>Create Room</h3>
              <p>Start a new game as the dealer</p>
              <button
                className="action-btn create"
                onClick={handleCreateRoom}
                disabled={isCreating || !name.trim()}
              >
                {isCreating ? 'Creating...' : 'Create Room'}
              </button>
            </motion.div>

            <div className="divider">
              <span>OR</span>
            </div>

            <motion.div
              className="join-room"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3>Join Room</h3>
              <p>Enter a room code to join an existing game</p>
              <div className="join-inputs">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Room Code"
                  maxLength={6}
                />
                <button
                  className="action-btn join"
                  onClick={handleJoinRoom}
                  disabled={isJoining || !name.trim() || !roomCode.trim()}
                >
                  {isJoining ? 'Joining...' : 'Join Room'}
                </button>
              </div>
            </motion.div>
          </div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="game-rules"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3>Game Rules</h3>
            <ul>
              <li>6 decks per shoe with automatic shuffling</li>
              <li>Multiple hands per player (max 3)</li>
              <li>Side bets: Pair (5:1), Trip (15:1), Perfect Pair (20:1), Straight Flush (50:1)</li>
              <li>Auto blackjack checking for dealer 10 and A</li>
              <li>Betting: 5,000 - 50,000 VND per hand</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lobby;
