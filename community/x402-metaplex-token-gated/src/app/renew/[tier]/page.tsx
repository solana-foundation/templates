import { notFound } from 'next/navigation'
import { TIER_INFO } from '@/lib/config'
import { validateTier } from '@/lib/utils'
import { RenewContent } from '@/components/renew-content'

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: tierParam } = await params
  const tier = validateTier(tierParam)

  if (!tier) {
    return { title: 'Invalid Tier' }
  }

  const tierConfig = TIER_INFO[tier]

  return {
    title: `Renew ${tierConfig.name}`,
    description: `Renew or upgrade your membership to ${tierConfig.name}`,
  }
}

export default async function RenewPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier: tierParam } = await params
  const tier = validateTier(tierParam)

  if (!tier) {
    notFound()
  }

  const tierConfig = TIER_INFO[tier]

  return <RenewContent tier={tier} tierConfig={tierConfig} />
}
