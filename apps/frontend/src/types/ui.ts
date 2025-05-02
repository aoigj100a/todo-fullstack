// src/types/ui.ts
// UI 相關型別定義

import { ReactNode } from 'react';

/**
 * 基礎元件屬性
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/**
 * 語言選擇選項
 */
export type Language = 'en' | 'zh-TW';

/**
 * 主題選項
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 通知等級
 */
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';

/**
 * 通知選項
 */
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 按鈕變種
 */
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

/**
 * 按鈕尺寸
 */
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * 對話框尺寸
 */
export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * 響應式斷點
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * 圖標尺寸
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * 對齊方式
 */
export type Alignment = 'left' | 'center' | 'right';

/**
 * 文字截斷選項
 */
export interface TruncateOptions {
  lines?: number;
  ellipsis?: string;
  width?: string | number;
}
