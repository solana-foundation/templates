'use client';

import { ConnectButton } from '@tuwaio/sdk/nova-connect/components';
import { cn } from '@tuwaio/sdk/nova-core/utils';

import { labelClassName } from '@/components/classNames';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';

export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] px-4 py-2.5 sm:px-6">
      <a href="/" className={cn(labelClassName, 'flex items-center gap-2.5 text-[var(--tuwa-text-primary)]')}>
        <span aria-hidden="true" className="h-2 w-2 bg-[var(--tuwa-text-primary)]" />
        Solana Demo App
      </a>

      <ConnectButton transactionPool={transactionPool} />
    </header>
  );
}
