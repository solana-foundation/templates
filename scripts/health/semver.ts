/**
 * Tiny, dependency-free version helpers for classifying how far behind a dep is.
 * Pure functions, unit-tested in semver.test.ts.
 */

import type { OutdatedDep } from './types.js'

/** Parse a version like "^1.2.3" / ">=2.0.0" / "1.2.3-rc.1" into [major, minor, patch]. */
export const parseVersion = (v: string): [number, number, number] | null => {
  const m = v.replace(/^[\^~>=<\s]+/, '').match(/^(\d+)\.(\d+)\.(\d+)/)
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null
}

/** Classify the gap between an installed version and the latest published one. */
export const bumpKind = (current: string, latest: string): OutdatedDep['bump'] => {
  const c = parseVersion(current)
  const l = parseVersion(latest)
  if (!c || !l) return 'unknown'
  if (l[0] > c[0]) return 'major'
  if (l[1] > c[1]) return 'minor'
  if (l[2] > c[2]) return 'patch'
  return 'patch'
}
