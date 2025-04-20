import React from "react";
import { calculateXpForNextLevel } from "../db/database";
import ProgressBar from "./ui/ProgressBar";

interface XpBarProps {
  level: number;
  xp: number;
  className?: string;
}

const XpBar: React.FC<XpBarProps> = ({ level, xp, className = "" }) => {
  // Calculate XP needed for the next level
  const xpForNextLevel = calculateXpForNextLevel(level);

  // Calculate current level's starting XP
  const startXpCurrentLevel = xp - (xp % xpForNextLevel);

  // Calculate current XP within the level
  const currentLevelXp = xp - startXpCurrentLevel;

  return (
    <ProgressBar
      value={currentLevelXp}
      max={xpForNextLevel}
      className={className}
    />
  );
};

export default XpBar;
