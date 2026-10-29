import { useWalletConnectMutation } from './data-access/use-wallet-connect-mutation'
import { WalletUiActionCard } from './ui/wallet-ui-action-card'

export function WalletFeatureConnect() {
  const { connectWallet, errorMessage, isPending, reset } = useWalletConnectMutation()

  return (
    <WalletUiActionCard
      actionLabel={isPending ? 'Connecting...' : 'Connect wallet'}
      description="Open Mobile Wallet Adapter and authorize this app with a Solana wallet."
      error={errorMessage}
      isDisabled={isPending}
      onAction={() => {
        reset()
        connectWallet()
      }}
      title="Connect"
    />
  )
}
