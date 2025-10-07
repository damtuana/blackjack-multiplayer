import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ suit, rank, hidden = false, delay = 0 }) => {
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  if (hidden) {
    return (
      <motion.div 
        className="card hidden"
        initial={{ opacity: 0, rotateY: 180 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ delay }}
      >
        <div className="card-back">
          <div className="card-pattern"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`card ${getSuitColor(suit)}`}
      initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="card-content">
        <div className="card-corner top-left">
          <span className="rank">{rank}</span>
          <span className="suit">{getSuitSymbol(suit)}</span>
        </div>
        
        <div className="card-center">
          <span className="suit-large">{getSuitSymbol(suit)}</span>
        </div>
        
        <div className="card-corner bottom-right">
          <span className="rank">{rank}</span>
          <span className="suit">{getSuitSymbol(suit)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
