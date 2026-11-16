'use client';

import { useSatelliteConnectStore } from '@tuwaio/sdk/nova-connect/satellite';
import { WalletIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { getAdapterFromConnectorType, OrbitAdapter } from '@tuwaio/sdk/orbit';
import { motion } from 'framer-motion';

import { Panel } from '@/components/Panel';
import { TransactionsBlockWrapper as TransactionsBlockSolana } from '@/components/solana/TransactionsBlockWrapper';

export default function HomePage() {
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);

  return (
    <main className="flex min-h-[calc(100dvh-65px)] w-full flex-wrap items-center justify-center gap-4 px-4 py-8 sm:px-6">
      {activeConnection ? (
        <>
          {getAdapterFromConnectorType(activeConnection.connectorType) === OrbitAdapter.SOLANA && (
            <TransactionsBlockSolana />
          )}
        </>
      ) : (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.1, 0.1, 0.2, 1] }}
          className="w-full max-w-sm"
        >
          <Panel name="Wallet">
            <div className="flex flex-col items-start gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center border border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)]">
                <WalletIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h1 className="font-mono text-lg leading-tight font-bold text-[var(--tuwa-text-primary)]">
                  Wallet required
                </h1>
                <p className="mt-1.5 text-sm leading-6 text-[var(--tuwa-text-secondary)]">
                  Connect your wallet to view and process transactions in the Pulsar module.
                </p>
              </div>
            </div>
          </Panel>
        </motion.div>
      )}
    </main>
  );
}
