import { MemberContent } from '@/components/member-content'
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
    title: `${config.name} Members Area`,
    description: `Exclusive content for ${tier} tier members`,
  }
}

export default async function MembersPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: tierParam } = await params
  const tier = validateTier(tierParam)

  if (!tier) {
    notFound()
  }

  const tierConfig = TIER_INFO[tier]

  return <MemberContent tier={tier} tierConfig={tierConfig} />
}
