import { useWallet } from '@solana/react-hooks'

/**
 * Custom hook to abstract wallet functionality using @solana/react-hooks
 */
export function useSolana() {
  const wallet = useWallet()

  const isConnected = wallet.status === 'connected'

  const address = isConnected ? wallet.session.account.address.toString() : null

  return {
    status: wallet.status,
    connected: isConnected,
    publicKey: address,
  }
}
