'use client';

import { generateKeyPairSigner } from '@solana/kit';
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill';
import { Connection } from '@tuwaio/sdk/nova-connect/satellite';
import { DocumentDuplicateIcon } from '@tuwaio/sdk/nova-icons/24/solid';
import { TxActionButton as TAB } from '@tuwaio/sdk/nova-transactions';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { createSolanaClientWithCache, createSolanaTransactionSendingSigner } from '@tuwaio/solana-sdk/orbit';
import { SolanaConnection } from '@tuwaio/solana-sdk/satellite';
import React from 'react';

import { actionClassName } from '@/components/classNames';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { txActions, TxType } from '@/transactions';

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519();

export const TxActionButtonInitialize = ({ activeWallet }: { activeWallet: Connection }) => {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);

  const handleInitialize = async () => {
    const { connectedAccount } = activeWallet as SolanaConnection;
    if (!connectedAccount) return;
    const solanatest = await generateKeyPairSigner();
    await executeTxAction({
      actionFunction: () =>
        txActions.initializeSolana({
          client: createSolanaClientWithCache({ rpcUrlOrMoniker: 'devnet' }),
          // Asks the connected wallet to sign and send the transaction on devnet, where the counter program is deployed
          signer: createSolanaTransactionSendingSigner(connectedAccount, 'devnet'),
          contractAddress: solanatest,
        }),
      params: {
        type: TxType.initialize,
        adapter: OrbitAdapter.SOLANA,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: 'Initialize Counter',
        description: 'Initializing the counter. This will create a new account if it does not exist.',
        payload: {
          contractAddress: solanatest.address.toString(),
        },
        withTrackedModal: true,
      },
    });
  };

  return (
    <TAB
      action={handleInitialize}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      className={actionClassName}
      disabled={!activeWallet?.isConnected}
      walletAddress={activeWallet?.address}
    >
      <span className="inline-flex items-center gap-2">
        <DocumentDuplicateIcon className="h-4 w-4" aria-hidden="true" />
        Initialize new counter
      </span>
    </TAB>
  );
};
