'use client'

import { useSolana } from '@/components/solana/use-solana'
import { useNFTVerification } from '@/hooks/use-nft-verification'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { TierType, TierConfig } from '@/lib/types'
import { formatDate, getDaysRemaining } from '@/lib/utils'

export function MemberContent({ tier, tierConfig }: { tier: TierType; tierConfig: TierConfig }) {
  const { account, connected } = useSolana()
  const router = useRouter()
  const { checking, membership } = useNFTVerification(account?.address, tier)

  useEffect(() => {
    if (!checking && membership) {
      if (!membership.hasActive) {
        router.push(`/buy/${tier}`)
      }

      if (membership.hasExpired) {
        router.push(`/renew/${tier}`)
      }
    }
  }, [connected, checking, membership, tier])

  if (checking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground">Verifying membership...</p>
        </div>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground">Please connect your wallet to view your membership.</p>
        </div>
      </div>
    )
  }

  if (!membership?.hasActive) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{tierConfig.name} Members Area</h1>
        <p className="text-muted-foreground mb-8">Welcome! You have exclusive access to {tier} content.</p>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="p-4 bg-card rounded-lg border">
            <h2 className="font-semibold mb-2">Your Membership</h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Tier:</span>{' '}
                <span className="font-medium capitalize">{tier}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Status:</span>{' '}
                <span className="text-green-600 font-medium">Active</span>
              </p>
              {membership.nft?.expiresAt && (
                <>
                  <p>
                    <span className="text-muted-foreground">Expires:</span> {formatDate(membership.nft.expiresAt)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time remaining:</span>{' '}
                    {getDaysRemaining(membership.nft.expiresAt)}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border">
            <h2 className="font-semibold mb-2">NFT Details</h2>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground break-all">
                Asset: {membership.nft?.assetId.slice(0, 8)}...
                {membership.nft?.assetId.slice(-8)}
              </p>
              <a
                href={`https://explorer.solana.com/address/${membership.nft?.assetId}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm inline-block mt-2"
              >
                View on Explorer →
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Exclusive {tierConfig.name} Content</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">This content is only visible to verified {tier} members!</p>
            <ul className="space-y-2">
              {tierConfig.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
