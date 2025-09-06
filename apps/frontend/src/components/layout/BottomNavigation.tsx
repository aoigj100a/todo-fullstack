'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const pathname = usePathname();

  // 跳過登入與註冊頁不顯示

  if (pathname === '/login' || pathname === '/register' || pathname === '/') return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-4">
        <Link
          href="/todos"
          className={cn(
            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
            pathname === '/todos' || pathname.startsWith('/todos/')
              ? 'text-teal-600 bg-teal-50'
              : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
          )}
        >
          <CheckSquare className="h-5 w-5" />
          <span className="text-xs font-medium">Todos</span>
        </Link>

        <Link
          href="/dashboard"
          className={cn(
            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
            pathname === '/dashboard'
              ? 'text-teal-600 bg-teal-50'
              : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs font-medium">Dashboard</span>
        </Link>

        <Link
          href="/profile"
          className={cn(
            'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
            pathname === '/profile'
              ? 'text-teal-600 bg-teal-50'
              : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
