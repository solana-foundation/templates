import { Address } from '@solana/kit'

import { useWalletSignTransactionMutation } from './data-access/use-wallet-sign-transaction-mutation'
import { WalletUiActionCard } from './ui/wallet-ui-action-card'

export function WalletFeatureSignTransaction({ address }: { address: Address }) {
  const { errorMessage, isPending, reset, signTransaction, transactionSignature } =
    useWalletSignTransactionMutation(address)

  return (
    <WalletUiActionCard
      actionLabel={isPending ? 'Signing...' : 'Sign transaction'}
      description="Create a devnet memo transaction and approve it in your wallet."
      error={errorMessage}
      isDisabled={isPending}
      onAction={() => {
        reset()
        signTransaction()
      }}
      result={
        transactionSignature
          ? `Transaction: ${transactionSignature.slice(0, 18)}...${transactionSignature.slice(-8)}`
          : null
      }
      title="Transaction signature"
    />
  )
}
