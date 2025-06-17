import { Address } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'

import { AccountUiModalAirdrop } from './account-ui-modal-airdrop'
import { AccountUiModalSend } from './account-ui-modal-send'
import { AccountUiModalReceive } from './account-ui-modal-receive'

export function AccountUiActionButtons({ address }: { address: Address }) {
  const { cluster } = useWalletUi()

  return (
    <div>
      <div className="space-x-2">
        {cluster.id === 'solana:mainnet' ? null : <AccountUiModalAirdrop address={address} />}
        <ErrorBoundary errorComponent={() => null}>
          <AccountUiModalSend address={address} />
        </ErrorBoundary>
        <AccountUiModalReceive address={address} />
      </div>
    </div>
  )
}
