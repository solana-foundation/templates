import { useState, useEffect, useCallback } from 'react'

type NFTData = {
  tier: string
  assetId: string
  expiresAt: number
  isExpired: boolean
  isExpiringSoon: boolean
  gracePeriodActive: boolean
  issuedAt?: number
  renewedAt?: number
}

type MembershipStatus = {
  hasActive: boolean
  hasExpired: boolean
  nft?: NFTData
}

export function useNFTVerification(walletAddress: string | null, tier?: string) {
  const [checking, setChecking] = useState(true)
  const [nfts, setNfts] = useState<NFTData[]>([])
  const [error, setError] = useState<string | null>(null)

  const checkNFT = useCallback(async () => {
    if (!walletAddress) {
      setNfts([])
      setError(null)
      return
    }

    try {
      setChecking(true)
      setError(null)

      const response = await fetch(`/api/nft/verify?wallet=${walletAddress}`)
      if (!response.ok) {
        throw new Error('Failed to verify NFT')
      }

      const data = await response.json()
      setNfts(data.nfts || [])
    } catch (err) {
      console.error('NFT verification error:', err)
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setChecking(false)
    }
  }, [walletAddress])

  useEffect(() => {
    checkNFT()
  }, [checkNFT])

  const getMembershipStatus = useCallback(
    (targetTier: string): MembershipStatus => {
      const tierNFT = nfts.find((nft) => nft.tier === targetTier)

      if (!tierNFT) {
        return { hasActive: false, hasExpired: false }
      }

      return {
        hasActive: !tierNFT.isExpired,
        hasExpired: tierNFT.isExpired,
        nft: tierNFT,
      }
    },
    [nfts],
  )

  const membership = tier ? getMembershipStatus(tier) : null

  const hasAnyActive = nfts.some((nft) => !nft.isExpired)

  return {
    checking,
    nfts,
    error,
    membership,
    hasAnyActive,
    getMembershipStatus,
    refetch: checkNFT,
  }
}
