'use client';

import { NovaConnectProvider, type NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { SatelliteConnectProvider } from '@tuwaio/sdk/nova-connect/satellite';
import { SolanaConnectorsWatcher } from '@tuwaio/solana-sdk/nova-connect';
import { satelliteSolanaAdapter } from '@tuwaio/solana-sdk/satellite';
import { type ReactNode } from 'react';

import { solanaRPCUrls } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

// Created once: a new adapter on every render would make the provider update its store each time
const satelliteAdapter = satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls });

// Sign-in against the routes of src/app/api/siwx/[...siwx]/route.ts
const siwx: NovaConnectProviderProps['siwx'] = {
  expirationSeconds: 1800,
  getNonce: async () => {
    const res = await fetch('/api/siwx/nonce');
    return ((await res.json()) as { nonce: string }).nonce;
  },
  verifier: async (payload) => {
    const res = await fetch('/api/siwx/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok ? res.json() : null;
  },
  destroyer: async () => {
    await fetch('/api/siwx/logout', { method: 'POST' });
  },
  onError: (error) => {
    console.warn('[SIWX Auth Error]', error);
  },
};

export function SatelliteConnectProviders({ children }: { children: ReactNode }) {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider adapter={satelliteAdapter} autoConnect>
      <SolanaConnectorsWatcher />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionsPool}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        siwx={siwx}
        withBalance
        withChain
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
