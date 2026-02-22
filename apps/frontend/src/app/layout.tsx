// apps/frontend/src/app/layout.tsx (伺服器元件)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import ClientProviders from '@/components/ClientProviders';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';
import { BottomNavigation } from '@/components/layout/BottomNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A full-stack todo application built with Next.js and Express.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
          <main className="min-h-screen bg-gray-5 main-content">{children}</main>
          <BottomNavigation />
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
