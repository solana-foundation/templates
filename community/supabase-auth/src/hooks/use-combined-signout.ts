'use client'
import { useAuth } from '@/components/auth/auth-provider'
import { useWalletConnection } from '@solana/react-hooks'

export const useCombinedSignOut = () => {
  const { signOut } = useAuth()
  const { disconnect } = useWalletConnection()

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase first
      await signOut()

      // Then disconnect the wallet
      await disconnect()
    } catch (error) {
      console.error('Error during combined sign out:', error)

      // Still try to disconnect wallet even if signOut failed
      try {
        await disconnect()
      } catch (walletError) {
        console.error('Error disconnecting wallet:', walletError)
      }
    }
  }

  return { handleSignOut }
}
