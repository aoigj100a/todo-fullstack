// src/hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { LoginInput, RegisterInput, User } from '@/types/auth';
import { authService } from '@/service/auth';
import { useAsync } from './use-async';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const { run, isLoading } = useAsync();
  const router = useRouter();

  useEffect(() => {
    // 檢查本地儲存的使用者資訊
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (data: LoginInput) => {
    const response = await run(authService.login(data));
    setUser(response.user);
    router.push('/todos');
    return response;
  };

  const register = async (data: RegisterInput) => {
    const response = await run(authService.register(data));
    setUser(response.user);
    router.push('/todos');
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };
}