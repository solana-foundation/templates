import { MintContent } from '@/components/mint-content'
import { TierPageContent } from '@/components/tier-content'
import { TIER_INFO } from '@/lib/config'
import { validateTier } from '@/lib/utils'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: tierParam } = await params
  const tier = validateTier(tierParam)

  if (!tier) {
    return { title: 'Invalid Tier' }
  }

  const config = TIER_INFO[tier]

  return {
    title: `Mint ${config.name}`,
    description: `Get ${config.duration} days of ${tier} tier access for ${config.price}. Features: ${config.features.join(', ')}`,
  }
}

export default async function MintPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: tierParam } = await params
  const tier = validateTier(tierParam)

  if (!tier) {
    notFound()
  }
  const tierConfig = TIER_INFO[tier]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Mint {tierConfig.name}</h1>
      <p className="text-muted-foreground mb-8">
        Get {tierConfig.duration} days of exclusive access for {tierConfig.price}
      </p>
      <MintContent tier={tier} />
    </div>
  )
}
