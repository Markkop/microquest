import React from 'react';
import { motion } from 'framer-motion';
import { Check, Dumbbell, Brain, Zap, Clock } from 'lucide-react';
import { Task } from '../db/database';
import { useGame } from '../contexts/GameContext';
import { useTranslation } from 'react-i18next';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { t } = useTranslation();
  const { completeTask } = useGame();
  
  const handleComplete = async () => {
    if (!task.isDone && (!task.nextAvailableAt || new Date() >= new Date(task.nextAvailableAt))) {
      await completeTask(task.id!);
    }
  };
  
  // Calculate time remaining until task is available
  const getTimeRemaining = () => {
    if (!task.nextAvailableAt) return null;
    
    const now = new Date();
    const nextAvailable = new Date(task.nextAvailableAt);
    
    if (now >= nextAvailable) return null;
    
    const diff = nextAvailable.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return t('task.timeRemaining.hours', { hours, minutes });
    }
    return t('task.timeRemaining.minutes', { minutes });
  };
  
  // Get the appropriate icon for the stat
  const StatIcon = () => {
    switch (task.stat) {
      case 'strength':
        return <Dumbbell size={16} className="text-error-500" />;
      case 'vitality':
        return <Heart size={16} className="text-success-500" />;
      case 'focus':
        return <Zap size={16} className="text-warning-500" />;
      default:
        return null;
    }
  };
  
  const timeRemaining = getTimeRemaining();
  const isAvailable = !task.nextAvailableAt || new Date() >= new Date(task.nextAvailableAt);
  
  return (
    <motion.div
      className={`p-4 rounded-lg shadow-sm border border-gray-100 bg-white
                 ${!isAvailable ? 'opacity-75' : task.isDone ? 'opacity-75' : 'hover:shadow-md'}`}
      whileHover={isAvailable && !task.isDone ? { scale: 1.02 } : {}}
      whileTap={isAvailable && !task.isDone ? { scale: 0.98 } : {}}
      layout
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatIcon />
            <span className="text-xs font-medium capitalize text-gray-500">
              {t(`stats.${task.stat}`)}
            </span>
            <span className="text-xs text-primary-600 font-medium ml-auto">
              +{task.xpValue} XP
            </span>
          </div>
          <p className={`text-gray-900 font-medium ${task.isDone ? 'line-through' : ''}`}>
            {task.title}
          </p>
          {timeRemaining && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{timeRemaining}</span>
            </div>
          )}
        </div>
        
        {isAvailable ? (
          !task.isDone ? (
            <motion.button
              className="ml-4 h-8 w-8 rounded-full flex items-center justify-center border border-primary-200 text-primary-600 hover:bg-primary-50"
              onClick={handleComplete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Check size={16} />
            </motion.button>
          ) : (
            <div className="ml-4 h-8 w-8 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
              <Check size={16} />
            </div>
          )
        ) : (
          <div className="ml-4 h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
            <Clock size={16} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Define Heart component since it's not being imported
const Heart: React.FC<{ size: number; className: string }> = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
};

export default TaskCard;