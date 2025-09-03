import { Address } from 'gill'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { useWalletUi } from '@wallet-ui/react'
import { AccountUiModalAirdrop } from './account-ui-modal-airdrop'
import { AccountUiModalReceive } from './account-ui-modal-receive'
import { AccountUiModalSend } from './account-ui-modal-send'

export function AccountUiButtons({ address }: { address: Address }) {
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
