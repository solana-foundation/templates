/**
 * Render a HealthReport to Markdown and diff two reports so regressions
 * (passing last run, failing now) jump out - that's the highest-signal output.
 */

import type { HealthReport, Status, TemplateReport } from './types.js'

const ICON: Record<Status, string> = { pass: '✅', warn: '⚠️', fail: '❌', skip: '⏭️' }

const statusLine = (template: TemplateReport): string => {
  const parts: string[] = []
  if (template.build.status !== 'skip') parts.push(`build ${ICON[template.build.status]}`)
  if (template.rust?.available) parts.push(`rust ${ICON[template.rust.status]}${template.rust.tested ? '+test' : ''}`)
  if (template.deps.available)
    parts.push(
      `deps ${ICON[template.deps.status]}(${template.deps.major}M/${template.deps.minor}m/${template.deps.patch}p)`,
    )
  if (template.audit.available && template.audit.critical + template.audit.high + template.audit.moderate > 0)
    parts.push(
      `vuln ${ICON[template.audit.status]}(${template.audit.critical}C/${template.audit.high}H/${template.audit.moderate}M)`,
    )
  if (template.deprecation.packages.length)
    parts.push(`deprecated ${ICON[template.deprecation.status]}(${template.deprecation.packages.length})`)
  if (template.docDrift.missingScripts.length) parts.push(`docs ${ICON[template.docDrift.status]}`)
  if (template.boot) parts.push(`boot ${ICON[template.boot.status]}`)
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

  const fails = report.templates.filter((template) => template.status === 'fail')
  const warns = report.templates.filter((template) => template.status === 'warn')
  const passes = report.templates.filter((template) => template.status === 'pass')
  const skips = report.templates.filter((template) => template.status === 'skip')

  if (fails.length) {
    lines.push('## ❌ Failures', '')
    for (const template of fails) lines.push(...failureBlock(template))
  }

  if (warns.length) {
    lines.push('## ⚠️ Warnings', '')
    for (const template of warns) {
      lines.push(
        `### ${template.id}${template.flaky ? ' ⚡ (flaky — failed under load, passed on isolated retry)' : ''}`,
      )
      lines.push(`- ${statusLine(template)}`)
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
      if (template.needsSecrets) lines.push(`- ⓘ needs external credentials to fully verify (runtime not checked here)`)
      lines.push('')
    }
  }

  if (passes.length) {
    lines.push('## ✅ Passing', '')
    for (const template of passes)
      lines.push(`- **${template.id}** — ${statusLine(template)}${template.flaky ? ' ⚡ flaky' : ''}`)
    lines.push('')
  }

  if (skips.length) {
    lines.push('## ⏭️ Skipped', '')
    for (const template of skips) {
      const reason = template.build.tail || template.deps.note || 'see notes'
      lines.push(`- **${template.id}** (${template.kind}) — ${reason.split('\n')[0]}`)
    }
    lines.push('')
  }

  lines.push('---')
  lines.push(
    '_Dimensions not decided by this script (whole-stack relevance, on-chain runtime correctness) live in `docs/agents/health-check.md`._',
  )
  return lines.join('\n') + '\n'
}

const failureBlock = (template: TemplateReport): string[] => {
  const out: string[] = []
  out.push(`### ❌ ${template.id}`)
  out.push(`- **Kind:** ${template.kind} · **PM:** ${template.packageManager}`)
  // Show whichever functional check actually failed (npm build, cargo, or boot).
  const failed =
    template.rust?.status === 'fail'
      ? { what: 'rust', command: template.rust.command, tail: template.rust.tail }
      : template.boot?.status === 'fail'
        ? { what: 'boot', command: 'dev server', tail: template.boot.note ?? '' }
        : {
            what: `build (${template.build.phase})${template.build.timedOut ? ' timed out' : ''}`,
            command: template.build.command,
            tail: template.build.tail,
          }
  out.push(`- **Failed:** ${failed.what}`)
  out.push(`- **Command:** \`${failed.command}\``)
  if (template.audit.critical + template.audit.high > 0)
    out.push(`- **Vulnerabilities:** ${template.audit.critical} critical, ${template.audit.high} high`)
  out.push('- **Output:**')
  out.push('```')
  out.push(failed.tail.slice(0, 2500))
  out.push('```')
  out.push(`- **Repro:** \`pnpm health --only ${template.id}\``)
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
  const previousById = new Map(baseline.templates.map((template) => [template.id, template.status]))
  const currentById = new Map(current.templates.map((template) => [template.id, template.status]))
  const regressions: string[] = []
  const fixed: string[] = []
  const newTemplates: string[] = []

  for (const template of current.templates) {
    const before = previousById.get(template.id)
    if (before === undefined) {
      newTemplates.push(template.id)
      continue
    }
    if (before !== 'fail' && template.status === 'fail') regressions.push(template.id)
    if (before === 'fail' && template.status !== 'fail') fixed.push(template.id)
  }
  const removed = [...previousById.keys()].filter((id) => !currentById.has(id))
  return { regressions, fixed, newTemplates, removed }
}

export const diffToMarkdown = (diff: Diff): string => {
  const lines: string[] = ['## Regressions vs last run', '']
  if (!diff.regressions.length && !diff.fixed.length && !diff.newTemplates.length && !diff.removed.length) {
    lines.push('_No changes vs baseline._')
    return lines.join('\n') + '\n'
  }
  if (diff.regressions.length) lines.push(`- 🔴 **Regressed (now failing):** ${diff.regressions.join(', ')}`)
  if (diff.fixed.length) lines.push(`- 🟢 **Fixed:** ${diff.fixed.join(', ')}`)
  if (diff.newTemplates.length) lines.push(`- 🆕 **New:** ${diff.newTemplates.join(', ')}`)
  if (diff.removed.length) lines.push(`- ➖ **Removed:** ${diff.removed.join(', ')}`)
  return lines.join('\n') + '\n'
}
