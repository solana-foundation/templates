import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { ellipsify } from '@/utils/ellipsify'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { WalletUiConnectButton, WalletUiDisconnectButton } from '@/components/solana/wallet-ui-dropdown'

export function SettingsUiAccount() {
  const { account } = useWalletUi()
  return (
    <AppView>
      <AppText variant="titleMedium">Account</AppText>
      <AppText>
        {account ? `Connected to ${ellipsify(account.publicKey.toString(), 8)}` : 'Connect your wallet.'}
      </AppText>
      <AppView style={{ alignItems: 'flex-end' }}>
        {account ? <WalletUiDisconnectButton /> : <WalletUiConnectButton />}
      </AppView>
    </AppView>
  )
}
