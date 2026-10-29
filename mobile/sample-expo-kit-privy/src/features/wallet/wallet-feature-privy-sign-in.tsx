import { Address } from '@solana/kit'

import { usePrivySignInMutation } from './data-access/use-privy-sign-in-mutation'
import { WalletUiActionCard } from './ui/wallet-ui-action-card'

export function WalletFeaturePrivySignIn({ address }: { address: Address }) {
  const { errorMessage, isPending, reset, signInWithPrivy } = usePrivySignInMutation(address)

  return (
    <WalletUiActionCard
      actionLabel={isPending ? 'Signing in...' : 'Sign in with Privy'}
      description="Create a Sign-In With Solana message, sign it with your wallet, and exchange it for a Privy session."
      error={errorMessage}
      isDisabled={isPending}
      onAction={() => {
        reset()
        signInWithPrivy()
      }}
      title="Privy authentication"
    />
  )
}
