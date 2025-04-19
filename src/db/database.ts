import Dexie, { Table } from 'dexie';
import OpenAI from 'openai';

// Define interfaces for our database tables
export interface User {
  id?: number;
  name: string;
  credits: number;
  xp: number;
  level: number;
  strength: number;
  vitality: number;
  focus: number;
  streak: number;
  lastActive: Date;
  createdAt: Date;
  apiKey?: string;
}

export interface Goal {
  id?: number;
  title: string;
  createdAt: Date;
  archivedAt?: Date;
}

export type StatType = 'strength' | 'vitality' | 'focus';

export interface CooldownOption {
  minutes: number;
  description: string;
}

export interface Task {
  id?: number;
  goalId: number;
  parentTaskId?: number;
  title: string;
  depth: number;
  stat: StatType;
  xpValue: number;
  isDone: boolean;
  cooldownMinutes: number;
  nextAvailableAt?: Date;
  lastClaimedAt?: Date;
  createdAt: Date;
}

export interface InsightCard {
  id?: number;
  title: string;
  content: string;
  seen: boolean;
  createdAt: Date;
}

// Define the database
class MicroQuestDatabase extends Dexie {
  users!: Table<User, number>;
  goals!: Table<Goal, number>;
  tasks!: Table<Task, number>;
  insightCards!: Table<InsightCard, number>;

  constructor() {
    super('microQuestDb');
    this.version(1).stores({
      users: '++id, name, level, streak',
      goals: '++id, createdAt, archivedAt',
      tasks: '++id, goalId, parentTaskId, depth, isDone, lastClaimedAt, nextAvailableAt',
      insightCards: '++id, seen, createdAt',
    });
  }
}

// Create database instance
export const db = new MicroQuestDatabase();

// Initialize database with default user if none exists
export const initializeDb = async () => {
  const userCount = await db.users.count();
  
  if (userCount === 0) {
    // Create a default user
    await db.users.add({
      name: 'Player',
      credits: 1000, // Starting credits
      xp: 0,
      level: 1,
      strength: 1,
      vitality: 1,
      focus: 1,
      streak: 0,
      lastActive: new Date(),
      createdAt: new Date(),
    });

    // Add initial insight cards
    await db.insightCards.bulkAdd([
      {
        title: 'Building Habits',
        content: 'It takes an average of 66 days to form a new habit. Stay consistent and watch your progress grow!',
        seen: false,
        createdAt: new Date(),
      },
      {
        title: 'The 2-Minute Rule',
        content: 'If something takes less than 2 minutes to do, do it immediately rather than putting it off.',
        seen: false,
        createdAt: new Date(),
      },
      {
        title: 'Power of Small Wins',
        content: 'Breaking big goals into smaller ones gives you more frequent feelings of achievement, boosting motivation.',
        seen: false,
        createdAt: new Date(),
      },
    ]);
  }

  // Check and update streak
  const user = await db.users.toCollection().first();
  if (user) {
    const today = new Date();
    const lastActive = new Date(user.lastActive);
    
    const isToday = lastActive.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    const isYesterday = new Date(lastActive.setDate(lastActive.getDate() + 1)).setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    
    if (!isToday) {
      if (isYesterday) {
        // User was active yesterday, increase streak
        await db.users.update(user.id!, {
          lastActive: today,
          streak: user.streak + 1,
        });
      } else {
        // User missed a day, reset streak
        await db.users.update(user.id!, {
          lastActive: today,
          streak: 0,
        });
      }
    }
  }
};

// Add a function to calculate XP needed for next level
export const calculateXpForNextLevel = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
};

// Add a function to calculate level from XP
export const calculateLevelFromXp = (xp: number): number => {
  let level = 1;
  let xpForNextLevel = calculateXpForNextLevel(level);
  
  while (xp >= xpForNextLevel) {
    xp -= xpForNextLevel;
    level++;
    xpForNextLevel = calculateXpForNextLevel(level);
  }
  
  return level;
};

// Get cooldown options based on task title and stat
export const getCooldownOptions = async (title: string, stat: StatType, apiKey: string): Promise<CooldownOption[]> => {
  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const prompt = `
      Given the task "${title}" that improves the ${stat} stat, suggest 3 different cooldown periods (in minutes) for how often this task should be repeated.
      Consider the nature of the task and what would be realistic and beneficial for the user.
      
      Return your response as a JSON array with this exact structure:
      [
        {
          "minutes": number,
          "description": "Brief explanation of why this interval"
        }
      ]
      
      The intervals should be different and make sense for the task. For example:
      - Physical exercises might need longer cooldowns
      - Learning tasks might benefit from shorter, frequent intervals
      - Wellness activities might vary based on intensity
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps determine optimal intervals for habit formation and skill development.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    return JSON.parse(content).cooldowns || getFallbackCooldowns(stat);
  } catch (error) {
    console.error('Error getting cooldown options:', error);
    return getFallbackCooldowns(stat);
  }
};

// Fallback cooldown options if AI fails
const getFallbackCooldowns = (stat: StatType): CooldownOption[] => {
  switch (stat) {
    case 'strength':
      return [
        { minutes: 1440, description: 'Daily practice for consistent progress' },
        { minutes: 2880, description: 'Every 2 days to allow proper recovery' },
        { minutes: 4320, description: 'Every 3 days for intensive activities' },
      ];
    case 'vitality':
      return [
        { minutes: 720, description: 'Twice daily for balanced well-being' },
        { minutes: 1440, description: 'Daily routine for steady improvement' },
        { minutes: 2160, description: 'Every 1.5 days for deeper practice' },
      ];
    case 'focus':
      return [
        { minutes: 180, description: 'Every 3 hours for optimal learning' },
        { minutes: 360, description: 'Every 6 hours to maintain focus' },
        { minutes: 720, description: 'Twice daily for sustained attention' },
      ];
  }
};