// apps/frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { authService } from '@/service/auth';

// 定義 AuthContext 的類型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 創建 AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 元件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 檢查用戶是否已登入
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 從 localStorage 獲取用戶資訊
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to check authentication status', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 提供給 context 的值
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async () => {}, // 暫時是空函數，下一步實現
    register: async () => {}, // 暫時是空函數，下一步實現
    logout: () => {}, // 暫時是空函數，下一步實現
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// 自定義 hook 用於訪問 AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
