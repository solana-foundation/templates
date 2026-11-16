'use client';

import { address } from '@solana/kit';
import { useSatelliteConnectStore } from '@tuwaio/sdk/nova-connect/satellite';
import { QuasarLoader } from '@tuwaio/sdk/nova-core';
import { cn } from '@tuwaio/sdk/nova-core/utils';
import { ArrowTopRightOnSquareIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { HashLink } from '@tuwaio/sdk/nova-transactions';
import { shortAddress } from '@tuwaio/sdk/orbit';
import { OrbitAdapter, selectAdapterByKey, SOLANA_CHAIN_IDS } from '@tuwaio/sdk/orbit';
import { TransactionStatus, useTxFinished } from '@tuwaio/sdk/pulsar';
import { SolanaConnection } from '@tuwaio/solana-sdk/satellite';
import { useEffect } from 'react';

import { chipClassName, labelClassName } from '@/components/classNames';
import { Panel, PoweredBy } from '@/components/Panel';
import { TxActionButtonClose } from '@/components/solana/TxActionButtonClose';
import { TxActionButtonDecrement } from '@/components/solana/TxActionButtonDecrement';
import { TxActionButtonIncrement } from '@/components/solana/TxActionButtonIncrement';
import { TxActionButtonInitialize } from '@/components/solana/TxActionButtonInitialize';
import { PROGRAM_ID } from '@/constants';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { useStore } from '@/hooks/storeHook';
import { TxType } from '@/transactions';

export const TransactionsBlockWrapper = () => {
  const activeWallet = useSatelliteConnectStore((store) => store.activeConnection);
  const accounts = useStore((state) => state.accounts);
  const getAccounts = useStore((state) => state.getAccounts);
  const removeAccFromStore = useStore((state) => state.removeAccFromStore);
  const accountsLoading = useStore((state) => state.accountsLoading);
  const accountsError = useStore((state) => state.accountsError);
  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const subscribeTxFinished = usePulsarStore((state) => state.subscribeTxFinished);

  const foundAdapter = selectAdapterByKey({
    adapterKey: OrbitAdapter.SOLANA,
    adapter: getAdapter(),
  });

  const activeWalletSolana = activeWallet as SolanaConnection;

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refreshes the counters after every successful Solana transaction, also one restored after a page reload, which has
  // lost the callbacks of executeTxAction
  useTxFinished({
    subscribeTxFinished,
    onFinished: async (tx) => {
      if (tx.adapter !== OrbitAdapter.SOLANA || tx.status !== TransactionStatus.Success) return;
      await getAccounts();
      // The RPC node may still list a counter closed a moment ago
      if (tx.type === TxType.close) removeAccFromStore(tx.payload.contractAddress);
    },
  });

  // The counter program is deployed on devnet: its explorer links name the cluster, whatever the wallet is on
  const programUrl = foundAdapter?.getExplorerUrl(`/account/${PROGRAM_ID}`, SOLANA_CHAIN_IDS.devnet);

  const sortedAccounts = Object.entries(accounts).sort(([, countA], [, countB]) => countB - countA);

  return (
    <Panel
      name="Solana demo"
      aside={<span className={chipClassName}>Devnet</span>}
      footer={<PoweredBy />}
      className="max-w-md"
    >
      <div className="border-b border-[var(--tuwa-border-primary)] p-5">
        <h1 className="font-mono text-xl leading-tight font-bold text-[var(--tuwa-text-primary)]">
          Solana program interaction
        </h1>
        <p className="mt-1.5 text-sm leading-6 text-[var(--tuwa-text-secondary)]">
          Test transaction tracking with a simple counter program.
        </p>
      </div>

      <dl className="grid grid-cols-2 border-b border-[var(--tuwa-border-primary)]">
        <div className="border-r border-[var(--tuwa-border-primary)] px-5 py-4">
          <dt className={cn(labelClassName, 'text-[var(--tuwa-text-secondary)]')}>Counter program</dt>
          <dd className="mt-2">
            <a
              href={programUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-[var(--tuwa-text-primary)] underline underline-offset-4 hover:no-underline"
            >
              {shortAddress(PROGRAM_ID.toString(), 6, 6)}
              <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          </dd>
        </div>
        <div className="px-5 py-4">
          <dt className={cn(labelClassName, 'text-[var(--tuwa-text-secondary)]')}>Counters</dt>
          <dd className="mt-1 font-mono text-2xl leading-8 font-bold text-[var(--tuwa-text-primary)] tabular-nums">
            {accountsLoading ? <QuasarLoader size={20} /> : sortedAccounts.length}
          </dd>
        </div>
      </dl>

      <div className="border-b border-[var(--tuwa-border-primary)] p-5">
        {activeWalletSolana?.connectedAccount ? (
          <TxActionButtonInitialize activeWallet={activeWalletSolana} />
        ) : (
          <p className="text-sm text-[var(--tuwa-text-secondary)]">Connect a wallet to create a counter.</p>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {accountsLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <QuasarLoader size={32} />
            <p className="text-sm text-[var(--tuwa-text-secondary)]">Fetching the counters...</p>
          </div>
        ) : accountsError ? (
          <div className="flex h-40 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-sm text-[var(--tuwa-text-secondary)]">Could not fetch the counters from devnet.</p>
            <button
              type="button"
              onClick={() => getAccounts()}
              className={cn(
                labelClassName,
                'cursor-pointer border border-[var(--tuwa-border-strong)] px-4 py-2.5 text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-standart-button-hover)]',
              )}
            >
              Retry
            </button>
          </div>
        ) : (
          <ul>
            {sortedAccounts.map(([key, value]) => (
              <li key={key} className="border-b border-[var(--tuwa-border-primary)] p-5 last:border-b-0">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className={cn(labelClassName, 'text-[var(--tuwa-text-secondary)]')}>Account</p>
                    <div className="mt-2">
                      <HashLink
                        hash={key}
                        explorerUrl={foundAdapter?.getExplorerUrl(`/address/${key}`, SOLANA_CHAIN_IDS.devnet)}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(labelClassName, 'text-[var(--tuwa-text-secondary)]')}>Value</p>
                    <p className="mt-1 font-mono text-2xl leading-8 font-bold text-[var(--tuwa-text-primary)] tabular-nums">
                      {value}
                    </p>
                  </div>
                </div>

                {activeWalletSolana?.connectedAccount && (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <TxActionButtonIncrement
                        activeWallet={activeWalletSolana}
                        currentCount={value}
                        solanatest={address(key)}
                      />
                      <TxActionButtonDecrement
                        activeWallet={activeWalletSolana}
                        currentCount={value}
                        solanatest={address(key)}
                      />
                    </div>
                    <TxActionButtonClose activeWallet={activeWalletSolana} solanatest={address(key)} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
};
