import React from 'react';
import { motion } from 'framer-motion';

const Chip = ({ value, label, selected, onClick }) => {
  const getChipColor = (value) => {
    switch (value) {
      case 5000: return '#4CAF50'; // Green
      case 10000: return '#2196F3'; // Blue
      case 20000: return '#FF9800'; // Orange
      case 50000: return '#F44336'; // Red
      default: return '#9E9E9E'; // Gray
    }
  };

  return (
    <motion.button
      className={`chip ${selected ? 'selected' : ''}`}
      style={{ backgroundColor: getChipColor(value) }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        scale: selected ? 1.1 : 1,
        boxShadow: selected ? '0 0 20px rgba(255, 255, 255, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="chip-value">
        {value.toLocaleString()}
      </div>
      <div className="chip-label">
        {label}
      </div>
    </motion.button>
  );
};

export default Chip;
