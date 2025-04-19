import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, User, Goal, Task, InsightCard } from '../db/database';

interface DatabaseContextType {
  user: User | null;
  goals: Goal[];
  tasks: Task[];
  insightCards: InsightCard[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const DatabaseContext = createContext<DatabaseContextType>({
  user: null,
  goals: [],
  tasks: [],
  insightCards: [],
  loading: true,
  error: null,
  refreshData: () => {},
});

export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const user = useLiveQuery(async () => {
    try {
      return await db.users.toCollection().first();
    } catch (err) {
      setError('Failed to load user data');
      return null;
    }
  }, [refreshTrigger]);

  const goals = useLiveQuery(async () => {
    try {
      return await db.goals.toArray();
    } catch (err) {
      setError('Failed to load goals');
      return [];
    }
  }, [refreshTrigger]);

  const tasks = useLiveQuery(async () => {
    try {
      return await db.tasks.toArray();
    } catch (err) {
      setError('Failed to load tasks');
      return [];
    }
  }, [refreshTrigger]);

  const insightCards = useLiveQuery(async () => {
    try {
      return await db.insightCards.toArray();
    } catch (err) {
      setError('Failed to load insight cards');
      return [];
    }
  }, [refreshTrigger]);

  // Function to refresh all data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Effect to set loading state
  useEffect(() => {
    if (user !== undefined && goals !== undefined && tasks !== undefined && insightCards !== undefined) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user, goals, tasks, insightCards]);

  const value = {
    user: user || null,
    goals: goals || [],
    tasks: tasks || [],
    insightCards: insightCards || [],
    loading,
    error,
    refreshData,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};