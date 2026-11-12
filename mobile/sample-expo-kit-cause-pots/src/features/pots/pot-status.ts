import type { Pot } from '@project/anchor'

export type PotStatus = 'locked' | 'released' | 'unlocked'

// The pot lifecycle: locked until the unlock timestamp, then open for release
// signatures, then released. The program enforces this; the app only mirrors
// it to decide what to show.
export function getPotStatus(pot: Pot, now = Date.now()): PotStatus {
  if (pot.isReleased) {
    return 'released'
  }
  return now / 1000 >= Number(pot.unlockTimestamp) ? 'unlocked' : 'locked'
}

export function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
