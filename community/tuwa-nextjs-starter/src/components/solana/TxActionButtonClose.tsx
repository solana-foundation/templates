'use client';

import type { Address } from '@solana/kit';
import { Connection } from '@tuwaio/sdk/nova-connect/satellite';
import { TxActionButton as TAB } from '@tuwaio/sdk/nova-transactions';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { createSolanaClientWithCache, createSolanaTransactionSendingSigner } from '@tuwaio/solana-sdk/orbit';
import { SolanaConnection } from '@tuwaio/solana-sdk/satellite';
import React from 'react';

import { actionClassName, secondaryActionClassName } from '@/components/classNames';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
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
      params: {
        type: TxType.close,
        adapter: OrbitAdapter.SOLANA,
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
      className={actionClassName}
      classNames={{ idle: secondaryActionClassName }}
      disabled={!activeWallet?.isConnected}
      walletAddress={activeWallet?.address}
    >
      Close
    </TAB>
  );
};
