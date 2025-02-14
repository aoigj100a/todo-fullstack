// src/services/todo.ts
import { CreateTodoInput, Todo, UpdateTodoInput, TodoFilters } from '@/types/todo';
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const todoService = {
  async getTodos(filters?: TodoFilters): Promise<Todo[]> {
    const token = authService.getToken();
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.assignedTo) queryParams.append('assignedTo', filters.assignedTo);

    const response = await fetch(`${API_URL}/todos?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    return response.json();
  },

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }

    return response.json();
  },

  async updateTodo(input: UpdateTodoInput): Promise<Todo> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/todos/${input.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    return response.json();
  },

  async deleteTodo(id: string): Promise<void> {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },
};