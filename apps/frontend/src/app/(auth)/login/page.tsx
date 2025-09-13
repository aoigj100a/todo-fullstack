// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { LoginHeader } from './_components/LoginHeader';
import { LoginForm } from './_components/LoginForm';
import { LoginFooter } from './_components/LoginFooter';

import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth(); // Use auth context hook
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      // Don't need to manually navigate - the auth context will handle it
      toast.success('Login successful', {
        description: 'Redirecting to dashboard...',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Failed to login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <LoginHeader />
        <form onSubmit={handleSubmit}>
          <LoginForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
          />
          <LoginFooter isLoading={isLoading} />
        </form>
      </Card>
    </div>
  );
}
