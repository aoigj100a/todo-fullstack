// src/app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LockKeyhole } from 'lucide-react';

import { LoginInput } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/service/auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 當登入成功狀態改變時重定向
  useEffect(() => {
    if (loginSuccess) {
      // 確保 toast 有時間顯示
      const redirectTimer = setTimeout(() => {
        router.push('/todos');
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [loginSuccess, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const input: LoginInput = { email, password };

    try {
      // 驗證輸入
      if (!input.email || !input.password) {
        throw new Error('Email and password are required');
      }

      console.log('Submitting login with:', input.email);
      const response = await authService.login(input);
      console.log('Login response received:', response);

      authService.setToken(response.token);
      authService.setUser(response.user);

      // 顯示成功訊息
      toast({
        title: 'Login successful',
        description: 'Redirecting to dashboard...',
      });

      // 設置成功狀態觸發重定向
      setLoginSuccess(true);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Failed to login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <LockKeyhole className="h-8 w-8 text-teal-500" />
            <span>Login</span>
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 text-base"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 pb-6">
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-teal-500 hover:bg-teal-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-base text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-teal-500 hover:underline font-medium">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
