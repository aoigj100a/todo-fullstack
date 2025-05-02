// src/types/todo.ts
// 待辦事項相關型別定義

import { BaseEntity } from './index';

/**
 * 待辦事項狀態
 */
export type TodoStatus = 'pending' | 'in-progress' | 'completed';

/**
 * 待辦事項篩選視圖類型
 */
export type TodoViewType = 'list' | 'board';

/**
 * 待辦事項篩選狀態
 */
export type FilterStatus = 'all' | TodoStatus;

/**
 * 待辦事項基本資料
 */
export interface Todo extends BaseEntity {
  title: string;
  description?: string;
  status: TodoStatus;
  assignedTo: string;
  completedAt?: string;
}

/**
 * 建立待辦事項請求參數
 */
export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
  assignedTo?: string;
}

/**
 * 更新待辦事項請求參數
 */
export interface UpdateTodoInput extends Partial<CreateTodoInput> {
  id: string;
}

/**
 * 刪除待辦事項請求參數
 */
export interface DeleteTodoInput {
  id: string;
}

/**
 * 待辦事項篩選條件
 */
export interface TodoFilters {
  status?: TodoStatus;
  search?: string;
  assignedTo?: string;
  date?: {
    from?: Date;
    to?: Date;
  };
}

/**
 * 待辦事項狀態計數
 */
export interface TodoStatusCounts {
  all: number;
  pending: number;
  'in-progress': number;
  completed: number;
}
