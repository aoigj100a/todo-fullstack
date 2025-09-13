import { LockKeyhole } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function LoginHeader() {
  return (
    <CardHeader className="text-center pb-6">
      <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
        <LockKeyhole className="h-8 w-8 text-teal-500" />
        <span>Login</span>
      </CardTitle>
      <CardDescription className="text-base text-gray-600">
        Enter your credentials to access your account
      </CardDescription>
    </CardHeader>
  );
}