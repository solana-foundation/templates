export interface SyncCache<T> {
  clear(): void
  get(): T | undefined
  set(value: T): void
}
