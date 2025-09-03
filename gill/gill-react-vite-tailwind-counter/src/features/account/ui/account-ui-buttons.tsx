import { Address } from 'gill'

import { useWalletUi } from '@wallet-ui/react'
import { AccountUiModalAirdrop } from './account-ui-modal-airdrop'
import { AccountUiModalReceive } from './account-ui-modal-receive'
import { AccountUiModalSend } from './account-ui-modal-send'
import { ErrorBoundary } from 'react-error-boundary'

export function AccountUiButtons({ address }: { address: Address }) {
  const { cluster } = useWalletUi()

  return (
    <div>
      <div className="space-x-2">
        {cluster.id === 'solana:mainnet' ? null : <AccountUiModalAirdrop address={address} />}
        <ErrorBoundary fallback={null}>
          <AccountUiModalSend address={address} />
        </ErrorBoundary>
        <AccountUiModalReceive address={address} />
      </div>
    </div>
  )
}
