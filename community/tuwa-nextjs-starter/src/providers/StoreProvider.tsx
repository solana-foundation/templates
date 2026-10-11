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
  const [store] = useState(() => {
    // Only the latest fetch may update the list: a slower, older response never overwrites a newer one
    let latestRequest = 0;
    return createStore<Store>()((set, get) => ({
      accounts: {},
      accountsLoading: true,
      accountsError: null,
      getAccounts: async () => {
        const request = ++latestRequest;
        // A retry after a failed fetch shows the spinner again
        if (get().accountsError) set({ accountsLoading: true, accountsError: null });
        try {
          const counters = await getSolanatestProgramAccounts(
            createSolanaRPC({ rpcUrlOrMoniker: 'devnet', rpcUrls: solanaRPCUrls }),
            PROGRAM_ID,
          );
          if (request !== latestRequest) return;
          // The response is the full list: counters closed elsewhere disappear as well
          set({
            accounts: Object.fromEntries(counters.map((counter) => [counter.address, counter.data.count])),
            accountsLoading: false,
            accountsError: null,
          });
        } catch (error) {
          if (request !== latestRequest) return;
          set({ accountsLoading: false, accountsError: error instanceof Error ? error.message : String(error) });
        }
      },
      removeAccFromStore: (address) => {
        set((state) =>
          produce(state, (draft) => {
            delete draft.accounts[address];
          }),
        );
      },
    }));
  });

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
