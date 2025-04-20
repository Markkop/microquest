import { useCallback, useEffect, useState } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useGame } from '../contexts/GameContext';
import { Task } from '../db/database';

export const useTasks = () => {
  const { completeTask } = useGame();
  const { tasks } = useDatabase();

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  // Filter tasks by stat (strength, vitality, focus) or show all if filter is null
  useEffect(() => {
    if (!tasks) {
      setFilteredTasks([]);
      return;
    }

    if (filter) {
      setFilteredTasks(tasks.filter(task => task.stat === filter));
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, filter]);

  // Handle task completion
  const handleCompleteTask = useCallback(async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);

    if (task && !task.isDone && (!task.nextAvailableAt || new Date() >= new Date(task.nextAvailableAt))) {
      await completeTask(taskId);
    }
  }, [tasks, completeTask]);

  // Check if a task is available (not on cooldown)
  const isTaskAvailable = useCallback((task: Task) => {
    return !task.nextAvailableAt || new Date() >= new Date(task.nextAvailableAt);
  }, []);

  // Calculate time remaining for a task on cooldown
  const getTimeRemaining = useCallback((task: Task) => {
    if (!task.nextAvailableAt) return null;

    const now = new Date();
    const nextAvailable = new Date(task.nextAvailableAt);

    if (now >= nextAvailable) return null;

    const diff = nextAvailable.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  }, []);

  return {
    tasks: filteredTasks,
    setFilter,
    currentFilter: filter,
    completeTask: handleCompleteTask,
    isTaskAvailable,
    getTimeRemaining,
  };
}; 