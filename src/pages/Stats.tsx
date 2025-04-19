import React from 'react';
import { motion } from 'framer-motion';
import { useDatabase } from '../contexts/DatabaseContext';
import { Activity, Brain, Dumbbell, Heart } from 'lucide-react';

const Stats: React.FC = () => {
  const { user, tasks } = useDatabase();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Calculate completed tasks count
  const completedTasks = tasks.filter(task => task.isDone).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get stat distribution
  const strengthTasks = tasks.filter(task => task.stat === 'strength' && task.isDone).length;
  const vitalityTasks = tasks.filter(task => task.stat === 'vitality' && task.isDone).length;
  const focusTasks = tasks.filter(task => task.stat === 'focus' && task.isDone).length;
  
  // Calculate max stat for scaling the chart
  const maxStat = Math.max(user.strength, user.vitality, user.focus);
  
  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Stats</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Activity size={18} className="mr-2 text-primary-600" />
            Progress Overview
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Level</span>
                <span className="text-sm font-medium">{user.level}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${user.xp % 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Tasks Completed</span>
                <span className="text-sm font-medium">{completedTasks}/{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Current Streak</span>
                <span className="text-sm font-medium">{user.streak} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-success-500 to-accent-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, user.streak * 10)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Attributes</h2>
          
          <div className="flex justify-center p-4">
            <div className="relative h-52 w-52">
              {/* Stat Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full"></div>
              </div>
              
              {/* Strength */}
              <motion.div
                className="absolute top-1/2 left-1/2 h-1 bg-error-500"
                style={{ 
                  transformOrigin: 'left center',
                  transform: 'rotate(0deg) translateY(-50%)',
                  width: `${(user.strength / (maxStat * 1.2)) * 100}%`,
                  left: '50%',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(user.strength / (maxStat * 1.2)) * 100}%` }}
                transition={{ duration: 1 }}
              />
              
              {/* Vitality */}
              <motion.div
                className="absolute top-1/2 left-1/2 h-1 bg-success-500"
                style={{ 
                  transformOrigin: 'left center',
                  transform: 'rotate(120deg) translateY(-50%)',
                  width: `${(user.vitality / (maxStat * 1.2)) * 100}%`,
                  left: '50%',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(user.vitality / (maxStat * 1.2)) * 100}%` }}
                transition={{ duration: 1 }}
              />
              
              {/* Focus */}
              <motion.div
                className="absolute top-1/2 left-1/2 h-1 bg-warning-500"
                style={{ 
                  transformOrigin: 'left center',
                  transform: 'rotate(240deg) translateY(-50%)',
                  width: `${(user.focus / (maxStat * 1.2)) * 100}%`,
                  left: '50%',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(user.focus / (maxStat * 1.2)) * 100}%` }}
                transition={{ duration: 1 }}
              />
              
              {/* Labels */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 flex flex-col items-center">
                <Dumbbell size={16} className="text-error-500 mb-1" />
                <span className="text-xs font-medium">STR: {user.strength}</span>
              </div>
              
              <div className="absolute bottom-12 left-0 flex flex-col items-center">
                <Heart size={16} className="text-success-500 mb-1" />
                <span className="text-xs font-medium">VIT: {user.vitality}</span>
              </div>
              
              <div className="absolute bottom-12 right-0 flex flex-col items-center">
                <Brain size={16} className="text-warning-500 mb-1" />
                <span className="text-xs font-medium">FOC: {user.focus}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Task Distribution</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-full h-24 bg-gray-100 rounded-md relative">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-error-500 rounded-b-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${(strengthTasks / Math.max(totalTasks, 1)) * 100}%` }}
                  transition={{ duration: 1 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  {strengthTasks}
                </div>
              </div>
              <span className="mt-2 text-sm font-medium flex items-center text-error-500">
                <Dumbbell size={14} className="mr-1" />
                Strength
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-full h-24 bg-gray-100 rounded-md relative">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-success-500 rounded-b-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${(vitalityTasks / Math.max(totalTasks, 1)) * 100}%` }}
                  transition={{ duration: 1 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  {vitalityTasks}
                </div>
              </div>
              <span className="mt-2 text-sm font-medium flex items-center text-success-500">
                <Heart size={14} className="mr-1" />
                Vitality
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-full h-24 bg-gray-100 rounded-md relative">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-warning-500 rounded-b-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${(focusTasks / Math.max(totalTasks, 1)) * 100}%` }}
                  transition={{ duration: 1 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  {focusTasks}
                </div>
              </div>
              <span className="mt-2 text-sm font-medium flex items-center text-warning-500">
                <Brain size={14} className="mr-1" />
                Focus
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;