'use client'

import { useState } from 'react'
import { useSignMessage, useWallets } from '@privy-io/react-auth/solana'
import { Pen } from 'lucide-react'
import bs58 from 'bs58'

type SolanaWallet = ReturnType<typeof useWallets>['wallets'][number]

/**
 * Sign Message demo component.
 * Lets users type a message and sign it with their Solana embedded wallet.
 * Adapted from privy-next-starter's wallet-actions.tsx (Solana sign message handler).
 */
export function SignMessage({ wallets }: { wallets: SolanaWallet[] }) {
  const [message, setMessage] = useState('Hello from Privy + Solana!')
  const [signature, setSignature] = useState<string | null>(null)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signMessage } = useSignMessage()
  const wallet = wallets[0]

  const handleSign = async () => {
    if (!wallet || !message.trim()) return

    setSigning(true)
    setError(null)
    setSignature(null)

    try {
      const result = await signMessage({
        message: new TextEncoder().encode(message),
        wallet,
        options: {
          uiOptions: {
            title: 'Sign this message',
            description: message,
          },
        },
      })

      const sig = bs58.encode(result.signature)
      setSignature(sig)
    } catch (err) {
      console.error('Sign message error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign message')
    } finally {
      setSigning(false)
    }
  }

  if (!wallet) {
    return <p className="text-muted text-sm">No wallet available to sign messages.</p>
  }

  return (
    <div className="sign-message-form">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message to sign..."
        rows={3}
      />

      <button onClick={handleSign} disabled={signing || !message.trim()} className="btn-primary">
        <Pen size={14} />
        {signing ? 'Signing...' : 'Sign Message'}
      </button>

      {signature && (
        <div className="signature-result">
          <div className="label">Signature</div>
          {signature}
        </div>
      )}

      {error && (
        <div className="signature-result !border-red-500/50 !text-red-500">
          <div className="label !text-red-500">Error</div>
          {error}
        </div>
      )}
    </div>
  )
}
