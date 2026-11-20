'use client'
import { useAuth } from '@/components/auth/auth-provider'
import { useDisconnect } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/provider'

export const useCombinedSignOut = () => {
  const { signOut } = useAuth()
  const { client } = useSolana()
  const { dispatchAsync: disconnect } = useDisconnect(client)

  const handleSignOut = async () => {
    let authError: unknown
    try {
      await signOut()
    } catch (error) {
      authError = error
    }
    try {
      await disconnect()
    } catch (error) {
      if (authError)
        throw new AggregateError([authError, error], 'Sign out and wallet disconnect failed. Please retry.')
      throw error
    }
    if (authError) throw authError
  }

  return { handleSignOut }
}
