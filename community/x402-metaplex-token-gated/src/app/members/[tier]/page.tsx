import { MemberContent } from '@/components/member-content'
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
    title: `${config.name} Members Area`,
    description: `Exclusive content for ${tier} tier members`,
  }
}

export default async function MembersPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params

  if (!TIER_ORDER.includes(tier as TierType)) {
    notFound()
  }

  const tierConfig = TIER_INFO[tier as TierType]

  return <MemberContent tier={tier as TierType} tierConfig={tierConfig} />
}
