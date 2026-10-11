'use client';

import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { generateKeyPairSigner } from '@solana/kit';
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill';
import { Connection } from '@tuwaio/sdk/nova-connect/satellite';
import { TxActionButton as TAB } from '@tuwaio/sdk/nova-transactions';
import { OrbitAdapter } from '@tuwaio/sdk/orbit';
import { createSolanaClientWithCache, createSolanaTransactionSendingSigner } from '@tuwaio/solana-sdk/orbit';
import { SolanaConnection } from '@tuwaio/solana-sdk/satellite';
import React from 'react';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { useStore } from '@/hooks/storeHook';
import { txActions, TxType } from '@/transactions';

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519();

export const TxActionButtonInitialize = ({ activeWallet }: { activeWallet: Connection }) => {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);

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
      onSuccess: async () => await getAccounts(),
      params: {
        type: TxType.initialize,
        adapter: OrbitAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeWallet?.rpcURL,
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
      className={`
        w-full h-full p-2.5 rounded-[var(--tuwa-rounded-corners)] border border-transparent
        text-[var(--tuwa-text-on-accent)] font-semibold shadow-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]
        hover:from-[var(--tuwa-button-gradient-from-hover)] hover:to-[var(--tuwa-button-gradient-to-hover)] hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
      disabled={!activeWallet?.isConnected}
      walletAddress={activeWallet?.address}
    >
      <div className="flex items-center justify-center space-x-2">
        <DocumentDuplicateIcon className="w-5 h-5" />
        <span className="text-sm leading-none">Initialize New Counter</span>
      </div>
    </TAB>
  );
};
