import { Address } from '@solana/kit'

import { useWalletSignMessageMutation } from './data-access/use-wallet-sign-message-mutation'
import { WalletUiActionCard } from './ui/wallet-ui-action-card'

export function WalletFeatureSignMessage({ address }: { address: Address }) {
  const { errorMessage, isPending, reset, signature, signMessage } = useWalletSignMessageMutation(address)

  return (
    <WalletUiActionCard
      actionLabel={isPending ? 'Signing...' : 'Sign message'}
      description="Request a wallet signature for a simple local message."
      error={errorMessage}
      isDisabled={isPending}
      onAction={() => {
        reset()
        signMessage()
      }}
      result={signature ? `Signature: ${signature.slice(0, 18)}...${signature.slice(-8)}` : null}
      title="Message signature"
    />
  )
}
