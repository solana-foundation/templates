import { TierPageContent } from '@/components/tier-content'
import { TIER_INFO } from '@/lib/config'
import type { TierType } from '@/lib/types'
import { notFound } from 'next/navigation'
import { TIER_ORDER } from '@/lib/config'

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params

  if (!TIER_ORDER.includes(tier as TierType)) {
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

  if (!TIER_ORDER.includes(tier as TierType)) {
    notFound()
  }

  const tierConfig = TIER_INFO[tier as TierType]

  return <TierPageContent tier={tier as TierType} tierConfig={tierConfig} />
}
