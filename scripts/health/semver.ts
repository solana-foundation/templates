/**
 * Tiny, dependency-free version helpers for classifying how far behind a dep is.
 * Pure functions, unit-tested in semver.test.ts.
 */

import type { OutdatedDep } from './types.js'

/** Parse a version like "^1.2.3" / ">=2.0.0" / "1.2.3-rc.1" into [major, minor, patch]. */
export const parseVersion = (version: string): [number, number, number] | null => {
  const match = version.replace(/^[\^~>=<\s]+/, '').match(/^(\d+)\.(\d+)\.(\d+)/)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null
}

/** Classify the gap between an installed version and the latest published one. */
export const bumpKind = (current: string, latest: string): OutdatedDep['bump'] => {
  const currentParts = parseVersion(current)
  const latestParts = parseVersion(latest)
  if (!currentParts || !latestParts) return 'unknown'
  if (latestParts[0] > currentParts[0]) return 'major'
  if (latestParts[1] > currentParts[1]) return 'minor'
  if (latestParts[2] > currentParts[2]) return 'patch'
  return 'patch'
}
