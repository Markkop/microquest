import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db, User, Task, calculateXpForNextLevel, calculateLevelFromXp } from '../db/database';
import { useDatabase } from './DatabaseContext';

interface GameContextType {
  availableXp: number;
  availableCredits: number;
  harvestAvailable: boolean;
  calculateRewards: () => Promise<{
    xp: number;
    credits: number;
    strengthGain: number;
    vitalityGain: number;
    focusGain: number;
  }>;
  claimRewards: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  subtractCredits: (amount: number) => Promise<boolean>;
  completeTask: (taskId: number) => Promise<void>;
}

const GameContext = createContext<GameContextType>({
  availableXp: 0,
  availableCredits: 0,
  harvestAvailable: false,
  calculateRewards: async () => ({ xp: 0, credits: 0, strengthGain: 0, vitalityGain: 0, focusGain: 0 }),
  claimRewards: async () => {},
  addXp: async () => {},
  addCredits: async () => {},
  subtractCredits: async () => false,
  completeTask: async () => {},
});

export const useGame = () => useContext(GameContext);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { user, tasks, refreshData } = useDatabase();
  const [availableXp, setAvailableXp] = useState(0);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [harvestAvailable, setHarvestAvailable] = useState(false);

  // Calculate rewards based on time passed and tasks
  const calculateRewards = async () => {
    if (!user) {
      return { xp: 0, credits: 0, strengthGain: 0, vitalityGain: 0, focusGain: 0 };
    }

    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const hoursSinceLastActive = Math.min(24, Math.max(0, (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)));
    
    // Cap at 24 hours
    const cappedHours = Math.min(hoursSinceLastActive, 24);
    
    // Calculate base rewards
    const xpGain = Math.floor(cappedHours * 5); // 5 XP per hour
    const creditsGain = Math.floor(cappedHours / 4); // 1 credit per 4 hours
    
    // Calculate stat gains from completed tasks
    let strengthGain = 0;
    let vitalityGain = 0;
    let focusGain = 0;
    
    // Calculate stats based on completed tasks since last active
    const completedTasks = tasks.filter(task => 
      task.isDone && task.lastClaimedAt && new Date(task.lastClaimedAt) > lastActive
    );
    
    completedTasks.forEach(task => {
      if (task.stat === 'strength') strengthGain++;
      if (task.stat === 'vitality') vitalityGain++;
      if (task.stat === 'focus') focusGain++;
    });
    
    return { 
      xp: xpGain, 
      credits: creditsGain,
      strengthGain,
      vitalityGain,
      focusGain
    };
  };

  // Claim all available rewards
  const claimRewards = async () => {
    if (!user) return;
    
    const { xp, credits, strengthGain, vitalityGain, focusGain } = await calculateRewards();
    
    const newXp = user.xp + xp;
    const newLevel = calculateLevelFromXp(newXp);
    const levelUp = newLevel > user.level;
    
    await db.users.update(user.id!, {
      xp: newXp,
      level: newLevel,
      credits: user.credits + credits,
      strength: user.strength + strengthGain,
      vitality: user.vitality + vitalityGain,
      focus: user.focus + focusGain,
      lastActive: new Date(),
    });
    
    setAvailableXp(0);
    setAvailableCredits(0);
    setHarvestAvailable(false);
    refreshData();
    
    return;
  };

  // Add XP to the user
  const addXp = async (amount: number) => {
    if (!user) return;
    
    const newXp = user.xp + amount;
    const newLevel = calculateLevelFromXp(newXp);
    const levelUp = newLevel > user.level;
    
    await db.users.update(user.id!, {
      xp: newXp,
      level: newLevel,
    });
    
    refreshData();
  };

  // Add credits to the user
  const addCredits = async (amount: number) => {
    if (!user) return;
    
    await db.users.update(user.id!, {
      credits: user.credits + amount,
    });
    
    refreshData();
  };

  // Subtract credits (for AI calls, etc.)
  const subtractCredits = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    if (user.credits < amount) return false;
    
    await db.users.update(user.id!, {
      credits: user.credits - amount,
    });
    
    refreshData();
    return true;
  };

  // Complete a task and gain rewards
  const completeTask = async (taskId: number) => {
    if (!user) return;
    
    const task = await db.tasks.get(taskId);
    if (!task) return;
    
    const now = new Date();
    
    // Calculate next available time based on cooldown
    const nextAvailable = new Date(now.getTime() + (task.cooldownMinutes || 1440) * 60000);
    
    // Mark task as done and set next available time
    await db.tasks.update(taskId, {
      isDone: true,
      lastClaimedAt: now,
      nextAvailableAt: nextAvailable,
    });
    
    // Award XP
    await addXp(task.xpValue);
    
    // Update the stat
    const statUpdate: Partial<User> = {};
    statUpdate[task.stat] = user[task.stat] + 1;
    
    await db.users.update(user.id!, statUpdate);
    
    refreshData();
  };

  // Check for available rewards on load and after inactivity
  useEffect(() => {
    const checkRewards = async () => {
      if (!user) return;
      
      const { xp, credits } = await calculateRewards();
      setAvailableXp(xp);
      setAvailableCredits(credits);
      setHarvestAvailable(xp > 0 || credits > 0);
    };
    
    checkRewards();
    
    // Check every minute
    const interval = setInterval(checkRewards, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const value = {
    availableXp,
    availableCredits,
    harvestAvailable,
    calculateRewards,
    claimRewards,
    addXp,
    addCredits,
    subtractCredits,
    completeTask,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};