'use client'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useAppClient } from '@/components/provider'
import { useCluster } from '@/components/solana/cluster-provider'
import { AccountUiModalAirdrop } from './account-ui-modal-airdrop'
import { AccountUiModalReceive } from './account-ui-modal-receive'
import { AccountUiModalSend } from './account-ui-modal-send'

export function AccountUiButtons({ address }: { address: string }) {
  const connected = useConnectedWallet(useAppClient())
  const { cluster } = useCluster()

  return connected ? (
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
