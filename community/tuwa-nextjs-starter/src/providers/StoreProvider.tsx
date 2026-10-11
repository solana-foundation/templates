'use client';

import { createSolanaRPC } from '@tuwaio/solana-sdk/orbit';
import { produce } from 'immer';
import { PropsWithChildren, useState } from 'react';
import { createStore } from 'zustand/vanilla';

import { solanaRPCUrls } from '@/configs/appConfig';
import { PROGRAM_ID } from '@/constants';
import { Store, StoreContext } from '@/hooks/storeHook';
import { getSolanatestProgramAccounts } from '@/programs';

// The counter accounts of the demo Solana program on devnet, shown by the Solana block
export function StoreProvider({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<Store>()((set) => ({
      accounts: {},
      accountsLoading: true,
      getAccounts: async () => {
        const counters = await getSolanatestProgramAccounts(
          createSolanaRPC({ rpcUrlOrMoniker: 'devnet', rpcUrls: solanaRPCUrls }),
          PROGRAM_ID,
        );
        set((state) =>
          produce(state, (draft) => {
            counters.forEach((counter) => {
              draft.accounts[counter.address] = counter.data.count;
            });
            draft.accountsLoading = false;
          }),
        );
      },
      removeAccFromStore: (address) => {
        set((state) =>
          produce(state, (draft) => {
            delete draft.accounts[address];
          }),
        );
      },
    })),
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
