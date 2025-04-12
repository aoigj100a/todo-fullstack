// apps/frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { User, LoginInput, RegisterInput } from '@/types/auth';
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
  const router = useRouter();
  const { toast } = useToast();

  // 檢查用戶是否已登入
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 從 localStorage 獲取用戶資訊
        const token = authService.getToken();
        const storedUser = authService.getUser();

        if (token && storedUser) {
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

  // 登入方法
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loginInput: LoginInput = { email, password };
      const response = await authService.login(loginInput);

      // 儲存 token 和用戶資訊
      authService.setToken(response.token);
      authService.setUser(response.user);
      setUser(response.user);

      toast({
        title: '登入成功',
        description: '您已成功登入系統',
      });

      // 重定向到待辦事項頁面
      router.push('/todos');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: '登入失敗',
        description: error instanceof Error ? error.message : '帳號或密碼錯誤',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 註冊方法
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const registerInput: RegisterInput = { name, email, password };
      const response = await authService.register(registerInput);

      // 儲存 token 和用戶資訊
      authService.setToken(response.token);
      authService.setUser(response.user);
      setUser(response.user);

      toast({
        title: '註冊成功',
        description: '您的帳號已成功創建',
      });

      // 重定向到待辦事項頁面
      router.push('/todos');
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: '註冊失敗',
        description: error instanceof Error ? error.message : '註冊過程中發生錯誤',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出方法
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
    toast({
      title: '登出成功',
      description: '您已成功登出系統',
    });
  };

  // 提供給 context 的值
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
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
