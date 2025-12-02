'use client'

import { useEffect, useState } from 'react'
import { useWidgetProps } from '@/app/hooks/use-widget-props'
import { useMaxHeight } from '@/app/hooks/use-max-height'
import { useOpenAIGlobal } from '@/app/hooks/use-openai-global'
import { externalWallet } from '@/lib/solana-config'
import { ensureWalletConnected, getWalletPublicKey, signAndSendTransaction } from '@/lib/wallet-utils'

type StakeWidgetProps = {
  initialAmount?: string
  lst?: string // symbol or mint
}

export default function StakePage() {
  const toolOutput = useWidgetProps<StakeWidgetProps>()
  const maxHeight = useMaxHeight() ?? undefined
  const theme = useOpenAIGlobal('theme')

  const [amount, setAmount] = useState(toolOutput?.initialAmount || '0.5')
  const [lst, setLst] = useState(toolOutput?.lst || 'JupSOL')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    signature: string
    explorerUrl: string
    outputAmount: number
    outputToken: string
  } | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    if (toolOutput?.initialAmount) setAmount(String(toolOutput.initialAmount))
    if (toolOutput?.lst) setLst(String(toolOutput.lst))
  }, [toolOutput?.initialAmount, toolOutput?.lst])

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid positive amount')
      return
    }

    setIsSubmitting(true)
    setError('')
    setResult(null)
    try {
      let userPublicKey: string | undefined

      // If using external wallet, connect and get public key
      if (externalWallet) {
        const provider = await ensureWalletConnected()
        const publicKey = getWalletPublicKey(provider)
        if (!publicKey) {
          throw new Error('Failed to get wallet public key')
        }
        userPublicKey = publicKey
        setWalletAddress(publicKey)
      }

      const res = await fetch('/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, lst, userPublicKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to stake SOL')

      // If external wallet mode, sign and send the transaction
      if (externalWallet && data.swapTransaction) {
        const provider = await ensureWalletConnected()
        const signature = await signAndSendTransaction(provider, data.swapTransaction)

        const explorerUrl = `https://solscan.io/tx/${signature}`
        setResult({
          signature,
          explorerUrl,
          outputAmount: data.expectedOutputAmount ?? 0,
          outputToken: data.outputToken,
        })
      } else {
        // Server wallet mode - transaction already executed
        setResult({
          signature: data.signature,
          explorerUrl: data.explorerUrl,
          outputAmount: data.outputAmount,
          outputToken: data.outputToken,
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to stake SOL')
    } finally {
      setIsSubmitting(false)
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
      <h2 style={{ margin: 0, marginBottom: 12 }}>Stake SOL</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Amount (SOL)</span>
          <input
            type="number"
            step="0.000001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.5"
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
          <span>LST (symbol or mint)</span>
          <input
            value={lst}
            onChange={(e) => setLst(e.target.value)}
            placeholder="JupSOL"
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
            <div style={{ marginBottom: 6 }}>
              Staked successfully. Received {result.outputAmount.toFixed(6)} {result.outputToken}
            </div>
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
          disabled={isSubmitting}
          onClick={handleStake}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: 'none',
            background: isSubmitting ? '#6b7280' : '#2563eb',
            color: '#fff',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Staking...' : 'Confirm & Stake'}
        </button>
      </div>
    </div>
  )
}
