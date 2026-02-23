import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export function RegisterHeader() {
  return (
    <CardHeader className="text-center pb-6">
      <CardTitle className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
        <UserPlus className="h-8 w-8 text-teal-500" />
        <span>Register</span>
      </CardTitle>
      <CardDescription className="text-base text-muted-foreground">
        Create your account to get started
      </CardDescription>
    </CardHeader>
  );
}
