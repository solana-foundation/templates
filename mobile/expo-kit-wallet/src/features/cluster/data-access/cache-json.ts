import { address } from '@solana/kit'

function cacheReviver(key: string, value: unknown) {
  if (key === 'address' && typeof value === 'string') {
    return address(value)
  }
  return value
}

export function parseCacheValue<T>(storageKey: string, value: string) {
  try {
    return JSON.parse(value, cacheReviver) as T
  } catch (error) {
    console.warn(`Failed to parse cached data for key ${storageKey}:`, error)
    return undefined
  }
}

export function stringifyCacheValue<T>(value: T) {
  return JSON.stringify(value)
}
