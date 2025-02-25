// src/app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

import { LoginInput } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/service/auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

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

    const formData = new FormData(e.currentTarget);
    const input: LoginInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      // 驗證輸入
      if (!input.email || !input.password) {
        throw new Error("Email and password are required");
      }

      console.log("Submitting login with:", input.email);
      const response = await authService.login(input);
      console.log("Login response received:", response);
      
      authService.setToken(response.token);
      authService.setUser(response.user);
      
      // 顯示成功訊息
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });

      // 設置成功狀態觸發重定向
      setLoginSuccess(true);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestAccount = () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (emailInput && passwordInput) {
      emailInput.value = 'demo@example.com';
      passwordInput.value = 'demo1234';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Demo Account</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Email: demo@example.com<br />
                    Password: demo1234
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-2 h-8 text-xs bg-white w-full"
                    onClick={fillTestAccount}
                  >
                    Fill Test Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-teal-500 hover:bg-teal-600" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
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