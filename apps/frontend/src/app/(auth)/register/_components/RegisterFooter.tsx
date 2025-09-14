import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';

export function RegisterFooter() {
  return (
    <CardFooter className="flex flex-col space-y-5">
      <p className="text-base text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-teal-500 hover:underline font-medium">
          Login
        </Link>
      </p>
    </CardFooter>
  );
}
