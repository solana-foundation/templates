'use client'

import { useSolana } from '@/components/solana/use-solana'
import { useNFTVerification } from '@/hooks/use-nft-verification'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TierType, TierConfig } from '@/lib/types'
import { TIER_INFO, TIER_ORDER } from '@/lib/config'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getDaysUntilExpiration } from '@/lib/utils'

function RenewContent({ tier, tierConfig }: { tier: TierType; tierConfig: TierConfig }) {
  const { publicKey, renewNFT } = useSolana()
  const router = useRouter()
  const { checking, membership, nfts, error: verifyError } = useNFTVerification(publicKey, tier)

  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [explorerUrl, setExplorerUrl] = useState<string>('')

  const currentTierIndex = TIER_ORDER.indexOf(tier)
  const availableUpgrades = TIER_ORDER.slice(currentTierIndex + 1)

  const handleRenew = async () => {
    if (!publicKey || !membership?.nft) {
      setError('No membership found to renew')
      return
    }

    try {
      setLoading(true)
      setLoadingMessage('Preparing renewal...')
      setError(null)
      setSuccess(false)

      const result = await renewNFT(tier, membership.nft.assetId)

      setSuccess(true)
      setExplorerUrl(result.explorerUrl)
      console.log('NFT Renewed:', result)
    } catch (err) {
      console.error('Renewal error:', err)
      setError(err instanceof Error ? err.message : 'Failed to renew NFT')
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }

  const handleUpgrade = (upgradeTier: TierType) => {
    router.push(`/buy/${upgradeTier}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Renew or Upgrade</h1>
        <p className="text-muted-foreground mb-8">Extend your membership or upgrade to a higher tier</p>

        {!publicKey ? (
          <Card className="p-6">
            <p className="text-muted-foreground">Please connect your wallet to manage your membership</p>
          </Card>
        ) : checking ? (
          <Card className="p-6">
            <p className="text-sm">Checking your memberships...</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {membership?.nft && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Current Membership</h2>
                    <p className="text-muted-foreground text-sm">Your {tier} membership status</p>
                  </div>
                  <Badge variant={membership.hasExpired ? 'destructive' : 'default'}>
                    {membership.hasExpired ? 'Expired' : 'Active'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Tier</p>
                    <p className="font-semibold capitalize">{membership.nft.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="font-semibold">{formatDate(membership.nft.expiresAt)}</p>
                  </div>
                </div>

                {!membership.hasExpired && (
                  <div className="mb-6 p-3 bg-blue-500/10 text-blue-600 rounded-lg">
                    <p className="text-sm">
                      {getDaysUntilExpiration(membership.nft.expiresAt)} days remaining. Renew now to preserve your
                      remaining time!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleRenew}
                  disabled={loading || success}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-semibold"
                >
                  {loading
                    ? loadingMessage || 'Processing...'
                    : success
                      ? 'Renewed!'
                      : `Renew ${tier} for ${tierConfig.price}`}
                </button>

                {(error || verifyError) && (
                  <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error || verifyError}</p>
                  </div>
                )}

                {success && explorerUrl && (
                  <div className="mt-4 p-4 bg-green-500/10 text-green-600 rounded-lg">
                    <p className="font-semibold mb-2">Membership Renewed! 🎉</p>
                    <p className="text-sm mb-2">Your membership has been extended</p>
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline hover:no-underline"
                    >
                      View on Solana Explorer →
                    </a>
                  </div>
                )}
              </Card>
            )}

            {!membership?.nft && (
              <Card className="p-6">
                <p className="text-muted-foreground">
                  You don&apos;t have a {tier} membership to renew. Choose an option below to get started.
                </p>
              </Card>
            )}

            {availableUpgrades.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {membership?.nft ? 'Upgrade Your Membership' : 'Available Memberships'}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {availableUpgrades.map((upgradeTier) => {
                    const upgradeConfig = TIER_INFO[upgradeTier]
                    return (
                      <Card key={upgradeTier} className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold mb-1">{upgradeConfig.name}</h3>
                          <p className="text-2xl font-bold" style={{ color: upgradeConfig.color }}>
                            {upgradeConfig.price}
                          </p>
                          <p className="text-sm text-muted-foreground">{upgradeConfig.duration} days access</p>
                        </div>

                        <ul className="space-y-2 mb-6">
                          {upgradeConfig.features.map((feature) => (
                            <li key={feature} className="text-sm flex items-start">
                              <span className="mr-2">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleUpgrade(upgradeTier)}
                          className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {membership?.nft ? 'Upgrade' : 'Get'} {upgradeConfig.name}
                        </button>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {nfts.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">All Your Memberships</h3>
                <div className="space-y-2">
                  {nfts.map((nft) => (
                    <div key={nft.assetId} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium capitalize">{nft.tier}</p>
                        <p className="text-sm text-muted-foreground">Expires {formatDate(nft.expiresAt)}</p>
                      </div>
                      <Badge variant={nft.isExpired ? 'destructive' : 'default'}>
                        {nft.isExpired ? 'Expired' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { RenewContent }
