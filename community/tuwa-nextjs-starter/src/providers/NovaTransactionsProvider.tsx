'use client';

import { useSatelliteConnectStore } from '@tuwaio/sdk/nova-connect/satellite';
import { NovaTransactionsProvider as NTP } from '@tuwaio/sdk/nova-transactions/providers';
import { getAdapterFromConnectorType } from '@tuwaio/sdk/orbit';
import { useInitializeTransactionsPool } from '@tuwaio/sdk/pulsar';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';

// The modals and toasts of Nova Transactions, fed by the Pulsar store
export function NovaTransactionsProvider() {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);

  // Restarts the trackers of pending transactions after a page reload
  useInitializeTransactionsPool({ initializeTransactionsPool });

  return (
    <NTP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      executeTxAction={executeTxAction}
      connectedWalletAddress={activeConnection?.isConnected ? activeConnection.address : undefined}
      connectedAdapterType={getAdapterFromConnectorType(activeConnection?.connectorType ?? 'solana:')}
      adapter={getAdapter()}
    />
  );
}
