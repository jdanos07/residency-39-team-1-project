import type { Task } from '../types/task';

export interface CreateTaskInput {
  title: string;
  notes?: string;
  priority?: number;
  dueDate?: number;
  state?: Task['state'];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export interface TaskService {
  list(userId: string): Promise<Task[]>;
  get(id: string): Promise<Task | null>;
  create(userId: string, input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  remove(id: string): Promise<void>;
}