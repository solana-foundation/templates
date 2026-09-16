import { triageFindings } from './baseline.js'
import type {
  BaselineAcknowledgement,
  FindingSeverity,
  ScanResult,
  SecurityBaseline,
  SecurityReport,
  SecuritySummary,
  TriagedFinding,
} from './types.js'

export function createSecurityReport(
  scan: ScanResult,
  baseline: SecurityBaseline,
  generatedAt = new Date().toISOString(),
): SecurityReport {
  const triage = triageFindings(scan.findings, baseline)
  return {
    findings: triage.findings,
    generatedAt,
    scannedDependencyPackages: scan.scannedDependencyPackages,
    scannedTemplates: scan.scannedTemplates,
    schemaVersion: 1,
    staleAcknowledgements: triage.staleAcknowledgements,
    summary: summarizeFindings(triage.findings, triage.staleAcknowledgements),
  }
}

export function renderSecurityReport(report: SecurityReport): string {
  const lines = [
    '# Template security review',
    '',
    '> Advisory only: findings require human review and do not fail the workflow.',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Scanned ${report.scannedTemplates} templates and ${report.scannedDependencyPackages} installed dependency packages.`,
    '',
    `Findings: ${report.summary.new} new, ${report.summary.acknowledged} acknowledged, and ${report.summary.staleAcknowledgements} stale acknowledgements.`,
    '',
    `Severity totals: ${report.summary.high} high, ${report.summary.medium} medium, ${report.summary.low} low.`,
    '',
  ]

  const newFindings = report.findings.filter((finding) => finding.disposition === 'new')
  const acknowledgedFindings = report.findings.filter((finding) => finding.disposition === 'acknowledged')

  lines.push('## New findings', '')
  if (newFindings.length === 0) lines.push('No new findings.', '')
  else renderFindingTable(lines, newFindings)

  if (newFindings.length > 0) lines.push('## Review guidance', '')
  for (const finding of newFindings) {
    lines.push(
      `### ${finding.severity.toUpperCase()}: ${finding.ruleId}`,
      '',
      `- Subject: ${sanitizeDisplayText(finding.subject)}`,
      `- Location: ${sanitizeDisplayText(finding.location)}`,
      `- Why it was flagged: ${finding.message}`,
      `- Recommendation: ${finding.recommendation}`,
      '',
    )
  }

  lines.push('## Acknowledged findings', '')
  if (acknowledgedFindings.length === 0) lines.push('No acknowledged findings.', '')
  else {
    lines.push('| Severity | Rule | Subject | Location | Rationale |', '| --- | --- | --- | --- | --- |')
    for (const finding of acknowledgedFindings) {
      lines.push(
        `| ${finding.severity.toUpperCase()} | ${escapeTableCell(finding.ruleId)} | ${escapeTableCell(finding.subject)} | ${escapeTableCell(finding.location)} | ${escapeTableCell(finding.rationale ?? '')} |`,
      )
    }
    lines.push('')
  }

  lines.push('## Stale acknowledgements', '')
  if (report.staleAcknowledgements.length === 0) lines.push('No stale acknowledgements.', '')
  else {
    lines.push('| Rule | Subject | Location | Previous rationale |', '| --- | --- | --- | --- |')
    for (const acknowledgement of report.staleAcknowledgements) {
      lines.push(
        `| ${escapeTableCell(acknowledgement.ruleId)} | ${escapeTableCell(acknowledgement.subject)} | ${escapeTableCell(acknowledgement.location)} | ${escapeTableCell(acknowledgement.rationale)} |`,
      )
    }
    lines.push('')
  }

  return lines.join('\n')
}

function renderFindingTable(lines: string[], findings: readonly TriagedFinding[]): void {
  lines.push('| Severity | Rule | Subject | Location | Evidence |', '| --- | --- | --- | --- | --- |')
  for (const finding of findings) {
    lines.push(
      `| ${finding.severity.toUpperCase()} | ${escapeTableCell(finding.ruleId)} | ${escapeTableCell(finding.subject)} | ${escapeTableCell(finding.location)} | ${escapeTableCell(finding.evidence)} |`,
    )
  }
  lines.push('')
}

function summarizeFindings(
  findings: readonly TriagedFinding[],
  staleAcknowledgements: readonly BaselineAcknowledgement[],
): SecuritySummary {
  const counts: Record<FindingSeverity, number> = { high: 0, medium: 0, low: 0 }
  for (const finding of findings) counts[finding.severity] += 1
  return {
    ...counts,
    acknowledged: findings.filter((finding) => finding.disposition === 'acknowledged').length,
    new: findings.filter((finding) => finding.disposition === 'new').length,
    staleAcknowledgements: staleAcknowledgements.length,
    total: findings.length,
  }
}

function escapeTableCell(value: string): string {
  return sanitizeDisplayText(value).replaceAll('|', '\\|')
}

function sanitizeDisplayText(value: string): string {
  return value
    .replaceAll(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replaceAll(/\r?\n/g, ' ')
    .trim()
}
