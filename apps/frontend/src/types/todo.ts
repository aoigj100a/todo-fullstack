// src/types/todo.ts
export interface Todo {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTodoInput {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    assignedTo?: string;
  }
  
  export interface UpdateTodoInput extends Partial<CreateTodoInput> {
    id: string;
  }
  
  export interface TodoFilters {
    status?: 'pending' | 'in-progress' | 'completed';
    search?: string;
    assignedTo?: string;
  }