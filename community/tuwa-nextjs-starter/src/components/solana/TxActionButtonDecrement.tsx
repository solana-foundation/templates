'use client';

import type { Address } from '@solana/kit';
import { Connection } from '@tuwaio/sdk/nova-connect/satellite';
import { ArrowDownIcon } from '@tuwaio/sdk/nova-icons/24/solid';
import { TxActionButton as TAB } from '@tuwaio/sdk/nova-transactions';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { createSolanaClientWithCache, createSolanaTransactionSendingSigner } from '@tuwaio/solana-sdk/orbit';
import { SolanaConnection } from '@tuwaio/solana-sdk/satellite';
import React from 'react';

import { actionClassName, secondaryActionClassName } from '@/components/classNames';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
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
      params: {
        type: TxType.decrement,
        adapter: OrbitAdapter.SOLANA,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Decrementing', 'Decremented', 'Error', 'Replaced'],
        description: [
          `New value will be ${currentCount - 1}`,
          `Success! New value is ${currentCount - 1}`,
          'An error occurred during decrement.',
          'Transaction was replaced.',
        ],
        payload: {
          value: currentCount - 1,
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
      className={actionClassName}
      classNames={{ idle: secondaryActionClassName }}
      disabled={!activeWallet?.isConnected || currentCount === 0}
      walletAddress={activeWallet?.address}
    >
      <span className="inline-flex items-center gap-2">
        <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
        Decrement
      </span>
    </TAB>
  );
};
