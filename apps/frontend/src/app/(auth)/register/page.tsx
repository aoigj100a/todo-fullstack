// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
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

import { toast } from 'sonner';
import { authService } from '@/service/auth';
import { RegisterInput } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const input: RegisterInput = { ...formData };

    // 基本的密碼驗證
    if (input.password !== input.confirmPassword) {
      toast.error('Error', {
        description: 'Passwords do not match',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register(input);
      authService.setToken(response.token);
      authService.setUser(response.user);
      toast.success('Registration successful', {
        description: 'Redirecting to dashboard...',
      });

      router.push('/todos');
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to register',
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
            <UserPlus className="h-8 w-8 text-teal-500" />
            <span>Register</span>
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-base">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="h-12 text-base"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 pb-6">
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-teal-500 hover:bg-teal-600"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
            <p className="text-base text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-teal-500 hover:underline font-medium">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
