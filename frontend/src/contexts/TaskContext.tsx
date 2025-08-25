import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import type { Task } from '../types/task';
import { TaskServiceRest } from '../services/TaskServiceRest';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTask: (title: string, opts?: Partial<Omit<Task, 'id' | 'userId' | 'title'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);
export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true); setError(null);
    try {
      const data = await TaskServiceRest.list(user.uid);
      setTasks(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load tasks');
    } finally { setIsLoading(false); }
  }, [user]);

  const addTask = useCallback(async (title: string, opts?: any) => {
    if (!user) throw new Error('Not authenticated');
    const created = await TaskServiceRest.create(user.uid, { title, ...opts });
    setTasks(prev => [created, ...prev]);
  }, [user]);

  const deleteTask = useCallback(async (id: string) => {
    await TaskServiceRest.remove(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => { if (user) { void refresh(); } else { setTasks([]); } }, [user, refresh]);

  const value = useMemo(() => ({ tasks, isLoading, error, refresh, addTask, deleteTask }), [tasks, isLoading, error, refresh, addTask, deleteTask]);
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};