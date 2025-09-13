import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LoginFooterProps {
  isLoading: boolean;
}

export function LoginFooter({ isLoading }: LoginFooterProps) {
  return (
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
  );
}