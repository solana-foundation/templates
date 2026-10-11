'use client';

import { ArrowDownIcon } from '@heroicons/react/24/solid';
import type { Address } from '@solana/kit';
import { Connection } from '@tuwaio/sdk/nova-connect/satellite';
import { TxActionButton as TAB } from '@tuwaio/sdk/nova-transactions';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { createSolanaClientWithCache, createSolanaTransactionSendingSigner } from '@tuwaio/solana-sdk/orbit';
import { SolanaConnection } from '@tuwaio/solana-sdk/satellite';
import React from 'react';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { useStore } from '@/hooks/storeHook';
import { txActions, TxType } from '@/transactions';

export const TxActionButtonDecrement = ({
  activeWallet,
  currentCount,
  solanatest,
}: {
  activeWallet: Connection;
  currentCount: number;
  solanatest: Address;
}) => {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);

  const handleDecrement = async () => {
    const { connectedAccount } = activeWallet as SolanaConnection;
    if (!connectedAccount) return;
    await executeTxAction({
      actionFunction: () =>
        txActions.decrementSolana({
          client: createSolanaClientWithCache({ rpcUrlOrMoniker: 'devnet' }),
          // Asks the connected wallet to sign and send the transaction on devnet, where the counter program is deployed
          signer: createSolanaTransactionSendingSigner(connectedAccount, 'devnet'),
          contractAddress: solanatest,
        }),
      onSuccess: async () => {
        await getAccounts();
      },
      params: {
        type: TxType.decrement,
        adapter: OrbitAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeWallet?.rpcURL,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Decrementing', 'Decremented', 'Error', 'Replaced'],
        description: [
          `New value will be ${currentCount - 1}`,
          `Success! New value is ${currentCount - 1}`,
          'An error occurred during decrement.',
          'Transaction was replaced.',
        ],
        payload: {
          value: currentCount,
          contractAddress: solanatest,
        },
        withTrackedModal: true,
      },
    });
  };

  return (
    <TAB
      action={handleDecrement}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      className={`
        w-full p-2.5 rounded-[var(--tuwa-rounded-corners)] border border-transparent
        text-white font-semibold shadow-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700
        bg-gray-800
        hover:bg-gray-700 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
      disabled={!activeWallet?.isConnected || currentCount === 0}
      walletAddress={activeWallet?.address}
    >
      <div className="flex items-center justify-center space-x-2">
        <ArrowDownIcon className="w-5 h-5" />
        <span className="text-sm leading-none">Decrement</span>
      </div>
    </TAB>
  );
};
