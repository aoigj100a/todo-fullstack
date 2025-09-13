import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function LoginForm({ email, password, onEmailChange, onPasswordChange }: LoginFormProps) {
  return (
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
          onChange={e => onEmailChange(e.target.value)}
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
          onChange={e => onPasswordChange(e.target.value)}
          placeholder="Enter your password"
          className="h-12 text-base"
          required
        />
      </div>
    </CardContent>
  );
}