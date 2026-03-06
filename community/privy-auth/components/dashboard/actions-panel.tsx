'use client'

import { useState } from 'react'
import { useSignMessage, useWallets } from '@privy-io/react-auth/solana'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const DEMO_MESSAGE = 'Hello from Privy on Solana!'

export function ActionsPanel() {
  const { ready: walletsReady, wallets } = useWallets()
  const { signMessage } = useSignMessage()
  const [isSigning, setIsSigning] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [signError, setSignError] = useState<string | null>(null)

  const wallet = wallets[0]

  const handleSign = async () => {
    if (!wallet) return

    setIsSigning(true)
    setSignError(null)
    setSignature(null)

    try {
      const encodedMessage = new TextEncoder().encode(DEMO_MESSAGE)
      const result = await signMessage({
        message: encodedMessage,
        wallet,
      })
      const sigHex = Array.from(result.signature)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      setSignature(sigHex)
    } catch (err) {
      console.error('Failed to sign message:', err)
      setSignError('Failed to sign message. Please try again.')
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Interact with your Solana wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Demo Message</p>
          <p className="rounded-md bg-muted px-3 py-2 text-sm">{DEMO_MESSAGE}</p>
        </div>

        <Button onClick={handleSign} disabled={!walletsReady || wallets.length === 0 || isSigning} size="sm">
          {isSigning ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing...
            </>
          ) : (
            'Sign Message'
          )}
        </Button>

        {signError && <p className="text-xs text-destructive">{signError}</p>}

        {signature && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Signature</p>
            <pre className="rounded-md bg-muted p-3 font-mono text-xs break-all whitespace-pre-wrap">
              <code>{signature}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
