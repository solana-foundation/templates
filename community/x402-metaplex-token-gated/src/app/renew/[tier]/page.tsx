import { notFound } from 'next/navigation'
import { TIER_INFO } from '@/lib/config'
import type { TierType } from '@/lib/types'
import { RenewContent } from '@/components/renew-content'

const VALID_TIERS: TierType[] = ['bronze', 'silver', 'gold']

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params

  if (!VALID_TIERS.includes(tier as TierType)) {
    return { title: 'Invalid Tier' }
  }

  const tierConfig = TIER_INFO[tier as TierType]

  return {
    title: `Renew ${tierConfig.name}`,
    description: `Renew or upgrade your membership to ${tierConfig.name}`,
  }
}

export default async function RenewPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params

  if (!VALID_TIERS.includes(tier as TierType)) {
    notFound()
  }

  const tierConfig = TIER_INFO[tier as TierType]

  return <RenewContent tier={tier as TierType} tierConfig={tierConfig} />
}
