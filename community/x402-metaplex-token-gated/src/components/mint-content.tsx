'use client'

import { useSolana } from '@/components/solana/use-solana'
import { useNFTVerification } from '@/hooks/use-nft-verification'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { TierType } from '@/lib/types'

interface MintContentProps {
  tier: TierType
}

export function MintContent({ tier }: MintContentProps) {
  const { publicKey, mintNFT } = useSolana()
  const router = useRouter()
  const { checking, membership, error: verifyError } = useNFTVerification(publicKey, tier)

  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [explorerUrl, setExplorerUrl] = useState<string>('')

  useEffect(() => {
    if (membership?.hasExpired) {
      const timer = setTimeout(() => {
        router.push(`/renew/${tier}`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [membership?.hasExpired, tier, router])

  const handleMint = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first')
      return
    }

    if (membership?.hasActive) {
      setError('You already have an active membership for this tier')
      return
    }

    try {
      setLoading(true)
      setLoadingMessage('Preparing to mint...')
      setError(null)
      setSuccess(false)

      const result = await mintNFT(tier)

      setSuccess(true)
      setExplorerUrl(result.explorerUrl)
      console.log('NFT Minted:', result)
    } catch (err) {
      console.error('Mint error:', err)
      setError(err instanceof Error ? err.message : 'Failed to mint NFT')
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }

  if (!publicKey) {
    return <p className="text-muted-foreground">Please connect your wallet to mint your membership NFT</p>
  }

  if (checking) {
    return (
      <div className="p-4 bg-card rounded-lg border">
        <p className="text-sm">Checking existing memberships...</p>
      </div>
    )
  }

  if (membership?.hasActive) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-500/10 text-green-600 rounded-lg">
          <p className="font-semibold mb-2">✅ Active Membership Found</p>
          <p className="text-sm">You already have an active {tier} membership!</p>
          <button
            onClick={() => router.push(`/members/${tier}`)}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Go to Member Area →
          </button>
        </div>
      </div>
    )
  }

  if (membership?.hasExpired) {
    return (
      <div className="p-4 bg-yellow-500/10 text-yellow-600 rounded-lg">
        <p className="font-semibold mb-2">⏰ Expired Membership Found</p>
        <p className="text-sm">Redirecting to renewal page...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-lg border">
        <p className="text-sm text-muted-foreground">Wallet</p>
        <p className="font-mono">{publicKey}</p>
      </div>

      <button
        onClick={handleMint}
        disabled={loading || success}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-semibold"
      >
        {loading ? loadingMessage || 'Processing...' : success ? 'Minted!' : `Mint ${tier} NFT`}
      </button>

      {(error || verifyError) && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error || verifyError}</p>
        </div>
      )}

      {success && explorerUrl && (
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 text-green-600 rounded-lg">
            <p className="font-semibold mb-2">NFT Minted Successfully! 🎉</p>
            <p className="text-sm mb-2">Your membership NFT has been created</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:no-underline"
            >
              View on Solana Explorer →
            </a>
          </div>
          <button
            onClick={() => router.push(`/members/${tier}`)}
            className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 text-sm"
          >
            Go to Member Area →
          </button>
        </div>
      )}
    </div>
  )
}

