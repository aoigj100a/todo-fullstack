// src/types/index.ts
// 集中導出所有型別，便於在應用中一致使用

// 重新導出所有模組
export * from './auth';
export * from './todo';
export * from './api';
export * from './ui';

// 可以在這裡定義一些共用的基礎型別
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// 可選: 擴展 Window 介面增加全域類型
declare global {
  interface Window {
    // 在需要時可以擴展 Window 類型
  }
}
