import { CreateTodoInput, Todo, TodoStatus } from '@/types/todo';

// src/service/todo.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const todoService = {
  getTodos: async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  createTodo: async (todo: CreateTodoInput) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  updateTodo: async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  toggleTodoStatus: async (id: string, currentStatus: TodoStatus) => {
    const nextStatus: Record<TodoStatus, TodoStatus> = {
      pending: 'in-progress',
      'in-progress': 'completed',
      completed: 'pending',
    };
    const newStatus = nextStatus[currentStatus];
    return todoService.updateTodo(id, { status: newStatus });
  },

  deleteTodo: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },
};
