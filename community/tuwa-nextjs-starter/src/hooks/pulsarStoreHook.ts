'use client';

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/sdk/pulsar';
import { pulsarSolanaAdapter } from '@tuwaio/solana-sdk/pulsar';

import { solanaRPCUrls } from '@/configs/appConfig';
import { TransactionUnion } from '@/transactions';

const storageName = 'transactions-tracking-storage-new';

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: storageName,
    adapter: [
      pulsarSolanaAdapter({
        rpcUrls: solanaRPCUrls,
      }),
    ],
  }),
);
