import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { GameProvider } from './contexts/GameContext';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Pages
import Dashboard from './pages/Dashboard';
import AddGoal from './pages/AddGoal';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import HarvestModal from './components/HarvestModal';

// Initialize the app
import { initializeDb } from './db/database';

// Initialize the database
initializeDb();

function App() {
  return (
    <BrowserRouter>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LanguageProvider>
          <DatabaseProvider>
            <GameProvider>
              <ApiKeyProvider>
                <HarvestModal />
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="add" element={<AddGoal />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </ApiKeyProvider>
            </GameProvider>
          </DatabaseProvider>
        </LanguageProvider>
      </motion.div>
    </BrowserRouter>
  );
}

export default App;