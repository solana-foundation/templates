'use client';

import { ReactNode } from 'react';

import { SatelliteConnectProviders } from '@/providers/SatelliteConnectProviders';
import { StoreProvider } from '@/providers/StoreProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SatelliteConnectProviders>
      <StoreProvider>{children}</StoreProvider>
    </SatelliteConnectProviders>
  );
}
