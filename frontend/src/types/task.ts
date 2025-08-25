export type TaskState = 'Exploring' | 'Active' | 'Reviewing' | 'Complete';

export interface Task {
  id: string;
  userId: string;
  title: string;
  notes?: string;
  priority?: number;
  dueDate?: number; // epoch ms
  state: TaskState;
  createdAt?: number;
  updatedAt?: number;
}