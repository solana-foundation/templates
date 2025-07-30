import { useMobileWallet } from '@/components/solana/use-mobile-wallet'
import { useAuthorization } from '@/components/solana/use-authorization'

export function useWalletUi() {
  const { connect, signAndSendTransaction, signMessage, signIn } = useMobileWallet()
  const { selectedAccount, deauthorizeSessions } = useAuthorization()

  return {
    account: selectedAccount,
    connect,
    disconnect: deauthorizeSessions,
    signAndSendTransaction,
    signIn,
    signMessage,
  }
}
