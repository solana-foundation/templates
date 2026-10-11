import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { draftIssue, pruneReports, summarize, toMarkdown } from './report.js'
import type { Finding, TriageReport } from './types.js'

const finding = (over: Partial<Finding>): Finding => ({
  templateId: 'kit/nextjs',
  class: 'typescript-error',
  severity: 'fail',
  confidence: 'high',
  evidence: ["error TS2322: Type 'string' is not assignable to type 'number'."],
  reproduce: 'pnpm health --only kit/nextjs\ncd kit/nextjs && npm run ci',
  recommendedAction: 'Fix the type error.',
  autoPatchable: false,
  regression: false,
  dedupeKey: 'kit/nextjs#typescript-error#abcdef0123',
  ...over,
})

const report = (findings: Finding[]): TriageReport => ({
  schemaVersion: 1,
  generatedAt: '2026-10-10T10:00:00.000Z',
  source: {
    report: 'health-reports/2026-10-09T08-00-00.json',
    reportGeneratedAt: '2026-10-09T08:00:00.000Z',
    baseline: null,
  },
  summary: summarize(findings, 3),
  findings,
})

test('summary counts by severity, regression, patchability and class', () => {
  const summary = summarize(
    [
      finding({}),
      finding({ templateId: 'kit/a', regression: true }),
      finding({ templateId: 'kit/b', class: 'doc-drift', severity: 'warn', autoPatchable: true }),
    ],
    3,
  )
  assert.equal(summary.findings, 3)
  assert.equal(summary.fails, 2)
  assert.equal(summary.warns, 1)
  assert.equal(summary.regressions, 1)
  assert.equal(summary.autoPatchable, 1)
  assert.equal(summary.byClass['typescript-error'], 2)
  assert.equal(summary.byClass['doc-drift'], 1)
  assert.equal(summary.byClass['rust-compile'], 0)
})

test('markdown puts regressions before failures before advisories and carries repro + draft issue', () => {
  const md = toMarkdown(
    report([
      finding({ templateId: 'kit/reg', regression: true }),
      finding({}),
      finding({ templateId: 'kit/warn', class: 'doc-drift', severity: 'warn', autoPatchable: true }),
    ]),
  )
  assert.match(md, /^# Templates Triage — 2026-10-10$/m)
  assert.match(md, /\*\*1 regression · 2 fail · 1 warn\*\*/)
  assert.match(md, /\| `typescript-error` \| 2 \|/)
  const regressionsAt = md.indexOf('## 🔴 Regressions')
  const failuresAt = md.indexOf('## ❌ Failures')
  const advisoriesAt = md.indexOf('## ⚠️ Advisories')
  assert.ok(regressionsAt > 0 && regressionsAt < failuresAt && failuresAt < advisoriesAt)
  assert.match(md, /### ❌ kit\/reg · `typescript-error` · 🔴 regression/)
  assert.match(md, /\*\*Auto-patchable:\*\* yes/)
  assert.match(md, /pnpm health --only kit\/nextjs/)
  assert.match(md, /<details><summary>Draft issue/)
  assert.match(md, /\*\*Title:\*\* \[health\] kit\/warn: README references a script that does not exist/)
  assert.match(md, /Skeptical by design/)
  assert.match(md, /gh pr create --draft/)
})

test('empty report renders a no-findings line', () => {
  const md = toMarkdown(report([]))
  assert.match(md, /_No findings: every template passed._/)
  assert.match(md, /\| \(none\) \| 0 \|/)
})

test('draft issue carries evidence, repro, action and dedupe key', () => {
  const draft = draftIssue(finding({ regression: true }), report([]))
  assert.equal(draft.title, '[health] kit/nextjs: build fails with a TypeScript error')
  assert.match(draft.body, /regression against the baseline run/)
  assert.match(draft.body, /```\nerror TS2322/)
  assert.match(draft.body, /```bash\npnpm health --only kit\/nextjs/)
  assert.match(draft.body, /Dedupe key: `kit\/nextjs#typescript-error#abcdef0123`/)
})

test('pruneReports keeps the n newest json+md pairs and leaves other files alone', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sf-triage-prune-'))
  try {
    for (const stamp of ['2026-10-01T00-00-00', '2026-10-02T00-00-00', '2026-10-03T00-00-00']) {
      writeFileSync(join(dir, `${stamp}.json`), '{}')
      writeFileSync(join(dir, `${stamp}.md`), '#')
    }
    writeFileSync(join(dir, 'notes.txt'), 'keep')
    assert.equal(pruneReports(dir, 2), 2)
    const left = readdirSync(dir).sort()
    assert.deepEqual(left, [
      '2026-10-02T00-00-00.json',
      '2026-10-02T00-00-00.md',
      '2026-10-03T00-00-00.json',
      '2026-10-03T00-00-00.md',
      'notes.txt',
    ])
    assert.equal(pruneReports(dir, 0), 0)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
