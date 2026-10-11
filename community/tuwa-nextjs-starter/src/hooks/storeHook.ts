'use client';

import { createContext, useContext } from 'react';
import { StoreApi, useStore as uS } from 'zustand';

export type Store = {
  accounts: Record<string, number>;
  accountsLoading: boolean;
  getAccounts: () => Promise<void>;
  removeAccFromStore: (address: string) => void;
};

export const StoreContext = createContext<StoreApi<Store> | null>(null);

export const useStore = <T>(selector: (state: Store) => T): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return uS(store, selector);
};
