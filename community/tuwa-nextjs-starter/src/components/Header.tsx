'use client';

import { ConnectButton } from '@tuwaio/sdk/nova-connect/components';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';

export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);

  return (
    <header className="p-2 flex items-center justify-between gap-4 bg-[var(--tuwa-bg-secondary)] border-b border-[var(--tuwa-border-secondary)]">
      <a href="/" className="text-sm font-semibold text-[var(--tuwa-text-primary)]">
        Solana Demo App
      </a>

      <ConnectButton transactionPool={transactionPool} />
    </header>
  );
}
