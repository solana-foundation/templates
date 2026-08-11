'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useConnectedWallet, useSignMessage, useWallets } from '@solana/kit-plugin-wallet/react'
import { useAppClient } from '@/components/provider'
import { supabase } from '@/lib/supabase'
import { useAuth } from './auth-provider'
import { useCombinedSignOut } from '@/hooks/use-combined-signout'

export default function WalletLogin() {
  const [message, setMessage] = useState('')
  const router = useRouter()
  const client = useAppClient()
  const wallets = useWallets(client)
  const connected = useConnectedWallet(client)
  const { dispatchAsync: signMessage } = useSignMessage(client)
  const { user } = useAuth()
  const { handleSignOut } = useCombinedSignOut()

  const handleWalletAuth = async () => {
    setMessage('')

    if (!wallets.length) {
      setMessage('No wallets available. Please install a Solana wallet.')
      return
    }

    if (!connected) {
      setMessage('Please connect a wallet first')
      return
    }

    const address = connected.account.address

    try {
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'Please sign this message to authenticate with your wallet.',
        // Supabase builds the Sign-in-with-Solana message itself and asks this interface to sign it.
        wallet: {
          publicKey: { toBase58: () => address },
          signMessage: (bytes: Uint8Array) => signMessage(bytes),
        },
      })

      if (error) {
        setMessage(`Authentication failed: ${error.message}`)
        return
      }

      if (data.user) {
        setMessage('Wallet authenticated successfully!')
      }
    } catch (authError) {
      console.error('Supabase auth error:', authError)
      setMessage('Failed to authenticate with wallet. Please try again.')
    }
  }

  const handleSignOutAndDisconnect = async () => {
    await handleSignOut()
    setMessage('Signed out successfully')
  }

  if (user && connected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>You are signed in with your Solana wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-green-600">Wallet: {connected.account.address.slice(0, 8)}...</p>
              <Button onClick={() => router.push('/account')} className="w-full">
                View Account Details
              </Button>
              <Button onClick={handleSignOutAndDisconnect} variant="outline" className="w-full">
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in with Solana</CardTitle>
        <CardDescription>Connect and authenticate with your Solana wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!connected ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                No wallet connected. Please use the wallet connection from the header.
              </p>
              <Button disabled className="w-full">
                Connect Wallet First
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-green-600">Wallet Connected: {connected.account.address.slice(0, 8)}...</p>
              <Button onClick={handleWalletAuth} className="w-full">
                Sign in with Solana
              </Button>
            </div>
          )}
          {message && (
            <p
              className={`text-sm ${message.includes('error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}
            >
              {message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
