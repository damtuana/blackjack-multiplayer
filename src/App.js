import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import './App.css';

// Wrapper component to get room code from URL
const GameRoomWrapper = ({ playerId, playerName }) => {
  const { roomCode } = useParams();
  return <GameRoom roomCode={roomCode} playerId={playerId} playerName={playerName} />;
};

function App() {
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');

  const handlePlayerJoin = (id, name) => {
    setPlayerId(id);
    setPlayerName(name);
  };

  return (
    <Router>
      <div className="App">
        <motion.div
          className="app-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <Lobby 
                  onPlayerJoin={handlePlayerJoin}
                  playerId={playerId}
                  playerName={playerName}
                />
              } 
            />
            <Route 
              path="/room/:roomCode" 
              element={
                playerId ? (
                  <GameRoomWrapper 
                    playerId={playerId}
                    playerName={playerName}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
