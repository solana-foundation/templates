'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSolana } from '@/components/solana/use-solana'
import { supabase } from '@/lib/supabase'
import { useAuth } from './auth-provider'
import { useCombinedSignOut } from '@/hooks/use-combined-signout'

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      publicKey?: {
        toString(): string
      }
      signMessage?(message: Uint8Array): Promise<{ signature: Uint8Array }>
      connect?(): Promise<{ publicKey: { toString(): string } }>
    }
  }
}

export default function WalletLogin() {
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { connected, account } = useSolana()
  const { user } = useAuth()
  const { handleSignOut } = useCombinedSignOut()

  const handleWalletAuth = async () => {
    setMessage('')

    try {
      if (!connected || !account) {
        setMessage('Please connect a wallet first')
        return
      }
      if (typeof window !== 'undefined' && window.solana) {
        try {
          const { data, error } = await supabase.auth.signInWithWeb3({
            chain: 'solana',
            statement: 'Please sign this message to authenticate with your wallet.',
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
      } else {
        setMessage('Solana wallet not detected. Please install a Solana wallet.')
      }
    } catch (error) {
      console.error('Wallet auth error:', error)
      setMessage('An error occurred. Please try again.')
    }
  }

  const handleSignOutAndDisconnect = async () => {
    await handleSignOut()
    setMessage('Signed out successfully')
  }

  if (user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>You are signed in with your Solana wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-green-600">
                Wallet: {user.user_metadata?.wallet_address?.slice(0, 8) || 'Connected'}...
              </p>
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
          {!connected || !account ? (
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
              <p className="text-sm text-green-600">Wallet Connected: {account.address.slice(0, 8)}...</p>
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
