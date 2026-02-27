// src/components/ClientProviders.tsx
'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useKeepAlive } from '@/hooks/useKeepAlive';

function KeepAlive() {
  useKeepAlive();
  return null;
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <KeepAlive />
          {children}
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
