/**
 * Status aggregation, kept pure so it can be unit-tested without running any installs.
 *
 * The core rule: only FUNCTIONAL checks (build, rust, boot) can make a template "fail" —
 * a template that builds and runs is not broken. Advisory dimensions (outdated deps, audit
 * advisories, deprecated direct deps, doc drift) cap the overall status at "warn"; they're
 * signals to act on, not a broken template, and they overlap dependabot.
 */

import type { Status } from './types.js'

export const overallStatus = (functional: Status[], advisory: Status[]): Status => {
  if (functional.includes('fail')) return 'fail'
  // Nothing functional could be verified (e.g. a Rust-only template on a machine without
  // cargo): advisory results alone never vouch for a template, so it stays "skip".
  if (functional.length > 0 && functional.every((status) => status === 'skip')) return 'skip'
  const all = [...functional, ...advisory]
  if (all.includes('warn') || advisory.includes('fail')) return 'warn'
  if (all.length > 0 && all.every((status) => status === 'skip')) return 'skip'
  return 'pass'
}

/**
 * Overall status for one template. A needs-setup skip (the build couldn't run without
 * credentials) only speaks for the build dimension: an independent functional failure
 * (rust, boot) still fails the template, otherwise it reads "skip" rather than being
 * bubbled up to pass/warn by advisory checks.
 */
export const templateStatus = (functional: Status[], advisory: Status[], needsSetupSkip: boolean): Status => {
  if (needsSetupSkip && !functional.includes('fail')) return 'skip'
  return overallStatus(functional, advisory)
}

/** Pick the worst of a set of statuses (fail > warn > pass > skip), for summaries. */
export const worst = (statuses: Status[]): Status => {
  if (statuses.includes('fail')) return 'fail'
  if (statuses.includes('warn')) return 'warn'
  if (statuses.includes('pass')) return 'pass'
  return 'skip'
}
