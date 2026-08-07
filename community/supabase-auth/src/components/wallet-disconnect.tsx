'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useConnectedWallet, useDisconnect } from '@solana/kit-plugin-wallet/react'
import { useAppClient } from '@/components/provider'

function WalletDisconnect(props: React.ComponentProps<typeof Button>) {
  const client = useAppClient()
  const connected = useConnectedWallet(client)
  const { dispatchAsync: disconnect } = useDisconnect(client)
  const { signOut } = useAuth()
  const router = useRouter()

  const handleDisconnect = async () => {
    // Each step is isolated so a failure in one still runs the rest and lands the
    // user back on the home page rather than on a page they can no longer read.
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }

    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('sb-') || key.includes('supabase'))
        .forEach((key) => localStorage.removeItem(key))
    }

    try {
      await disconnect()
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }

    router.replace('/')
  }

  return (
    <Button variant="outline" className="cursor-pointer" {...props} onClick={handleDisconnect} disabled={!connected}>
      Disconnect
    </Button>
  )
}

export { WalletDisconnect }
