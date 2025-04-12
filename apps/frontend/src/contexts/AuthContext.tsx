// apps/frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  updateUser: (userData: Partial<User>) => void;
}

// 創建 AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 公開路由列表 - 這些路由不需要身份驗證
const publicRoutes = ['/login', '/register', '/', '/guide'];

// AuthProvider 元件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  // 檢查 token 有效性的函數
  const checkTokenValidity = () => {
    const token = authService.getToken();
    if (!token) return false;

    // TODO: 在此添加 token 過期檢查邏輯
    // 如果後端實現了 token 過期時間，可以在這裡解析 JWT 並檢查有效期

    return true;
  };

  // 檢查用戶是否已登入
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValidToken = checkTokenValidity();
        const storedUser = authService.getUser();

        if (isValidToken && storedUser) {
          setUser(storedUser);
        } else if (!publicRoutes.includes(pathname || '')) {
          // 如果訪問的不是公開路由，但沒有有效的 token，則清除舊數據
          authService.logout();
        }
      } catch (error) {
        console.error('Failed to check authentication status', error);
        // 出錯時清除可能損壞的身份驗證數據
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // 路由保護 - 如果用戶未登入且訪問需要身份驗證的頁面，則重定向到登入頁
  useEffect(() => {
    if (!isLoading && !user && pathname && !publicRoutes.includes(pathname)) {
      toast({
        title: '需要登入',
        description: '請先登入以訪問此頁面',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [isLoading, user, pathname, router, toast]);

  // 登入方法
  const login = async (email: string, password: string, remember = false) => {
    setIsLoading(true);
    try {
      const loginInput: LoginInput = { email, password };
      const response = await authService.login(loginInput);

      // 儲存 token 和用戶資訊
      authService.setToken(response.token, remember);
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

  // 更新用戶資料
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      authService.setUser(updatedUser);
    }
  };

  // 提供給 context 的值
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
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
