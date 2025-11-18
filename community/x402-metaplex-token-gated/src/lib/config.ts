export const TIER_COLLECTIONS = {
  bronze: process.env.NEXT_PUBLIC_BRONZE_COLLECTION!,
  silver: process.env.NEXT_PUBLIC_SILVER_COLLECTION!,
  gold: process.env.NEXT_PUBLIC_GOLD_COLLECTION!,
} as const

export const TIER_INFO = {
  bronze: {
    name: 'Bronze Membership',
    price: '$0.01',
    duration: 30,
    color: '#CD7F32',
    features: ['Basic market insights', 'Weekly newsletters', 'Community access'],
  },
  silver: {
    name: 'Silver Membership',
    price: '$0.02',
    duration: 60,
    color: '#C0C0C0',
    features: ['Advanced market analytics', 'Daily insights', 'Priority community access', 'Monthly webinars'],
  },
  gold: {
    name: 'Gold Membership',
    price: '$0.03',
    duration: 90,
    color: '#FFD700',
    features: [
      'Premium trading signals',
      'Real-time alerts',
      '24/7 priority support',
      'Exclusive content',
      'Private Discord channel',
    ],
  },
} as const

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

export const EXPIRATION_PERIODS = {
  bronze: 30 * MILLISECONDS_PER_DAY,
  silver: 60 * MILLISECONDS_PER_DAY,
  gold: 90 * MILLISECONDS_PER_DAY,
} as const

export const GRACE_PERIOD = 7 * 24 * 60 * 60 * 1000

/**
 * Tier ordering from lowest to highest.
 * Used for upgrade paths and tier comparisons.
 */
export const TIER_ORDER = ['bronze', 'silver', 'gold'] as const

// Re-export types from centralized types file
export type { TierType, NFTWithExpiration } from './types'
