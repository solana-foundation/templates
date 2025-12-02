import { useAuth } from '@/components/auth/auth-provider'
import { useWalletUi } from '@wallet-ui/react'

export const useCombinedSignOut = () => {
  const { signOut } = useAuth()
  const { disconnect } = useWalletUi()

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase first
      await signOut()

      // Then disconnect the wallet
      disconnect()
    } catch (error) {
      console.error('Error during combined sign out:', error)

      // Still try to disconnect wallet even if signOut failed
      try {
        disconnect()
      } catch (walletError) {
        console.error('Error disconnecting wallet:', walletError)
      }
    }
  }

  return { handleSignOut }
}
