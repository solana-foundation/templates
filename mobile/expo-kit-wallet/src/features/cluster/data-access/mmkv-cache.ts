import type { MMKV } from 'react-native-mmkv'

import { parseCacheValue, stringifyCacheValue } from './cache-json'
import type { SyncCache } from './sync-cache'

export class MmkvCache<T> implements SyncCache<T> {
  constructor(
    private readonly storage: MMKV,
    private readonly storageKey: string,
  ) {}

  clear() {
    this.storage.remove(this.storageKey)
  }

  get() {
    const cached = this.storage.getString(this.storageKey)
    return cached ? parseCacheValue<T>(this.storageKey, cached) : undefined
  }

  set(value: T) {
    this.storage.set(this.storageKey, stringifyCacheValue(value))
  }
}

export interface CreateMmkvCacheConfig {
  storage: MMKV
  storageKey: string
}

export function createMmkvCache<T>({ storage, storageKey }: CreateMmkvCacheConfig) {
  return new MmkvCache<T>(storage, storageKey)
}
