import React from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface AddCreditsButtonProps {
  amount?: number;
}

const AddCreditsButton: React.FC<AddCreditsButtonProps> = ({ amount = 10 }) => {
  const { addCredits } = useGame();

  const handleAddCredits = () => {
    addCredits(amount);
  };

  return (
    <motion.button
      className="flex items-center gap-1 py-1 px-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full text-sm font-medium shadow-sm"
      onClick={handleAddCredits}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>+{amount}</span>
      <Coins size={14} />
    </motion.button>
  );
};

export default AddCreditsButton;