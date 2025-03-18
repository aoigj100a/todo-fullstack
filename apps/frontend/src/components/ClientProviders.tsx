// src/components/ClientProviders.tsx
'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
