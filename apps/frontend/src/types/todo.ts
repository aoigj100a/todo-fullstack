// src/types/todo.ts
export interface Todo {
  _id: string;          // MongoDB 使用 _id
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  completedAt?:string;
}

export type TodoStatus = "pending" | "in-progress" | "completed";
  
  export interface CreateTodoInput {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    assignedTo?: string;
  }
  
  export interface UpdateTodoInput extends Partial<CreateTodoInput> {
    id: string;
  }

  export interface DeleteTodoInput {
    id: string;
  }
  
  export interface TodoFilters {
    status?: 'pending' | 'in-progress' | 'completed';
    search?: string;
    assignedTo?: string;
  }