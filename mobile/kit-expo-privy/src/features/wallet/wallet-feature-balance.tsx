import { Address } from '@solana/kit'

import { useWalletBalanceQuery } from './data-access/use-wallet-balance-query'
import { WalletUiActionCard } from './ui/wallet-ui-action-card'

export function WalletFeatureBalance({ address }: { address: Address }) {
  const { balance, errorMessage, isFetching, refreshBalance } = useWalletBalanceQuery(address)

  async function refreshWalletBalance() {
    await refreshBalance()
  }

  return (
    <WalletUiActionCard
      actionLabel={isFetching ? 'Refreshing...' : 'Refresh balance'}
      description="Read the SOL balance for the currently connected wallet on devnet."
      error={errorMessage}
      isDisabled={isFetching}
      onAction={refreshWalletBalance}
      result={balance ? `Balance: ${balance}` : 'Balance: ...'}
      title="Balance"
    />
  )
}
