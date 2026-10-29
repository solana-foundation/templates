import { useWalletDisconnectMutation } from './data-access/use-wallet-disconnect-mutation'
import { WalletUiActionCard } from './ui/wallet-ui-action-card'

export function WalletFeatureDisconnect() {
  const { disconnectWallet, errorMessage, isPending, reset } = useWalletDisconnectMutation()

  return (
    <WalletUiActionCard
      actionLabel={isPending ? 'Disconnecting...' : 'Disconnect'}
      description="Clear the Privy session and deauthorize the connected mobile wallet."
      error={errorMessage}
      isDisabled={isPending}
      onAction={() => {
        reset()
        disconnectWallet()
      }}
      title="Disconnect"
      variant="danger"
    />
  )
}
