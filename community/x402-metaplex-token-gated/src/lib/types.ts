// Core domain types for the token-gated membership system

/**
 * Membership tier levels.
 * Each tier provides different duration and feature access.
 */
export type TierType = 'bronze' | 'silver' | 'gold'

export type TierConfig = {
  name: string
  price: string
  duration: number
  color: string
  features: readonly string[]
}

/**
 * NFT membership data with expiration tracking.
 * Used throughout the app to represent user membership status.
 */
export interface NFTWithExpiration {
  tier: TierType
  assetId: string
  expiresAt: number
  isExpired: boolean
  isExpiringSoon: boolean
  gracePeriodActive: boolean
  issuedAt?: number
  renewedAt?: number
}
