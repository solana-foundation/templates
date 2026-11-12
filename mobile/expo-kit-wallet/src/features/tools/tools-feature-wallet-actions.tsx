import { useMobileWallet } from '@wallet-ui/react-native-kit'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import { ToolsFeatureSignAndSendTransaction } from '@/features/tools/tools-feature-sign-and-send-transaction'
import { ToolsFeatureSignIn } from '@/features/tools/tools-feature-sign-in'
import { ToolsFeatureSignMessage } from '@/features/tools/tools-feature-sign-message'
import { ToolsFeatureSignTransaction } from '@/features/tools/tools-feature-sign-transaction'
import { WalletUiConnectButton } from '@/features/wallet/ui/wallet-ui-connect-button'

export function ToolsFeatureWalletActions() {
  const wallet = useMobileWallet()
  const { client, cluster } = useAppCluster()
  const { account, connect } = wallet

  return (
    <ShellUiPage>
      {account ? (
        <>
          <ToolsFeatureSignAndSendTransaction
            account={account}
            client={client}
            getTransactionSigner={wallet.getTransactionSigner}
          />
          <ToolsFeatureSignIn account={account} cluster={cluster.id} signIn={wallet.signIn} />
          <ToolsFeatureSignMessage signMessages={wallet.signMessages} />
          <ToolsFeatureSignTransaction account={account} client={client} signTransactions={wallet.signTransactions} />
        </>
      ) : (
        <WalletUiConnectButton connect={connect} size="lg">
          Connect Wallet
        </WalletUiConnectButton>
      )}
    </ShellUiPage>
  )
}
