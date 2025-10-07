import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SideBetPanel = ({ sideBets, onSideBet, playerChips }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sideBetOptions = [
    {
      id: 'pair',
      name: 'Pair',
      description: 'Two player initial cards with same value',
      odds: '5:1',
      minBet: 5000
    },
    {
      id: 'trip',
      name: 'Trip',
      description: 'Two player cards + dealer up card same value',
      odds: '15:1',
      minBet: 5000
    },
    {
      id: 'perfectPair',
      name: 'Perfect Pair',
      description: 'Two player initial cards are exact same',
      odds: '20:1',
      minBet: 5000
    },
    {
      id: 'straightFlush',
      name: 'Straight Flush',
      description: 'Three cards in sequence & same suit',
      odds: '50:1',
      minBet: 5000
    }
  ];

  const handleSideBet = (betType, amount) => {
    if (playerChips >= amount) {
      onSideBet(betType, amount);
    }
  };

  return (
    <div className="side-bet-panel">
      <motion.button
        className="side-bet-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Side Bets {isOpen ? '▼' : '▶'}
      </motion.button>

      <motion.div
        className="side-bet-content"
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {isOpen && (
          <div className="side-bet-options">
            {sideBetOptions.map(option => (
              <div key={option.id} className="side-bet-option">
                <div className="side-bet-info">
                  <h4>{option.name}</h4>
                  <p>{option.description}</p>
                  <span className="odds">Pays {option.odds}</span>
                </div>
                
                <div className="side-bet-controls">
                  <div className="current-bet">
                    Current: {sideBets[option.id]?.toLocaleString() || 0} VND
                  </div>
                  
                  <div className="bet-buttons">
                    <button
                      className="bet-btn small"
                      onClick={() => handleSideBet(option.id, option.minBet)}
                      disabled={playerChips < option.minBet}
                    >
                      +{option.minBet.toLocaleString()}
                    </button>
                    
                    <button
                      className="bet-btn small"
                      onClick={() => handleSideBet(option.id, option.minBet * 2)}
                      disabled={playerChips < option.minBet * 2}
                    >
                      +{(option.minBet * 2).toLocaleString()}
                    </button>
                    
                    <button
                      className="bet-btn small"
                      onClick={() => handleSideBet(option.id, option.minBet * 5)}
                      disabled={playerChips < option.minBet * 5}
                    >
                      +{(option.minBet * 5).toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SideBetPanel;
