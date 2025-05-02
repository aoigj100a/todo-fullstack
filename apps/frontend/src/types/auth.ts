// src/types/auth.ts
// 認證相關型別定義

import { BaseEntity } from './index';

/**
 * 登入請求參數
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * 註冊請求參數
 */
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

/**
 * 用戶資訊
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * 用戶資訊（含敏感資料）
 * 僅用於伺服器端
 */
export interface UserWithSensitiveData extends User {
  password: string;
}

/**
 * 認證回應
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * JWT Payload 結構
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number; // 發行時間
  exp?: number; // 過期時間
}

/**
 * 認證上下文狀態
 */
export interface AuthContextState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * 認證錯誤類型
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  EMAIL_EXISTS = 'email_exists',
  UNAUTHORIZED = 'unauthorized',
  TOKEN_EXPIRED = 'token_expired',
  SERVER_ERROR = 'server_error',
}
