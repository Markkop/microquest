import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApiKeySectionProps {
  apiKeyInput: string;
  setApiKeyInput: (value: string) => void;
  error: string | null;
  isLoading: boolean;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSubmitApiKey: () => void;
  goBack: () => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKeyInput,
  setApiKeyInput,
  error,
  isLoading,
  handleKeyPress,
  handleSubmitApiKey,
  goBack,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="apiKey"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('addGoal.apiKey.title')}
        </label>
        <input
          type="password"
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('addGoal.apiKey.placeholder')}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        />
        {error && (
          <p className="text-error-500 text-sm mt-2 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          {t('addGoal.apiKey.description')}
        </p>
      </div>
      
      <div className="flex justify-between">
        <motion.button
          className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700"
          onClick={goBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('common.back')}
        </motion.button>
        
        <motion.button
          className="py-2 px-4 bg-primary-600 text-white rounded-lg shadow-sm disabled:opacity-50"
          onClick={handleSubmitApiKey}
          disabled={!apiKeyInput.trim() || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? t('addGoal.apiKey.verifying') : t('common.continue')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ApiKeySection;