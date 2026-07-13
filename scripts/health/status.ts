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
  const all = [...functional, ...advisory]
  if (all.includes('warn') || advisory.includes('fail')) return 'warn'
  if (all.length > 0 && all.every((status) => status === 'skip')) return 'skip'
  return 'pass'
}

/** Pick the worst of a set of statuses (fail > warn > pass > skip), for summaries. */
export const worst = (statuses: Status[]): Status => {
  if (statuses.includes('fail')) return 'fail'
  if (statuses.includes('warn')) return 'warn'
  if (statuses.includes('pass')) return 'pass'
  return 'skip'
}
