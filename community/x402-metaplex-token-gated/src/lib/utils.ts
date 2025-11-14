import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import bs58 from 'bs58'
import type { TierType } from './types'
import { TIER_INFO, TIER_ORDER } from './config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Type guard that validates and narrows a string to TierType
 */
export function isValidTier(tier: string): tier is TierType {
  return TIER_ORDER.includes(tier as TierType)
}

/**
 * Validates tier and returns typed value or null
 */
export function validateTier(tier: string): TierType | null {
  return isValidTier(tier) ? tier : null
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getDaysUntilExpiration(expiresAt: number): number {
  return Math.floor((expiresAt - Date.now()) / (24 * 60 * 60 * 1000))
}

export function getDaysRemaining(expiresAt: number): string {
  const days = getDaysUntilExpiration(expiresAt)

  if (days < 0) return 'Expired'
  if (days === 0) return 'Expires today'
  if (days === 1) return '1 day remaining'
  return `${days} days remaining`
}

export function isExpiringSoon(expiresAt: number, daysThreshold: number = 7): boolean {
  const days = getDaysUntilExpiration(expiresAt)
  return days > 0 && days <= daysThreshold
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address || address.length <= chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function getTierColor(tier: TierType): string {
  return TIER_INFO[tier].color
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
}

export function timestampToMs(value: string | number | null | undefined): number | undefined {
  if (value == null) return undefined
  const n = typeof value === 'number' ? value : parseInt(value, 10)
  if (!Number.isFinite(n)) return undefined
  // Heuristic: if less than 1 trillion, assume seconds
  return n < 1_000_000_000_000 ? n * 1000 : n
}

export function findAttributeValue(
  attributes: Array<{ trait_type?: string | null; key?: string | null; value?: string | number | null }> | undefined,
  key: string,
): string | number | null | undefined {
  return attributes?.find((a) => a?.trait_type === key || a?.key === key)?.value
}

export function parsePrivateKey(key: string): Uint8Array {
  try {
    return new Uint8Array(JSON.parse(key))
  } catch {
    return bs58.decode(key)
  }
}
