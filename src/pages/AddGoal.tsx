import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Dumbbell, BookOpen } from 'lucide-react';
import { db, Task, getCooldownOptions } from '../db/database';
import { useDatabase } from '../contexts/DatabaseContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useGame } from '../contexts/GameContext';
import { breakdownGoal } from '../services/aiService';
import { useTranslation } from 'react-i18next';

// Import components
import GoalInputSection from '../components/AddGoal/GoalInputSection';
import ApiKeySection from '../components/AddGoal/ApiKeySection';
import TaskSuggestionSection from '../components/AddGoal/TaskSuggestionSection';
import { TaskWithCooldowns, Step, SuggestedGoal } from '../components/AddGoal/types';

const AddGoal: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refreshData } = useDatabase();
  const { apiKey, hasApiKey } = useApiKey();
  const { subtractCredits } = useGame();
  const apiKeyContext = useApiKey();
  
  // State hooks
  const [goalInput, setGoalInput] = useState('');
  const [suggestions, setSuggestions] = useState<TaskWithCooldowns[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<TaskWithCooldowns[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('input');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [randomSeed, setRandomSeed] = useState(0);
  const [suggestedGoals] = useState<SuggestedGoal[]>([
    { title: "Stop smoking", icon: <Brain size={16} /> },
    { title: "Drink more water", icon: <Dumbbell size={16} /> },
    { title: "Practice more Exercise", icon: <BookOpen size={16} /> }
  ]);

  // Helper functions
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const loadCooldownOptions = async (tasks: TaskWithCooldowns[]) => {
    const tasksWithCooldowns = await Promise.all(
      tasks.map(async (task) => {
        const cooldownOptions = await getCooldownOptions(task.title, task.stat, apiKey!);
        return {
          ...task,
          cooldownOptions,
          selectedCooldown: cooldownOptions[0]?.minutes || 1440, // Default to first option or 24h
        };
      })
    );
    return tasksWithCooldowns;
  };

  // Event handlers
  const handleSubmitGoal = async () => {
    if (!goalInput.trim()) {
      setError(t('addGoal.errors.enterGoal'));
      return;
    }
    
    if (!hasApiKey) {
      setStep('apiKey');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await subtractCredits(1);
      if (!success) {
        setError(t('addGoal.errors.notEnoughCredits'));
        setIsLoading(false);
        return;
      }
      
      const response = await breakdownGoal(goalInput, 0, apiKey!, [], randomSeed);
      
      if (response && response.tasks && response.tasks.length > 0) {
        const tasksWithCooldowns = await loadCooldownOptions(response.tasks);
        setSuggestions(tasksWithCooldowns);
        setStep('suggestions');
      } else {
        setError(t('addGoal.errors.failedSuggestions'));
      }
    } catch (err) {
      setError(t('addGoal.errors.failedSuggestions'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetNewSuggestions = async () => {
    setRandomSeed(Math.floor(Math.random() * 1000));
    await handleSubmitGoal();
  };
  
  const handleRefreshSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await subtractCredits(2);
      if (!success) {
        setError(t('addGoal.errors.notEnoughCreditsRefresh'));
        setIsLoading(false);
        return;
      }
      
      const response = await breakdownGoal(goalInput, 0, apiKey!, rejected, randomSeed);
      
      if (response && response.tasks && response.tasks.length > 0) {
        const tasksWithCooldowns = await loadCooldownOptions(response.tasks);
        setSuggestions(tasksWithCooldowns);
      } else {
        setError(t('addGoal.errors.failedNewSuggestions'));
      }
    } catch (err) {
      setError(t('addGoal.errors.failedNewSuggestions'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCooldown = (taskTitle: string, minutes: number) => {
    setSuggestions(suggestions.map(suggestion => 
      suggestion.title === taskTitle
        ? { ...suggestion, selectedCooldown: minutes }
        : suggestion
    ));

    setSelectedSuggestions(selectedSuggestions.map(suggestion =>
      suggestion.title === taskTitle
        ? { ...suggestion, selectedCooldown: minutes }
        : suggestion
    ));
  };
  
  const handleSelectSuggestion = (suggestion: TaskWithCooldowns) => {
    if (selectedSuggestions.find(s => s.title === suggestion.title)) {
      setSelectedSuggestions(selectedSuggestions.filter(s => s.title !== suggestion.title));
    } else {
      setSelectedSuggestions([...selectedSuggestions, suggestion]);
    }
    
    if (rejected.includes(suggestion.title)) {
      setRejected(rejected.filter(r => r !== suggestion.title));
    }
  };
  
  const handleRejectSuggestion = (suggestion: TaskWithCooldowns) => {
    if (selectedSuggestions.find(s => s.title === suggestion.title)) {
      setSelectedSuggestions(selectedSuggestions.filter(s => s.title !== suggestion.title));
    }
    
    if (!rejected.includes(suggestion.title)) {
      setRejected([...rejected, suggestion.title]);
    }
  };
  
  const handleSaveGoal = async () => {
    if (selectedSuggestions.length === 0) {
      setError(t('addGoal.errors.selectTask'));
      return;
    }
    
    try {
      setIsLoading(true);
      
      const goalId = await db.goals.add({
        title: goalInput,
        createdAt: new Date(),
      });
      
      const tasks: Task[] = selectedSuggestions.map(suggestion => ({
        goalId,
        title: suggestion.title,
        stat: suggestion.stat,
        depth: 0,
        xpValue: 10 + Math.floor(Math.random() * 10), // 10-19 XP
        isDone: false,
        cooldownMinutes: suggestion.selectedCooldown || 1440,
        createdAt: new Date(),
      }));
      
      await db.tasks.bulkAdd(tasks);
      
      refreshData();
      navigate('/');
    } catch (err) {
      setError(t('addGoal.errors.savingError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setError(t('addGoal.errors.enterApiKey'));
      return;
    }
    
    try {
      setIsLoading(true);
      await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKeyInput}`,
        },
      });
      
      await apiKeyContext.setApiKey(apiKeyInput);
      
      setStep('input');
      handleSubmitGoal();
    } catch (err) {
      setError(t('addGoal.errors.invalidApiKey'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (step === 'input') {
        handleSubmitGoal();
      } else if (step === 'apiKey') {
        handleSubmitApiKey();
      }
    }
  }, [step, goalInput, apiKeyInput]);
  
  return (
    <div className="max-w-md mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('addGoal.title')}</h1>
      
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <GoalInputSection
            goalInput={goalInput}
            setGoalInput={setGoalInput}
            suggestedGoals={suggestedGoals}
            error={error}
            isLoading={isLoading}
            handleSubmitGoal={handleSubmitGoal}
            handleGetNewSuggestions={handleGetNewSuggestions}
            handleKeyPress={handleKeyPress}
          />
        )}
        
        {step === 'apiKey' && (
          <ApiKeySection
            apiKeyInput={apiKeyInput}
            setApiKeyInput={setApiKeyInput}
            error={error}
            isLoading={isLoading}
            handleKeyPress={handleKeyPress}
            handleSubmitApiKey={handleSubmitApiKey}
            goBack={() => setStep('input')}
          />
        )}
        
        {step === 'suggestions' && (
          <TaskSuggestionSection
            suggestions={suggestions}
            selectedSuggestions={selectedSuggestions}
            rejected={rejected}
            error={error}
            isLoading={isLoading}
            formatMinutes={formatMinutes}
            handleSelectSuggestion={handleSelectSuggestion}
            handleRejectSuggestion={handleRejectSuggestion}
            handleSelectCooldown={handleSelectCooldown}
            handleRefreshSuggestions={handleRefreshSuggestions}
            handleSaveGoal={handleSaveGoal}
            goBack={() => setStep('input')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddGoal;