'use client';

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

export const TxActionButtonClose = ({
  activeWallet,
  solanatest,
}: {
  activeWallet: Connection;
  solanatest: Address;
}) => {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);
  const removeAccFromStore = useStore((state) => state.removeAccFromStore);

  const handleClose = async () => {
    const { connectedAccount } = activeWallet as SolanaConnection;
    if (!connectedAccount) return;
    await executeTxAction({
      actionFunction: () =>
        txActions.closeSolana({
          client: createSolanaClientWithCache({ rpcUrlOrMoniker: 'devnet' }),
          // Asks the connected wallet to sign and send the transaction on devnet, where the counter program is deployed
          signer: createSolanaTransactionSendingSigner(connectedAccount, 'devnet'),
          contractAddress: solanatest,
        }),
      onSuccess: async () => {
        await getAccounts();
        removeAccFromStore(solanatest.toString());
      },
      params: {
        type: TxType.close,
        adapter: OrbitAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeWallet?.rpcURL,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Closing', 'Closed', 'Error', 'Replaced'],
        description: [
          `The counter will be closed.`,
          `Success! The counter is closed.`,
          'An error occurred during closing.',
          'Transaction was replaced.',
        ],
        withTrackedModal: true,
        payload: {
          contractAddress: solanatest,
        },
      },
    });
  };

  return (
    <TAB
      action={handleClose}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      disabled={!activeWallet?.isConnected}
      walletAddress={activeWallet?.address}
      className={`
        w-full p-2.5 rounded-[var(--tuwa-rounded-corners)] border border-transparent
        text-gray-800 font-semibold shadow-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400
        bg-gradient-to-r from-neutral-200 to-neutral-300
        hover:from-neutral-300 hover:to-neutral-400 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
    >
      <span className="text-sm leading-none">Close</span>
    </TAB>
  );
};
