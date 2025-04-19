import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../db/database';
import { useDatabase } from './DatabaseContext';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => Promise<void>;
  hasApiKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: null,
  setApiKey: async () => {},
  hasApiKey: false,
});

export const useApiKey = () => useContext(ApiKeyContext);

interface ApiKeyProviderProps {
  children: ReactNode;
}

export const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {
  const { user, refreshData } = useDatabase();
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Initialize API key from localStorage and user data
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKeyState(storedApiKey);
      setHasApiKey(true);
    } else if (user?.apiKey) {
      setApiKeyState(user.apiKey);
      setHasApiKey(true);
      // Store in localStorage for persistence
      localStorage.setItem('openai_api_key', user.apiKey);
    }
  }, [user]);

  // Save API key to database and localStorage
  const setApiKey = async (key: string) => {
    if (!user) return;
    
    await db.users.update(user.id!, {
      apiKey: key,
    });
    
    // Store in localStorage for persistence
    localStorage.setItem('openai_api_key', key);
    
    setApiKeyState(key);
    setHasApiKey(!!key);
    refreshData();
  };

  const value = {
    apiKey,
    setApiKey,
    hasApiKey,
  };

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
};