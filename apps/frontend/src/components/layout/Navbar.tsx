'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  // 跳過登入/註冊頁面顯示導航
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    logout(); // Use the context method
    // No need to manually redirect
  };

  const navItems = [
    {
      href: '/todos',
      label: 'Todos',
      icon: CheckSquare,
      active: pathname === '/todos' || pathname.startsWith('/todos/'),
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      active: pathname === '/profile',
    },
  ];

  return (
    <header className="border-b bg-white flex justify-center">
      <div className="w-10/12 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/todos" className="font-semibold text-lg flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-teal-500" />
            Todo App
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4 mr-1" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
