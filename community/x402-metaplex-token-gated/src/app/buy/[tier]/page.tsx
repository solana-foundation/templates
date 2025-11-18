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
    title: `Buy ${config.name}`,
    description: `Get ${config.duration} days of ${tier} tier access for ${config.price}. Features: ${config.features.join(', ')}`,
  }
}

export default async function BuyPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: tierParam } = await params
  const tier = validateTier(tierParam)

  if (!tier) {
    notFound()
  }

  const tierConfig = TIER_INFO[tier]

  return <TierPageContent tier={tier} tierConfig={tierConfig} />
}
