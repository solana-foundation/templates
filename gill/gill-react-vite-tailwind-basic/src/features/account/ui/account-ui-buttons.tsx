import { Address } from 'gill'

import { useSolana } from '@/components/solana/use-solana'
import { AccountUiModalAirdrop } from './account-ui-modal-airdrop'
import { AccountUiModalReceive } from './account-ui-modal-receive'
import { AccountUiModalSend } from './account-ui-modal-send'
import { ErrorBoundary } from 'react-error-boundary'

export function AccountUiButtons({ address }: { address: Address }) {
  const { account, cluster } = useSolana()

  return account ? (
    <div>
      <div className="space-x-2">
        {cluster.id === 'solana:mainnet' ? null : <AccountUiModalAirdrop address={address} />}
        <ErrorBoundary fallback={null}>
          <AccountUiModalSend account={account} address={address} />
        </ErrorBoundary>
        <AccountUiModalReceive address={address} />
      </div>
    </div>
  ) : null
}
