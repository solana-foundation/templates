'use client';

import { ConnectButton } from '@tuwaio/sdk/nova-connect/components';
import Image from 'next/image';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';

export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);

  return (
    <header className="p-2 flex items-center justify-between gap-4 bg-[var(--tuwa-bg-secondary)] border-b border-[var(--tuwa-border-secondary)]">
      <a href="https://www.tuwa.io/" target="_blank" rel="noreferrer">
        <Image
          width={126}
          height={40}
          className="w-[126px] h-[40px]"
          src="https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/logo_v2.svg"
          alt="TUWA Logo"
        />
      </a>

      <ConnectButton transactionPool={transactionPool} />
    </header>
  );
}
