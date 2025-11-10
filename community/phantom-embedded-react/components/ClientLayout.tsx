'use client';

import { ReactNode } from 'react';
import { Providers } from '@/app/providers';

/**
 * Client-side layout wrapper
 * Provides Phantom provider to all children
 */
export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}

