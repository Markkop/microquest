import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import { useDatabase } from '../contexts/DatabaseContext';
import XpBar from './XpBar';
import { useTranslation } from 'react-i18next';
import AddCreditsButton from './AddCreditsButton';
import { FEATURES } from '../constants/features';

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading } = useDatabase();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary-600 text-xl font-medium">{t('common.loading')}</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-primary-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2" 
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              MicroQuest
            </span>
          </motion.div>
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('common.level')} {user.level}</span>
                <div className="w-16 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <XpBar level={user.level} xp={user.xp} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-primary-700">
                  {user.credits}
                </span>
                <span className="text-sm text-gray-600">{t('common.credits')}</span>
                {FEATURES.ADD_CREDITS_BUTTON && <AddCreditsButton />}
              </div>
            </div>
          )}
        </div>
        
        {user && (
          <div className="container mx-auto px-4 pb-2 sm:hidden">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('common.level')} {user.level}</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <XpBar level={user.level} xp={user.xp} />
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <Navigation />
    </div>
  );
};

export default Layout;