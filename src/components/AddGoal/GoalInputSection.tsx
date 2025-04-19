import React from 'react';
import { motion } from 'framer-motion';
import { SendHorizontal, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SuggestedGoal {
  title: string;
  icon: React.ReactNode;
}

interface GoalInputSectionProps {
  goalInput: string;
  setGoalInput: (value: string) => void;
  suggestedGoals: SuggestedGoal[];
  error: string | null;
  isLoading: boolean;
  handleSubmitGoal: () => void;
  handleGetNewSuggestions: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const GoalInputSection: React.FC<GoalInputSectionProps> = ({
  goalInput,
  setGoalInput,
  suggestedGoals,
  error,
  isLoading,
  handleSubmitGoal,
  handleGetNewSuggestions,
  handleKeyPress,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('addGoal.whatIsYourGoal')}
        </label>
        <div className="flex gap-2 mb-3">
          {suggestedGoals.map((goal, index) => (
            <motion.button
              key={index}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setGoalInput(goal.title);
                handleGetNewSuggestions();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {goal.icon}
              <span className="truncate">{goal.title}</span>
            </motion.button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('addGoal.goalPlaceholder')}
            className="w-full p-3 pr-24 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <motion.button
              className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-50"
              onClick={handleSubmitGoal}
              disabled={!goalInput.trim() || isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={16} />
                </motion.div>
              ) : (
                <SendHorizontal size={16} />
              )}
            </motion.button>
          </div>
        </div>
        {error && (
          <p className="text-error-500 text-sm mt-2 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error}
          </p>
        )}
      </div>
      
      <div className="bg-primary-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Sparkles size={18} className="text-primary-600 mr-2 mt-1" />
          <div>
            <p className="text-sm text-primary-900 mb-1">
              <span className="font-medium">{t('addGoal.howItWorks.title')}</span> {t('addGoal.howItWorks.description')}
            </p>
            <p className="text-xs text-primary-700">
              {t('addGoal.howItWorks.credits')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalInputSection;