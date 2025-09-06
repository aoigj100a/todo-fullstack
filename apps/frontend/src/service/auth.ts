// src/services/auth.ts
import { LoginInput, AuthResponse, RegisterInput } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        // 確保傳遞 credentials
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to login');
      }

      const data = await response.json();
      
      // eslint-disable-next-line no-console
      console.log('Login successful:', data);

      // 確保返回格式一致
      return {
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      throw error;
    }
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }

    return response.json();
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      // 先檢查 localStorage，再檢查 sessionStorage
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  },

  setToken(token: string, remember: boolean = false): void {
    if (typeof window !== 'undefined') {
      // 如果 remember 為 true，則使用 localStorage 存儲 token
      // 否則使用 sessionStorage (瀏覽器關閉時會自動清除)
      if (remember) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
    }
  },

  setUser(user: Record<string, unknown>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  getUser(): Record<string, unknown> | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};
