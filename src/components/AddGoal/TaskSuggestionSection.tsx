import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Plus, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CooldownOptions from './CooldownOptions';
import { TaskWithCooldowns } from './types';

interface TaskSuggestionSectionProps {
  suggestions: TaskWithCooldowns[];
  selectedSuggestions: TaskWithCooldowns[];
  rejected: string[];
  error: string | null;
  isLoading: boolean;
  formatMinutes: (minutes: number) => string;
  handleSelectSuggestion: (suggestion: TaskWithCooldowns) => void;
  handleRejectSuggestion: (suggestion: TaskWithCooldowns) => void;
  handleSelectCooldown: (taskTitle: string, minutes: number) => void;
  handleRefreshSuggestions: () => void;
  handleSaveGoal: () => void;
  goBack: () => void;
}

const TaskSuggestionSection: React.FC<TaskSuggestionSectionProps> = ({
  suggestions,
  selectedSuggestions,
  rejected,
  error,
  isLoading,
  formatMinutes,
  handleSelectSuggestion,
  handleRejectSuggestion,
  handleSelectCooldown,
  handleRefreshSuggestions,
  handleSaveGoal,
  goBack,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="suggestions"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">{t('addGoal.suggestions.title')}</h2>
        <p className="text-sm text-gray-600">{t('addGoal.suggestions.description')}</p>
      </div>
      
      <div className="space-y-3 mb-6">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-lg border cursor-pointer
                      ${selectedSuggestions.find(s => s.title === suggestion.title)
                        ? 'border-primary-500 bg-primary-50'
                        : rejected.includes(suggestion.title)
                          ? 'border-gray-200 bg-gray-50 opacity-50'
                          : 'border-gray-200 hover:border-primary-200 hover:bg-primary-50/20'
                     }`}
            onClick={() => handleSelectSuggestion(suggestion)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 capitalize">
                    {t(`stats.${suggestion.stat}`)}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{suggestion.title}</p>
                <p className="text-sm text-gray-600 mt-1">{suggestion.reason}</p>
                
                {suggestion.cooldownOptions && (
                  <CooldownOptions
                    options={suggestion.cooldownOptions}
                    selectedCooldown={suggestion.selectedCooldown || 1440}
                    onSelect={(minutes) => handleSelectCooldown(suggestion.title, minutes)}
                    formatMinutes={formatMinutes}
                  />
                )}
              </div>
              
              {selectedSuggestions.find(s => s.title === suggestion.title) ? (
                <div className="ml-2 h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              ) : rejected.includes(suggestion.title) ? (
                <motion.button
                  className="ml-2 h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSuggestion(suggestion);
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Plus size={14} className="text-gray-500" />
                </motion.button>
              ) : (
                <motion.button
                  className="ml-2 h-6 w-6 rounded-full border border-gray-300 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejectSuggestion(suggestion);
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <X size={14} className="text-gray-500" />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {error && (
        <p className="text-error-500 text-sm mb-4 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </p>
      )}
      
      <div className="flex justify-between">
        <div className="flex gap-3">
          <motion.button
            className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700"
            onClick={goBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('common.back')}
          </motion.button>
          
          <motion.button
            className="py-2 px-4 border border-gray-300 rounded-lg text-primary-700 flex items-center gap-1 disabled:opacity-50"
            onClick={handleRefreshSuggestions}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={14} />
              </motion.div>
            ) : (
              <>
                <RefreshCw size={14} />
                <span>{t('addGoal.suggestions.refresh')}</span>
              </>
            )}
          </motion.button>
        </div>
        
        <motion.button
          className="py-2 px-4 bg-primary-600 text-white rounded-lg shadow-sm disabled:opacity-50"
          onClick={handleSaveGoal}
          disabled={selectedSuggestions.length === 0 || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('common.save')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskSuggestionSection;