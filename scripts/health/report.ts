/**
 * Render a HealthReport to Markdown and diff two reports so regressions
 * (passing last run, failing now) jump out - that's the highest-signal output.
 */

import type { HealthReport, QaResult, Status, TemplateReport } from './types.js'
import { classifyRender, oneLine } from './qa.js'

const ICON: Record<Status, string> = { pass: '✅', warn: '⚠️', fail: '❌', skip: '⏭️' }

const statusLine = (template: TemplateReport): string => {
  const parts: string[] = []
  if (template.build.status !== 'skip') parts.push(`build ${ICON[template.build.status]}`)
  if (template.rust?.available) parts.push(`rust ${ICON[template.rust.status]}${template.rust.tested ? '+test' : ''}`)
  // An advisory check that could not run (registry down, timeout) must stay visible: a
  // clean-looking line would otherwise hide that nobody checked.
  if (template.deps.available)
    parts.push(
      `deps ${ICON[template.deps.status]}(${template.deps.major}M/${template.deps.minor}m/${template.deps.patch}p)`,
    )
  else if (template.deps.status === 'skip' && template.deps.note) parts.push(`deps ${ICON.skip}(unavailable)`)
  if (template.audit.available && template.audit.critical + template.audit.high + template.audit.moderate > 0)
    parts.push(
      `vuln ${ICON[template.audit.status]}(${template.audit.critical}C/${template.audit.high}H/${template.audit.moderate}M)`,
    )
  else if (!template.audit.available && template.audit.status === 'skip' && template.audit.note)
    parts.push(`vuln ${ICON.skip}(unavailable)`)
  if (template.deprecation.packages.length)
    parts.push(`deprecated ${ICON[template.deprecation.status]}(${template.deprecation.packages.length})`)
  if (template.docDrift.missingScripts.length) parts.push(`docs ${ICON[template.docDrift.status]}`)
  if (template.boot) parts.push(`boot ${ICON[template.boot.status]}`)
  if (template.qa) parts.push(`qa ${ICON[template.qa.status]}`)
  return parts.join(' · ')
}

/**
 * Advisory checks that did not complete for a template, with the reason the runner recorded
 * (e.g. `npm audit` hit ECONNREFUSED). Rendered next to the completed checks so a report never
 * reads as clean when part of it never ran.
 */
export const unavailableChecks = (template: TemplateReport): string[] => {
  const out: string[] = []
  if (!template.deps.available && template.deps.status === 'skip' && template.deps.note)
    out.push(`deps: ${template.deps.note.split('\n')[0]}`)
  if (!template.audit.available && template.audit.status === 'skip' && template.audit.note)
    out.push(`vuln: ${template.audit.note.split('\n')[0]}`)
  return out
}

const MAX_DIRECT_ADVISORIES = 8
const MAX_TRANSITIVE_ADVISORIES = 4

/**
 * Name the vulnerable packages so a severity count becomes a fix: direct dependencies first
 * (bumpable in the template itself), then what pulls the transitive ones in. Nothing is
 * rendered for reports written before `audit.advisories` existed or when the list is empty.
 */
const advisoryLines = (template: TemplateReport): string[] => {
  const advisories = template.audit.advisories ?? []
  if (!advisories.length) return []
  const direct = advisories.filter((advisory) => advisory.direct)
  const transitive = advisories.filter((advisory) => !advisory.direct)
  const more = (hidden: number): string => (hidden > 0 ? `, +${hidden} more` : '')
  const out: string[] = []
  if (direct.length)
    out.push(
      `- **Direct:** ${direct
        .slice(0, MAX_DIRECT_ADVISORIES)
        .map(
          (advisory) =>
            `\`${advisory.name}\` (${advisory.severity}, ${advisory.fixAvailable ? 'fix available' : 'no fix yet'})`,
        )
        .join(', ')}${more(direct.length - MAX_DIRECT_ADVISORIES)}`,
    )
  if (transitive.length)
    out.push(
      `- **Transitive:** ${transitive
        .slice(0, MAX_TRANSITIVE_ADVISORIES)
        .map(
          (advisory) => `\`${advisory.name}\`${advisory.via ? ` via \`${advisory.via}\`` : ''} (${advisory.severity})`,
        )
        .join(', ')}${more(transitive.length - MAX_TRANSITIVE_ADVISORIES)}`,
    )
  if (template.audit.advisoriesTruncated)
    out.push(
      `- _advisory list capped at ${advisories.length}; run \`${template.packageManager} audit\` for the full set_`,
    )
  return out
}

const incompleteLine = (template: TemplateReport): string | null => {
  const missing = unavailableChecks(template)
  return missing.length ? `⏭️ incomplete: ${missing.join(' · ')}` : null
}

/** Why the render QA said what it said: classified reasons plus any harness note. */
const qaReasons = (qa: QaResult): string[] => {
  const reasons = classifyRender({
    ...qa,
    pageErrorsTotal: qa.pageErrorsTotal ?? qa.pageErrors.length,
    overlay: qa.overlay ?? null,
    overlayText: qa.overlayText ?? null,
  }).reasons
  if (qa.note && !reasons.length) reasons.push(qa.note)
  return reasons
}

/** Evidence lines for a template's render QA (used in failure and warning blocks). */
const qaLines = (qa: QaResult): string[] => {
  const out: string[] = []
  const reasons = qaReasons(qa)
  if (reasons.length) out.push(`- **QA:** ${reasons.join('; ')}`)
  if (qa.pageErrors.length)
    out.push(
      `- **Page errors:** ${qa.pageErrors
        .slice(0, 3)
        .map((error) => `\`${oneLine(error)}\``)
        .join(' · ')}`,
    )
  if (qa.consoleErrors.length)
    out.push(
      `- **Console errors:** ${qa.consoleErrors
        .slice(0, 3)
        .map((error) => `\`${oneLine(error)}\``)
        .join(' · ')}`,
    )
  if (qa.failedRequests.length) out.push(`- **Failed requests:** ${qa.failedRequests.slice(0, 5).join(', ')}`)
  if (qa.screenshot) out.push(`- **Screenshot:** [${qa.screenshot}](${qa.screenshot})`)
  return out
}

export const toMarkdown = (report: HealthReport): string => {
  const { summary } = report
  const lines: string[] = []
  lines.push(`# Templates Health Report — ${report.generatedAt.slice(0, 10)}`)
  lines.push('')
  const unrecognized = report.unrecognized ?? []
  lines.push(
    `**${summary.pass} pass · ${summary.warn} warn · ${summary.fail} fail · ${summary.skip} skip** out of ${summary.total} templates${
      unrecognized.length ? ` · ${unrecognized.length} unrecognized` : ''
    }`,
  )
  lines.push('')
  lines.push(
    `_Package manager: ${report.packageManager} · source: ${report.options.source} · build: ${report.options.build} · boot: ${report.options.boot}${report.options.qa ? ' · qa: true' : ''}_`,
  )
  lines.push('')

  const fails = report.templates.filter((template) => template.status === 'fail')
  const warns = report.templates.filter((template) => template.status === 'warn')
  const passes = report.templates.filter((template) => template.status === 'pass')
  const skips = report.templates.filter((template) => template.status === 'skip')

  if (fails.length) {
    lines.push('## ❌ Failures', '')
    for (const template of fails) lines.push(...failureBlock(template, report.options))
  }

  if (warns.length) {
    lines.push('## ⚠️ Warnings', '')
    for (const template of warns) {
      lines.push(
        `### ${template.id}${template.flaky ? ' ⚡ (flaky — failed under load, passed on isolated retry)' : ''}`,
      )
      lines.push(`- ${statusLine(template)}`)
      lines.push(...advisoryLines(template))
      if (template.deps.major > 0)
        lines.push(
          `- ${template.deps.major} major version(s) behind: ${template.deps.outdated
            .filter((dep) => dep.bump === 'major')
            .map((dep) => `\`${dep.name}\` ${dep.current}→${dep.latest}`)
            .join(', ')}`,
        )
      if (template.deprecation.packages.length)
        lines.push(
          `- deprecated: ${template.deprecation.packages.map((packageName) => `\`${packageName}\``).join(', ')}`,
        )
      if (template.docDrift.missingScripts.length)
        lines.push(
          `- README references missing scripts: ${template.docDrift.missingScripts.map((script) => `\`${script}\``).join(', ')}`,
        )
      if (template.qa && template.qa.status === 'warn') lines.push(...qaLines(template.qa))
      if (template.needsSecrets) lines.push(`- ⓘ needs external credentials to fully verify (runtime not checked here)`)
      const incomplete = incompleteLine(template)
      if (incomplete) lines.push(`- ${incomplete}`)
      lines.push('')
    }
  }

  if (passes.length) {
    lines.push('## ✅ Passing', '')
    for (const template of passes)
      lines.push(
        `- **${template.id}** — ${statusLine(template)}${template.flaky ? ' ⚡ flaky' : ''}${incompleteLine(template) ? ` · ${incompleteLine(template)}` : ''}`,
      )
    lines.push('')
  }

  if (skips.length) {
    lines.push('## ⏭️ Skipped', '')
    for (const template of skips) lines.push(`- **${template.id}** (${template.kind}) — ${skipReason(template)}`)
    lines.push('')
  }

  if (unrecognized.length) {
    lines.push('## ❓ Unrecognized', '')
    for (const entry of unrecognized) lines.push(`- \`${entry.id}\` — ${entry.reason}`)
    lines.push('')
    lines.push(
      '_Not counted as pass or fail: to be health-checked, a template must follow `docs/agents/template-authoring.md` (a `package.json` with a `ci` or `build` script, or a `Cargo.toml`)._',
    )
    lines.push('')
  }

  const shots = report.templates.filter((template) => template.qa?.screenshot)
  if (shots.length) {
    lines.push('## 📸 Screenshots', '')
    lines.push(
      '_Full-page render of each web template as the dev server served it (links are relative to this file)._',
      '',
    )
    for (const template of shots) {
      const qa = template.qa!
      lines.push(`### ${template.id} ${ICON[qa.status]}`, '')
      lines.push(`![${template.id}](${qa.screenshot})`, '')
    }
  }

  lines.push('---')
  lines.push(
    '_Dimensions not decided by this script (whole-stack relevance, on-chain runtime correctness) live in `docs/agents/health-check.md`._',
  )
  return lines.join('\n') + '\n'
}

/**
 * Why a template could not be verified, for the Skipped section. Every skipped functional
 * check contributes its own reason (a Rust template without cargo says so, instead of only
 * the npm side's "no build script" note).
 */
export const skipReason = (template: TemplateReport): string => {
  const reasons: string[] = []
  if (template.build.status === 'skip' && template.build.tail) reasons.push(template.build.tail)
  if (template.rust?.status === 'skip' && template.rust.note) reasons.push(`rust: ${template.rust.note}`)
  if (template.boot?.status === 'skip' && template.boot.note) reasons.push(`boot: ${template.boot.note}`)
  // A render that only failed for want of a declared config value ("requires configuration: KEY").
  if (template.qa?.status === 'skip' && template.qa.note) reasons.push(`qa: ${template.qa.note}`)
  if (reasons.length === 0 && template.deps.note) reasons.push(template.deps.note)
  return reasons.length ? reasons.map((reason) => reason.split('\n')[0]).join(' · ') : 'see notes'
}

/**
 * The exact command that reproduces a template's run: carries the flags that shaped it
 * (`--boot`, `--cargo-test`, `--pm`, `--no-build`). Older reports lack the newer option
 * fields, so they're read as "not passed".
 */
export const reproCommand = (id: string, options: HealthReport['options']): string => {
  const parts = ['pnpm health', '--only', id]
  if (!options.build) parts.push('--no-build')
  // --qa implies --boot, so one flag reproduces both.
  if (options.qa) parts.push('--qa')
  else if (options.boot) parts.push('--boot')
  if (options.cargoTest) parts.push('--cargo-test')
  if (options.pm) parts.push('--pm', options.pm)
  return parts.join(' ')
}

const failureBlock = (template: TemplateReport, options: HealthReport['options']): string[] => {
  const out: string[] = []
  out.push(`### ❌ ${template.id}`)
  out.push(`- **Kind:** ${template.kind} · **PM:** ${template.packageManager}`)
  const incomplete = incompleteLine(template)
  if (incomplete) out.push(`- ${incomplete}`)
  // Show whichever functional check actually failed (npm build, cargo, or boot).
  const failed =
    template.rust?.status === 'fail'
      ? { what: 'rust', command: template.rust.command, tail: template.rust.tail }
      : template.boot?.status === 'fail'
        ? { what: 'boot', command: 'dev server', tail: template.boot.note ?? '' }
        : template.qa?.status === 'fail'
          ? {
              what: 'qa (render)',
              command: `headless browser → ${template.qa.url ?? 'dev server'}`,
              tail: qaTail(template.qa),
            }
          : {
              what: `build (${template.build.phase})${template.build.timedOut ? ' timed out' : ''}`,
              command: template.build.command,
              tail: template.build.tail,
            }
  out.push(`- **Failed:** ${failed.what}`)
  out.push(`- **Command:** \`${failed.command}\``)
  if (template.audit.critical + template.audit.high > 0)
    out.push(`- **Vulnerabilities:** ${template.audit.critical} critical, ${template.audit.high} high`)
  out.push(...advisoryLines(template))
  out.push('- **Output:**')
  out.push('```')
  out.push(failed.tail.slice(0, 2500))
  out.push('```')
  if (template.qa && template.qa.status !== 'fail') out.push(...qaLines(template.qa))
  else if (template.qa?.screenshot) out.push(`- **Screenshot:** [${template.qa.screenshot}](${template.qa.screenshot})`)
  out.push(`- **Repro:** \`${reproCommand(template.id, options)}\``)
  out.push('')
  return out
}

/** Plain-text evidence block for a failed render check. */
const qaTail = (qa: QaResult): string => {
  const lines: string[] = [...qaReasons(qa)]
  if (qa.note && lines.length && !lines.includes(qa.note)) lines.push(qa.note)
  if (qa.overlayText) lines.push(`overlay text: ${oneLine(qa.overlayText)}`)
  for (const error of qa.pageErrors.slice(0, 5)) lines.push(`page error: ${oneLine(error)}`)
  if (qa.pageErrorsTotal && qa.pageErrorsTotal > qa.pageErrors.length)
    lines.push(`(${qa.pageErrorsTotal} page errors in total, ${qa.pageErrors.length} kept)`)
  for (const error of qa.consoleErrors.slice(0, 5)) lines.push(`console error: ${oneLine(error)}`)
  for (const request of qa.failedRequests.slice(0, 5)) lines.push(`failed request: ${request}`)
  return lines.join('\n')
}

// ---------- diff vs a previous run ----------

export type Diff = {
  regressions: string[] // pass/warn -> fail
  fixed: string[] // fail -> pass/warn, and ONLY those: skip is unknown, not fixed
  becameUnverified: string[] // anything -> skip, we can no longer vouch for these
  newlyVerified: string[] // skip -> anything, back under observation (current status shown)
  lostVerification: string[] // template -> unrecognised: the check no longer understands it ("id — reason")
  verificationRestored: string[] // unrecognised -> template with a real verdict (pass/warn/fail, status shown)
  recognizedNotVerified: string[] // unrecognised -> template but skip: recognition is back, verification is not
  newUnrecognized: string[] // in neither baseline list: a new dir/group that was never verified ("id — reason")
  newTemplates: string[]
  removed: string[]
}

export const diffReports = (current: HealthReport, baseline: HealthReport): Diff => {
  const previousById = new Map(baseline.templates.map((template) => [template.id, template.status]))
  const currentById = new Map(current.templates.map((template) => [template.id, template.status]))
  // Reports written before the field existed have no unrecognised list: read as "none".
  const previousUnrecognized = new Set((baseline.unrecognized ?? []).map((entry) => entry.id))
  const currentUnrecognized = new Map((current.unrecognized ?? []).map((entry) => [entry.id, entry.reason]))
  const regressions: string[] = []
  const fixed: string[] = []
  const becameUnverified: string[] = []
  const newlyVerified: string[] = []
  const lostVerification: string[] = []
  const verificationRestored: string[] = []
  const recognizedNotVerified: string[] = []
  const newUnrecognized: string[] = []
  const newTemplates: string[] = []

  // The baseline may hold a whole group as one unrecognised entry (its dir was unreadable or
  // missing); everything under it was unseen, not absent.
  const isPrefixOf = (groupId: string, id: string): boolean => id.startsWith(`${groupId}/`)
  const previouslyUnrecognizedAncestorOf = (id: string): boolean =>
    [...previousUnrecognized].some((groupId) => isPrefixOf(groupId, id))

  for (const template of current.templates) {
    const before = previousById.get(template.id)
    if (before === undefined) {
      // An id (or group) the last run could not classify is back under the check, not a new
      // template. When it came back as skip, only the recognition returned: nothing was verified yet.
      if (!previousUnrecognized.has(template.id) && !previouslyUnrecognizedAncestorOf(template.id))
        newTemplates.push(template.id)
      else if (template.status === 'skip') {
        const reason = safeSkipReason(template)
        recognizedNotVerified.push(reason ? `${template.id} — ${reason}` : template.id)
      } else verificationRestored.push(`${template.id} (now ${template.status})`)
      continue
    }
    // skip means "could not verify": it is never a regression, never a fix, and
    // transitions in and out of it get their own buckets so they stay visible.
    if (before === 'skip' && template.status !== 'skip') {
      newlyVerified.push(`${template.id} (now ${template.status})`)
      if (template.status === 'fail') regressions.push(template.id)
      continue
    }
    if (before !== 'skip' && template.status === 'skip') {
      becameUnverified.push(template.id)
      continue
    }
    if ((before === 'pass' || before === 'warn') && template.status === 'fail') regressions.push(template.id)
    if (before === 'fail' && (template.status === 'pass' || template.status === 'warn')) fixed.push(template.id)
  }
  // A template the check understood last run and cannot classify now is not "removed":
  // it is still there, we just lost the ability to verify it. Say so, with the reason.
  // One that was in neither baseline list is new and has never been verified: say so, or a
  // freshly added malformed template would diff as "no changes".
  for (const [id, reason] of currentUnrecognized) {
    if (previousById.has(id)) lostVerification.push(`${id} — ${reason}`)
    else if (!previousUnrecognized.has(id)) newUnrecognized.push(`${id} — ${reason}`)
  }
  // A whole group that went missing/unreadable is one unrecognised entry whose id is the
  // group path; its children are gone from `templates` but not from the repo. They lost
  // verification under the group's reason; they were not removed.
  const unrecognizedGroupOf = (id: string): [string, string] | undefined =>
    [...currentUnrecognized.entries()]
      .filter(([groupId]) => isPrefixOf(groupId, id))
      .sort(([left], [right]) => right.length - left.length)[0]
  const removed: string[] = []
  for (const id of previousById.keys()) {
    if (currentById.has(id) || currentUnrecognized.has(id)) continue
    const group = unrecognizedGroupOf(id)
    if (group) lostVerification.push(`${id} — ${group[1]}`)
    else removed.push(id)
  }
  // A baseline-unrecognised id is gone for good only when nothing claims it now: not the id
  // itself, not a group above it (still unverified), and not children below it (a group that
  // became readable again is reported through its children, not as a removal).
  const hasDescendantNow = (groupId: string): boolean =>
    [...currentById.keys(), ...currentUnrecognized.keys()].some((id) => isPrefixOf(groupId, id))
  for (const id of previousUnrecognized)
    if (!currentById.has(id) && !currentUnrecognized.has(id) && !unrecognizedGroupOf(id) && !hasDescendantNow(id))
      removed.push(id)
  return {
    regressions,
    fixed,
    becameUnverified,
    newlyVerified,
    lostVerification,
    verificationRestored,
    recognizedNotVerified,
    newUnrecognized,
    newTemplates,
    removed,
  }
}

/**
 * skipReason for a template entry that may come from a partial or older report: it needs the
 * build/deps dimensions, and a diff must never throw because a baseline lacks them.
 */
const safeSkipReason = (template: TemplateReport): string | null =>
  template.build && template.deps ? skipReason(template) : null

export const diffToMarkdown = (diff: Diff): string => {
  const lines: string[] = ['## Regressions vs last run', '']
  const empty =
    !diff.regressions.length &&
    !diff.fixed.length &&
    !diff.becameUnverified.length &&
    !diff.newlyVerified.length &&
    !diff.lostVerification.length &&
    !diff.verificationRestored.length &&
    !diff.recognizedNotVerified.length &&
    !diff.newUnrecognized.length &&
    !diff.newTemplates.length &&
    !diff.removed.length
  if (empty) {
    lines.push('_No changes vs baseline._')
    return lines.join('\n') + '\n'
  }
  if (diff.regressions.length) lines.push(`- 🔴 **Regressed (now failing):** ${diff.regressions.join(', ')}`)
  if (diff.becameUnverified.length)
    lines.push(`- 🟡 **Became unverifiable (now skip, needs attention):** ${diff.becameUnverified.join(', ')}`)
  if (diff.lostVerification.length)
    lines.push(`- ❓ **Lost verification (now unrecognized, needs attention):** ${diff.lostVerification.join(', ')}`)
  if (diff.fixed.length) lines.push(`- 🟢 **Fixed:** ${diff.fixed.join(', ')}`)
  if (diff.newlyVerified.length) lines.push(`- 🔵 **Back under observation:** ${diff.newlyVerified.join(', ')}`)
  if (diff.verificationRestored.length)
    lines.push(`- 🔵 **Verification restored:** ${diff.verificationRestored.join(', ')}`)
  if (diff.recognizedNotVerified.length)
    lines.push(`- ❓ **Recognized again but not verified (skip):** ${diff.recognizedNotVerified.join(', ')}`)
  if (diff.newTemplates.length) lines.push(`- 🆕 **New:** ${diff.newTemplates.join(', ')}`)
  if (diff.newUnrecognized.length)
    lines.push(`- ❓ **New unrecognized (never verified):** ${diff.newUnrecognized.join(', ')}`)
  if (diff.removed.length) lines.push(`- ➖ **Removed:** ${diff.removed.join(', ')}`)
  return lines.join('\n') + '\n'
}
