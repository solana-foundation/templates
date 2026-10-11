/**
 * Render a TriageReport to Markdown and build the "draft issue" block a human can paste.
 * Mirrors the style of scripts/health/report.ts: facts first, regressions on top, repro
 * command on every finding. Nothing here files anything.
 */

import { existsSync, readdirSync, rmSync } from 'fs'
import { join } from 'path'
import type { DraftIssue, Finding, FindingClass, TriageReport, TriageSummary } from './types.js'
import { FINDING_CLASSES } from './types.js'

const SEVERITY_ICON = { fail: '❌', warn: '⚠️' } as const

export const summarize = (findings: readonly Finding[], templates: number): TriageSummary => {
  const byClass = Object.fromEntries(FINDING_CLASSES.map((cls) => [cls, 0])) as Record<FindingClass, number>
  for (const finding of findings) byClass[finding.class] += 1
  return {
    templates,
    findings: findings.length,
    regressions: findings.filter((finding) => finding.regression).length,
    fails: findings.filter((finding) => finding.severity === 'fail').length,
    warns: findings.filter((finding) => finding.severity === 'warn').length,
    autoPatchable: findings.filter((finding) => finding.autoPatchable).length,
    byClass,
  }
}

const titleFor = (finding: Finding): string => {
  const subject: Record<FindingClass, string> = {
    'lockfile-out-of-date': 'lockfile is out of date',
    'peer-dependency-conflict': 'peer dependency conflict on install',
    'missing-module': 'build fails with a missing module',
    'typescript-error': 'build fails with a TypeScript error',
    'framework-breaking-change': 'framework or engine breaking change',
    'registry-or-network': 'install hit a registry or network error',
    'temp-dir-or-process': 'install or build hit an infra error',
    'needs-credentials': 'needs credentials to verify',
    'rust-compile': 'cargo check fails',
    'boot-failure': 'dev server does not boot',
    'qa-render-failure': 'page renders an error state',
    'outdated-major': 'direct dependencies are a major version behind',
    'vulnerable-deps': 'audit reports known vulnerabilities',
    'deprecated-direct-dep': 'direct dependency is deprecated',
    'doc-drift': 'README references a script that does not exist',
    'unknown-failure': 'build fails (unclassified)',
  }
  return `[health] ${finding.templateId}: ${subject[finding.class]}`
}

/** Title + body a maintainer can paste into `gh issue create` once the finding is confirmed. */
export const draftIssue = (finding: Finding, report: Pick<TriageReport, 'source'>): DraftIssue => {
  const lines: string[] = []
  lines.push(
    `Found by the templates health check (${report.source.reportGeneratedAt.slice(0, 10)}), classified as \`${finding.class}\` with ${finding.confidence} confidence.${finding.regression ? ' This is a regression against the baseline run.' : ''}`,
    '',
    '## Evidence',
    '',
    '```',
    ...finding.evidence,
    '```',
    '',
    '## Reproduce',
    '',
    '```bash',
    finding.reproduce,
    '```',
    '',
    '## Suggested action',
    '',
    finding.recommendedAction,
    '',
    `Dedupe key: \`${finding.dedupeKey}\``,
    '',
  )
  return { title: titleFor(finding), body: lines.join('\n') }
}

const findingBlock = (finding: Finding, report: TriageReport): string[] => {
  const draft = draftIssue(finding, report)
  const out: string[] = []
  out.push(
    `### ${SEVERITY_ICON[finding.severity]} ${finding.templateId} · \`${finding.class}\`${finding.regression ? ' · 🔴 regression' : ''}`,
  )
  out.push(
    `- **Confidence:** ${finding.confidence} · **Auto-patchable:** ${finding.autoPatchable ? 'yes' : 'no'} · **Dedupe:** \`${finding.dedupeKey}\``,
  )
  out.push(`- **Action:** ${finding.recommendedAction}`)
  out.push('- **Evidence:**')
  out.push('```')
  out.push(...finding.evidence)
  out.push('```')
  out.push('- **Repro:**')
  out.push('```bash')
  out.push(finding.reproduce)
  out.push('```')
  out.push('<details><summary>Draft issue (paste after confirming on a second run)</summary>', '')
  out.push(`**Title:** ${draft.title}`, '')
  out.push(draft.body)
  out.push('</details>', '')
  return out
}

export const toMarkdown = (report: TriageReport): string => {
  const { summary } = report
  const lines: string[] = []
  lines.push(`# Templates Triage — ${report.generatedAt.slice(0, 10)}`)
  lines.push('')
  lines.push(
    `**${summary.regressions} regression · ${summary.fails} fail · ${summary.warns} warn** across ${summary.findings} finding(s) in ${summary.templates} template(s) · ${summary.autoPatchable} auto-patchable`,
  )
  lines.push('')
  lines.push(
    `_Source: ${report.source.report} (generated ${report.source.reportGeneratedAt.slice(0, 19)}) · baseline: ${report.source.baseline ?? 'none'}_`,
  )
  lines.push('')
  lines.push(
    '> Skeptical by design: nothing here is filed automatically. Confirm a finding on a second run (or against a baseline) before opening an issue or a PR.',
  )
  lines.push('')

  lines.push('## Summary by class', '')
  lines.push('| Class | Count |', '| --- | --- |')
  for (const cls of FINDING_CLASSES)
    if (summary.byClass[cls] > 0) lines.push(`| \`${cls}\` | ${summary.byClass[cls]} |`)
  if (summary.findings === 0) lines.push('| (none) | 0 |')
  lines.push('')

  const regressions = report.findings.filter((finding) => finding.regression)
  const fails = report.findings.filter((finding) => !finding.regression && finding.severity === 'fail')
  const warns = report.findings.filter((finding) => !finding.regression && finding.severity === 'warn')

  if (regressions.length) {
    lines.push('## 🔴 Regressions', '')
    for (const finding of regressions) lines.push(...findingBlock(finding, report))
  }
  if (fails.length) {
    lines.push('## ❌ Failures', '')
    for (const finding of fails) lines.push(...findingBlock(finding, report))
  }
  if (warns.length) {
    lines.push('## ⚠️ Advisories', '')
    for (const finding of warns) lines.push(...findingBlock(finding, report))
  }
  if (report.findings.length === 0) lines.push('_No findings: every template passed._', '')

  lines.push('---')
  lines.push(
    '_Next steps: `pnpm triage --patch` writes diff proposals for auto-patchable findings; `pnpm triage --apply <patch>` applies one to the working tree; open the PR yourself with `gh pr create --draft`. See `docs/agents/triage.md`._',
  )
  return lines.join('\n') + '\n'
}

/** Keep only the n most recent timestamped reports (json + md pairs) in the output dir. */
export const pruneReports = (outDir: string, keep: number): number => {
  if (keep <= 0 || !existsSync(outDir)) return 0
  const stampRe = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})\.(json|md)$/
  const stamps = [
    ...new Set(
      readdirSync(outDir)
        .map((file) => file.match(stampRe)?.[1])
        .filter((stamp): stamp is string => Boolean(stamp)),
    ),
  ]
    .sort()
    .reverse()
  let removed = 0
  for (const stamp of stamps.slice(keep)) {
    for (const ext of ['json', 'md']) {
      const reportPath = join(outDir, `${stamp}.${ext}`)
      if (existsSync(reportPath)) {
        rmSync(reportPath, { force: true })
        removed++
      }
    }
  }
  return removed
}
