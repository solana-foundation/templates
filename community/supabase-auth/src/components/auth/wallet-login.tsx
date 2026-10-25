'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/provider'
import { signInWithWallet } from '@/lib/wallet-auth'
import { supabase } from '@/lib/supabase'
import { useAuth } from './auth-provider'
import { useCombinedSignOut } from '@/hooks/use-combined-signout'

export default function WalletLogin() {
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { client } = useSolana()
  const session = useConnectedWallet(client)
  const connected = Boolean(session)
  const { user } = useAuth()
  const { handleSignOut } = useCombinedSignOut()
  const [pending, setPending] = useState(false)
  const [selection, setSelection] = useState(session?.account.address)
  if (selection !== session?.account.address) {
    setSelection(session?.account.address)
    setMessage('')
  }
  const busy = useRef(false)
  const lifecycle = useRef<AbortController | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    lifecycle.current = controller
    return () => controller.abort()
  }, [client, session?.account.address])

  const handleWalletAuth = async () => {
    setMessage('')

    if (!connected || !session) {
      setMessage('Please connect a wallet first')
      return
    }

    const controller = lifecycle.current
    if (busy.current || !controller || controller.signal.aborted) return
    busy.current = true
    setPending(true)
    try {
      const data = await signInWithWallet(supabase.auth, client, controller.signal)
      if (data.user && !controller.signal.aborted) {
        setMessage('Wallet authenticated successfully!')
      }
    } catch (authError) {
      console.error('Supabase auth error:', authError)
      if (!controller.signal.aborted)
        setMessage(`Authentication failed: ${authError instanceof Error ? authError.message : String(authError)}`)
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  const handleSignOutAndDisconnect = async () => {
    if (busy.current) return
    busy.current = true
    setPending(true)
    setMessage('')
    try {
      await handleSignOut()
      setMessage('Signed out successfully')
    } catch (error) {
      setMessage(`Sign out failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  const feedback = message && (
    <p role="status" className={`text-sm ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
      {message}
    </p>
  )

  if (user && session) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>You are signed in with your Solana wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-green-600">Wallet: {session.account.address.toString().slice(0, 8)}...</p>
              <Button onClick={() => router.push('/account')} className="w-full">
                View Account Details
              </Button>
              <Button onClick={handleSignOutAndDisconnect} disabled={pending} variant="outline" className="w-full">
                {pending ? 'Signing out...' : 'Sign Out'}
              </Button>
              {feedback}
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
          {!connected || !session ? (
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
              <p className="text-sm text-green-600">
                Wallet Connected: {session.account.address.toString().slice(0, 8)}...
              </p>
              <Button onClick={handleWalletAuth} disabled={pending} className="w-full">
                {pending ? 'Signing in...' : 'Sign in with Solana'}
              </Button>
            </div>
          )}
          {feedback}
        </div>
      </CardContent>
    </Card>
  )
}
