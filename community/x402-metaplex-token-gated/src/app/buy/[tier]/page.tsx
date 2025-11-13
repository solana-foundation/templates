import { TierPageContent } from '@/components/tier-content'
import { TIER_INFO } from '@/lib/config'
import type { TierType } from '@/lib/types'
import { notFound } from 'next/navigation'

const VALID_TIERS = ['bronze', 'silver', 'gold'] as const

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params

  if (!VALID_TIERS.includes(tier as TierType)) {
    return { title: 'Invalid Tier' }
  }

  const config = TIER_INFO[tier as TierType]

  return {
    title: `Buy ${config.name}`,
    description: `Get ${config.duration} days of ${tier} tier access for ${config.price}. Features: ${config.features.join(', ')}`,
  }
}

export default async function BuyPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params

  // Server-side validation with proper 404
  if (!VALID_TIERS.includes(tier as TierType)) {
    notFound()
  }

  // Pass tier configuration as props
  const tierConfig = TIER_INFO[tier as TierType]

  return <TierPageContent tier={tier as TierType} tierConfig={tierConfig} />
}
