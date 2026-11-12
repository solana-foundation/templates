import { useMobileWallet } from '@wallet-ui/react-native-kit'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { WalletFeatureConnected } from '@/features/wallet/wallet-feature-connected'
import { WalletUiConnectButton } from '@/features/wallet/ui/wallet-ui-connect-button'

export function WalletFeatureEntry() {
  const wallet = useMobileWallet()
  const { account, connect } = wallet

  return (
    <ShellUiPage>
      {account ? (
        <WalletFeatureConnected account={account} wallet={wallet} />
      ) : (
        <WalletUiConnectButton connect={connect} size="lg">
          Connect Wallet
        </WalletUiConnectButton>
      )}
    </ShellUiPage>
  )
}
