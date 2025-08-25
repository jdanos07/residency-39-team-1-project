import type { Task } from '../types/task';
import type { TaskService, CreateTaskInput, UpdateTaskInput } from './TaskService';

const BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://10.0.2.2:5000';

async function jsonOrThrow(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const TaskServiceRest: TaskService = {
  async list(userId) {
    const res = await fetch(`${BASE}/tasks?user_id=${encodeURIComponent(userId)}`);
    return (await jsonOrThrow(res)) as Task[];
  },
  async get(id) {
    const res = await fetch(`${BASE}/tasks/${id}`);
    if (res.status === 404) return null;
    return (await jsonOrThrow(res)) as Task;
  },
  async create(userId, input) {
    const res = await fetch(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, state: 'Exploring', ...input })
    });
    return (await jsonOrThrow(res)) as Task;
  },
  async update() {
    throw new Error('Task update not implemented on backend (PUT /tasks/:id).');
  },
  async remove(id) {
    const res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error('Delete failed');
  }
};