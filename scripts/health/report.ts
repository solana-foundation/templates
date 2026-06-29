/**
 * Render a HealthReport to Markdown and diff two reports so regressions
 * (passing last run, failing now) jump out - that's the highest-signal output.
 */

import type { HealthReport, Status, TemplateReport } from './types.js'

const ICON: Record<Status, string> = { pass: '✅', warn: '⚠️', fail: '❌', skip: '⏭️' }

const statusLine = (r: TemplateReport): string => {
  const parts: string[] = []
  if (r.build.status !== 'skip') parts.push(`build ${ICON[r.build.status]}`)
  if (r.rust?.available) parts.push(`rust ${ICON[r.rust.status]}${r.rust.tested ? '+test' : ''}`)
  if (r.deps.available) parts.push(`deps ${ICON[r.deps.status]}(${r.deps.major}M/${r.deps.minor}m/${r.deps.patch}p)`)
  if (r.audit.available && r.audit.critical + r.audit.high + r.audit.moderate > 0)
    parts.push(`vuln ${ICON[r.audit.status]}(${r.audit.critical}C/${r.audit.high}H/${r.audit.moderate}M)`)
  if (r.deprecation.packages.length)
    parts.push(`deprecated ${ICON[r.deprecation.status]}(${r.deprecation.packages.length})`)
  if (r.docDrift.missingScripts.length) parts.push(`docs ${ICON[r.docDrift.status]}`)
  if (r.boot) parts.push(`boot ${ICON[r.boot.status]}`)
  return parts.join(' · ')
}

export const toMarkdown = (report: HealthReport): string => {
  const { summary } = report
  const lines: string[] = []
  lines.push(`# Templates Health Report — ${report.generatedAt.slice(0, 10)}`)
  lines.push('')
  lines.push(
    `**${summary.pass} pass · ${summary.warn} warn · ${summary.fail} fail · ${summary.skip} skip** out of ${summary.total} templates`,
  )
  lines.push('')
  lines.push(
    `_Package manager: ${report.packageManager} · source: ${report.options.source} · build: ${report.options.build} · boot: ${report.options.boot}_`,
  )
  lines.push('')

  const fails = report.templates.filter((t) => t.status === 'fail')
  const warns = report.templates.filter((t) => t.status === 'warn')
  const passes = report.templates.filter((t) => t.status === 'pass')
  const skips = report.templates.filter((t) => t.status === 'skip')

  if (fails.length) {
    lines.push('## ❌ Failures', '')
    for (const t of fails) lines.push(...failureBlock(t))
  }

  if (warns.length) {
    lines.push('## ⚠️ Warnings', '')
    for (const t of warns) {
      lines.push(`### ${t.id}${t.flaky ? ' ⚡ (flaky — failed under load, passed on isolated retry)' : ''}`)
      lines.push(`- ${statusLine(t)}`)
      if (t.deps.major > 0)
        lines.push(
          `- ${t.deps.major} major version(s) behind: ${t.deps.outdated
            .filter((o) => o.bump === 'major')
            .map((o) => `\`${o.name}\` ${o.current}→${o.latest}`)
            .join(', ')}`,
        )
      if (t.deprecation.packages.length)
        lines.push(`- deprecated: ${t.deprecation.packages.map((p) => `\`${p}\``).join(', ')}`)
      if (t.docDrift.missingScripts.length)
        lines.push(
          `- README references missing scripts: ${t.docDrift.missingScripts.map((s) => `\`${s}\``).join(', ')}`,
        )
      if (t.needsSecrets) lines.push(`- ⓘ needs external credentials to fully verify (runtime not checked here)`)
      lines.push('')
    }
  }

  if (passes.length) {
    lines.push('## ✅ Passing', '')
    for (const t of passes) lines.push(`- **${t.id}** — ${statusLine(t)}${t.flaky ? ' ⚡ flaky' : ''}`)
    lines.push('')
  }

  if (skips.length) {
    lines.push('## ⏭️ Skipped', '')
    for (const t of skips) {
      const reason = t.build.tail || t.deps.note || 'see notes'
      lines.push(`- **${t.id}** (${t.kind}) — ${reason.split('\n')[0]}`)
    }
    lines.push('')
  }

  lines.push('---')
  lines.push(
    '_Dimensions not decided by this script (whole-stack relevance, on-chain runtime correctness) live in `docs/agents/health-check.md`._',
  )
  return lines.join('\n') + '\n'
}

const failureBlock = (t: TemplateReport): string[] => {
  const out: string[] = []
  out.push(`### ❌ ${t.id}`)
  out.push(`- **Kind:** ${t.kind} · **PM:** ${t.packageManager}`)
  // Show whichever functional check actually failed (npm build, cargo, or boot).
  const failed =
    t.rust?.status === 'fail'
      ? { what: 'rust', command: t.rust.command, tail: t.rust.tail }
      : t.boot?.status === 'fail'
        ? { what: 'boot', command: 'dev server', tail: t.boot.note ?? '' }
        : {
            what: `build (${t.build.phase})${t.build.timedOut ? ' timed out' : ''}`,
            command: t.build.command,
            tail: t.build.tail,
          }
  out.push(`- **Failed:** ${failed.what}`)
  out.push(`- **Command:** \`${failed.command}\``)
  if (t.audit.critical + t.audit.high > 0)
    out.push(`- **Vulnerabilities:** ${t.audit.critical} critical, ${t.audit.high} high`)
  out.push('- **Output:**')
  out.push('```')
  out.push(failed.tail.slice(0, 2500))
  out.push('```')
  out.push(`- **Repro:** \`pnpm health --only ${t.id}\``)
  out.push('')
  return out
}

// ---------- diff vs a previous run ----------

export type Diff = {
  regressions: string[] // pass/warn -> fail
  fixed: string[] // fail -> pass/warn
  newTemplates: string[]
  removed: string[]
}

export const diffReports = (current: HealthReport, baseline: HealthReport): Diff => {
  const prev = new Map(baseline.templates.map((t) => [t.id, t.status]))
  const cur = new Map(current.templates.map((t) => [t.id, t.status]))
  const regressions: string[] = []
  const fixed: string[] = []
  const newTemplates: string[] = []

  for (const t of current.templates) {
    const before = prev.get(t.id)
    if (before === undefined) {
      newTemplates.push(t.id)
      continue
    }
    if (before !== 'fail' && t.status === 'fail') regressions.push(t.id)
    if (before === 'fail' && t.status !== 'fail') fixed.push(t.id)
  }
  const removed = [...prev.keys()].filter((id) => !cur.has(id))
  return { regressions, fixed, newTemplates, removed }
}

export const diffToMarkdown = (d: Diff): string => {
  const lines: string[] = ['## Regressions vs last run', '']
  if (!d.regressions.length && !d.fixed.length && !d.newTemplates.length && !d.removed.length) {
    lines.push('_No changes vs baseline._')
    return lines.join('\n') + '\n'
  }
  if (d.regressions.length) lines.push(`- 🔴 **Regressed (now failing):** ${d.regressions.join(', ')}`)
  if (d.fixed.length) lines.push(`- 🟢 **Fixed:** ${d.fixed.join(', ')}`)
  if (d.newTemplates.length) lines.push(`- 🆕 **New:** ${d.newTemplates.join(', ')}`)
  if (d.removed.length) lines.push(`- ➖ **Removed:** ${d.removed.join(', ')}`)
  return lines.join('\n') + '\n'
}
