'use client'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { useClusterState, useWalletSession } from '@solana/react-hooks'
import { resolveCluster } from '@/components/solana/clusters'
import { AccountUiModalAirdrop } from './account-ui-modal-airdrop'
import { AccountUiModalReceive } from './account-ui-modal-receive'
import { AccountUiModalSend } from './account-ui-modal-send'

export function AccountUiButtons({ address }: { address: string }) {
  const wallet = useWalletSession()
  const clusterState = useClusterState()
  const cluster = resolveCluster(clusterState.endpoint)

  return wallet ? (
    <div>
      <div className="space-x-2">
        {cluster.id === 'mainnet-beta' ? null : <AccountUiModalAirdrop address={address} />}
        <ErrorBoundary errorComponent={() => null}>
          <AccountUiModalSend address={address} />
        </ErrorBoundary>
        <AccountUiModalReceive address={address} />
      </div>
    </div>
  ) : null
}
