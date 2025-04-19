import React from 'react';
import { motion } from 'framer-motion';
import { calculateXpForNextLevel } from '../db/database';

interface XpBarProps {
  level: number;
  xp: number;
}

const XpBar: React.FC<XpBarProps> = ({ level, xp }) => {
  // Calculate XP needed for the next level
  const xpForNextLevel = calculateXpForNextLevel(level);
  
  // Calculate current level's starting XP
  const startXpCurrentLevel = xp - (xp % xpForNextLevel);
  
  // Calculate current XP within the level
  const currentLevelXp = xp - startXpCurrentLevel;
  
  // Calculate percentage
  const percentage = Math.min(100, (currentLevelXp / xpForNextLevel) * 100);
  
  return (
    <motion.div 
      className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default XpBar;