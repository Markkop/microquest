import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';
import TaskCard from '../components/TaskCard';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, goals, tasks } = useDatabase();
  const navigate = useNavigate();
  const [activeTasks, setActiveTasks] = useState<typeof tasks>([]);
  const [completedTasks, setCompletedTasks] = useState<typeof tasks>([]);

  // Filter and sort tasks
  useEffect(() => {
    const active = tasks.filter(task => !task.isDone);
    const completed = tasks.filter(task => task.isDone);
    
    // Sort by creation date (newest first for active, oldest first for completed)
    active.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    completed.sort((a, b) => new Date(b.lastClaimedAt!).getTime() - new Date(a.lastClaimedAt!).getTime());
    
    setActiveTasks(active);
    setCompletedTasks(completed.slice(0, 5)); // Show only the 5 most recently completed
  }, [tasks]);

  return (
    <div className="pb-20">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.todayQuests')}</h1>
          <motion.button
            className="flex items-center gap-1 text-sm font-medium text-primary-600"
            onClick={() => navigate('/add')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            <span>{t('dashboard.newGoal')}</span>
          </motion.button>
        </div>
        
        {activeTasks.length === 0 ? (
          <motion.div 
            className="bg-white rounded-lg p-6 text-center border border-dashed border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gray-600 mb-4">{t('dashboard.noTasks')}</p>
            <motion.button
              className="py-2 px-4 bg-primary-600 text-white rounded-lg shadow-sm"
              onClick={() => navigate('/add')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('dashboard.createGoal')}
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {activeTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">{t('dashboard.recentlyCompleted')}</h2>
          <div className="space-y-3 opacity-75">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
      
      {user && user.streak > 0 && (
        <motion.div 
          className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 border border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="mr-4 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl font-bold text-primary-600">{user.streak}</span>
            </div>
            <div>
              <h3 className="font-medium text-primary-900">{t('dashboard.dayStreak')}</h3>
              <p className="text-sm text-primary-700">
                {t('dashboard.keepItUp')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;