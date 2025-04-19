import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, AlertCircle, User, Download, Trash2, Globe } from 'lucide-react';
import { db } from '../db/database';
import { useDatabase } from '../contexts/DatabaseContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { user, refreshData } = useDatabase();
  const { apiKey, setApiKey, hasApiKey } = useApiKey();
  const { language, setLanguage, availableLanguages } = useLanguage();
  
  const [name, setName] = useState(user?.name || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const handleUpdateName = async () => {
    if (!user) return;
    
    try {
      await db.users.update(user.id!, {
        name,
      });
      
      setMessage({ text: t('settings.messages.nameUpdated'), type: 'success' });
      refreshData();
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ text: t('settings.messages.nameError'), type: 'error' });
    }
  };
  
  const handleUpdateApiKey = async () => {
    try {
      // Verify API key with a simple call
      await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKeyInput}`,
        },
      });
      
      await setApiKey(apiKeyInput);
      setApiKeyInput('');
      setMessage({ text: t('settings.messages.apiKeyUpdated'), type: 'success' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ text: t('settings.messages.apiKeyError'), type: 'error' });
    }
  };
  
  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // Collect all data
      const userData = await db.users.toArray();
      const goalsData = await db.goals.toArray();
      const tasksData = await db.tasks.toArray();
      const insightCardsData = await db.insightCards.toArray();
      
      const exportData = {
        userData,
        goalsData,
        tasksData,
        insightCardsData,
        exportDate: new Date().toISOString(),
      };
      
      // Convert to JSON
      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `microquest-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage({ text: t('settings.messages.exportSuccess'), type: 'success' });
    } catch (err) {
      setMessage({ text: t('settings.messages.exportError'), type: 'error' });
    }
    
    setIsExporting(false);
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleResetData = async () => {
    setIsResetting(true);
    
    try {
      // Delete all data
      await db.users.clear();
      await db.goals.clear();
      await db.tasks.clear();
      await db.insightCards.clear();
      
      // Reinitialize database with default user
      await db.users.add({
        name: 'Player',
        credits: 1000,
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
      
      setMessage({ text: t('settings.messages.resetSuccess'), type: 'success' });
      refreshData();
      
      // Reload page to ensure everything is reset
      window.location.reload();
    } catch (err) {
      setMessage({ text: t('settings.messages.resetError'), type: 'error' });
    }
    
    setIsResetting(false);
  };
  
  return (
    <div className="max-w-md mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('settings.title')}</h1>
      
      {message && (
        <motion.div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-success-500/10 text-success-500' : 'bg-error-500/10 text-error-500'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>{message.text}</span>
          </div>
        </motion.div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Globe size={18} className="mr-2 text-primary-600" />
          {t('settings.language.title')}
        </h2>
        
        <div className="space-y-2">
          {availableLanguages.map((lang) => (
            <motion.button
              key={lang.code}
              className={`w-full p-3 rounded-lg border ${
                language === lang.code
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-200 hover:bg-primary-50/20'
              }`}
              onClick={() => setLanguage(lang.code)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {lang.name}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User size={18} className="mr-2 text-primary-600" />
          {t('settings.profile.title')}
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('settings.profile.yourName')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <motion.button
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg shadow-sm"
          onClick={handleUpdateName}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('settings.profile.updateProfile')}
        </motion.button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Key size={18} className="mr-2 text-primary-600" />
          {t('settings.apiKey.title')}
        </h2>
        
        {hasApiKey && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('settings.apiKey.current')}</span>
              <button
                className="text-xs text-primary-600 hover:text-primary-700"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? t('settings.apiKey.hide') : t('settings.apiKey.show')}
              </button>
            </div>
            {showApiKey ? (
              <div className="mt-1 font-mono text-sm truncate">{apiKey}</div>
            ) : (
              <div className="mt-1 font-mono text-sm">••••••••••••••••••••••••••</div>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {hasApiKey ? t('settings.apiKey.update') : t('settings.apiKey.save')}
          </label>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder={t('addGoal.apiKey.placeholder')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            {t('addGoal.apiKey.description')}
          </p>
        </div>
        
        <motion.button
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg shadow-sm"
          onClick={handleUpdateApiKey}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!apiKeyInput}
        >
          {hasApiKey ? t('settings.apiKey.update') : t('settings.apiKey.save')}
        </motion.button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('settings.data.title')}</h2>
        
        <div className="space-y-3">
          <motion.button
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 flex items-center justify-center"
            onClick={handleExportData}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isExporting}
          >
            <Download size={16} className="mr-2" />
            {isExporting ? t('settings.data.exporting') : t('settings.data.export')}
          </motion.button>
          
          <motion.button
            className="w-full py-2 px-4 border border-error-500 rounded-lg text-error-500 flex items-center justify-center hover:bg-error-50"
            onClick={() => {
              if (window.confirm(t('settings.data.resetConfirm'))) {
                handleResetData();
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isResetting}
          >
            <Trash2 size={16} className="mr-2" />
            {isResetting ? t('settings.data.resetting') : t('settings.data.reset')}
          </motion.button>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-4">
        <p>{t('settings.footer.version')}</p>
        <p>{t('settings.footer.copyright')}</p>
      </div>
    </div>
  );
};

export default Settings;