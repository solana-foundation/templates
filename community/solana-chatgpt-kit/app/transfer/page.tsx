'use client'

import { useEffect, useState } from 'react'
import { useWidgetProps } from '@/app/hooks/use-widget-props'
import { useMaxHeight } from '@/app/hooks/use-max-height'
import { useOpenAIGlobal } from '@/app/hooks/use-openai-global'
import { externalWallet } from '@/lib/solana-config'
import { ensureWalletConnected, getWalletPublicKey, signAndSendTransaction } from '@/lib/wallet-utils'
import { createX402Client } from 'x402-solana/client'

type TransferWidgetProps = {
  toAddress?: string
  amount?: string
}

export default function TransferPage() {
  const toolOutput = useWidgetProps<TransferWidgetProps>()
  const maxHeight = useMaxHeight() ?? undefined
  const theme = useOpenAIGlobal('theme')

  const [toAddress, setToAddress] = useState(toolOutput?.toAddress || '')
  const [amount, setAmount] = useState(toolOutput?.amount || '0.001')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    signature: string
    explorerUrl: string
  } | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    if (toolOutput?.toAddress) setToAddress(String(toolOutput.toAddress))
    if (toolOutput?.amount) setAmount(String(toolOutput.amount))
  }, [toolOutput?.toAddress, toolOutput?.amount])

  const handleSend = async () => {
    if (!toAddress || !amount || parseFloat(amount) <= 0) {
      setError('Enter a valid address and positive amount')
      return
    }

    setIsSending(true)
    setError('')
    setResult(null)
    try {
      let userPublicKey: string | undefined
      let provider

      // If using external wallet, connect and get public key
      if (externalWallet) {
        provider = await ensureWalletConnected()
        const publicKey = getWalletPublicKey(provider)
        if (!publicKey) {
          throw new Error('Failed to get wallet public key')
        }
        userPublicKey = publicKey
        setWalletAddress(publicKey)

        // Create x402 client with connected wallet
        const x402Client = createX402Client({
          wallet: provider as any, // Provider matches WalletAdapter interface
          network: 'solana', // mainnet
          rpcUrl: 'https://api.mainnet-beta.solana.com',
        })

        // Use x402 client fetch - automatically handles 402 payment
        const res = await x402Client.fetch('/api/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toAddress, amount, userPublicKey }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to send SOL')

        // If external wallet mode, sign and send the transaction
        if (data.transferTransaction) {
          const signature = await signAndSendTransaction(provider, data.transferTransaction)
          const explorerUrl = `https://solscan.io/tx/${signature}`
          setResult({ signature, explorerUrl })
        } else {
          setResult({ signature: data.signature, explorerUrl: data.explorerUrl })
        }
      } else {
        // Server wallet mode - regular fetch, no x402
        const res = await fetch('/api/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toAddress, amount }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to send SOL')

        setResult({ signature: data.signature, explorerUrl: data.explorerUrl })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send SOL')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      style={{
        maxHeight,
        overflow: 'auto',
        padding: 16,
        background: theme === 'dark' ? '#0B0B0C' : '#fff',
        color: theme === 'dark' ? '#fff' : '#111',
        borderRadius: 12,
        border: theme === 'dark' ? '1px solid #222' : '1px solid #eee',
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 12 }}>Send SOL</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Destination</span>
          <input
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Destination wallet address"
            style={{
              padding: 10,
              borderRadius: 8,
              border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
              background: theme === 'dark' ? '#0F0F10' : '#fafafa',
              color: 'inherit',
            }}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Amount (SOL)</span>
          <input
            type="number"
            step="0.000001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            style={{
              padding: 10,
              borderRadius: 8,
              border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
              background: theme === 'dark' ? '#0F0F10' : '#fafafa',
              color: 'inherit',
            }}
          />
        </label>

        {error ? <div style={{ color: '#e5484d', fontSize: 14 }}>{error}</div> : null}

        {result ? (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: theme === 'dark' ? '#0F1612' : '#eefcf3',
              border: theme === 'dark' ? '1px solid #193b2d' : '1px solid #c7f0d9',
              fontSize: 14,
            }}
          >
            <div style={{ marginBottom: 6 }}>Transfer sent successfully.</div>
            <a href={result.explorerUrl} target="_blank" rel="noreferrer" style={{ color: '#16a34a' }}>
              View on Solscan
            </a>
          </div>
        ) : null}

        {externalWallet && walletAddress ? (
          <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', wordBreak: 'break-all' }}>
            Connected: {walletAddress}
          </div>
        ) : null}

        <button
          disabled={isSending}
          onClick={handleSend}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: 'none',
            background: isSending ? '#6b7280' : '#2563eb',
            color: '#fff',
            cursor: isSending ? 'not-allowed' : 'pointer',
          }}
        >
          {isSending ? 'Sending...' : 'Confirm & Send'}
        </button>
      </div>
    </div>
  )
}
