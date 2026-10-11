import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diffReports, reproCommand, skipReason, toMarkdown, unavailableChecks } from './report.js'
import type { HealthReport, TemplateReport } from './types.js'

// diffReports only reads id + status, so minimal stand-ins are enough.
const report = (entries: Array<[string, string]>): HealthReport =>
  ({ templates: entries.map(([id, status]) => ({ id, status })) }) as unknown as HealthReport

test('diff surfaces regressions, fixes, new and removed templates', () => {
  const baseline = report([
    ['kit/nextjs', 'pass'],
    ['kit/react-vite', 'fail'],
    ['web3js/old', 'pass'],
  ])
  const current = report([
    ['kit/nextjs', 'fail'], // regressed
    ['kit/react-vite', 'pass'], // fixed
    ['community/new', 'warn'], // new
    // web3js/old removed
  ])
  const diff = diffReports(current, baseline)
  assert.deepEqual(diff.regressions, ['kit/nextjs'])
  assert.deepEqual(diff.fixed, ['kit/react-vite'])
  assert.deepEqual(diff.newTemplates, ['community/new'])
  assert.deepEqual(diff.removed, ['web3js/old'])
})

test('warn → fail counts as a regression; warn → warn does not', () => {
  const baseline = report([
    ['kit/alpha', 'warn'],
    ['kit/beta', 'warn'],
  ])
  const current = report([
    ['kit/alpha', 'fail'],
    ['kit/beta', 'warn'],
  ])
  const diff = diffReports(current, baseline)
  assert.deepEqual(diff.regressions, ['kit/alpha'])
  assert.deepEqual(diff.fixed, [])
})

test('repro command carries the flags that shaped the run', () => {
  assert.equal(
    reproCommand('kit/nextjs', { build: true, boot: false, source: 'local' }),
    'pnpm health --only kit/nextjs',
  )
  assert.equal(
    reproCommand('kit/nextjs', { build: true, boot: true, source: 'local', cargoTest: false, pm: null }),
    'pnpm health --only kit/nextjs --boot',
  )
  assert.equal(
    reproCommand('community/pinocchio', { build: true, boot: false, source: 'local', cargoTest: true, pm: 'pnpm' }),
    'pnpm health --only community/pinocchio --cargo-test --pm pnpm',
  )
  assert.equal(
    reproCommand('kit/react-vite', { build: false, boot: false, source: 'local' }),
    'pnpm health --only kit/react-vite --no-build',
  )
})

test('markdown failure blocks use the run options for the repro command', () => {
  const template = {
    id: 'kit/nextjs',
    group: 'kit',
    kind: 'next',
    status: 'fail',
    needsSecrets: false,
    packageManager: 'pnpm',
    build: {
      status: 'pass',
      phase: 'ci',
      command: 'pnpm run ci',
      exitCode: 0,
      timedOut: false,
      durationMs: 1,
      tail: '',
    },
    deps: { status: 'pass', available: true, total: 0, major: 0, minor: 0, patch: 0, outdated: [] },
    audit: { status: 'pass', available: true, critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
    deprecation: { status: 'pass', packages: [] },
    docDrift: { status: 'pass', missingScripts: [] },
    boot: { status: 'fail', available: true, note: 'dev server exited before responding' },
  } as unknown as TemplateReport
  const md = toMarkdown({
    schemaVersion: 1,
    generatedAt: '2026-10-10T00:00:00.000Z',
    packageManager: 'pnpm',
    options: { build: true, boot: true, source: 'local', cargoTest: false, pm: 'pnpm' },
    summary: { total: 1, pass: 0, warn: 0, fail: 1, skip: 0 },
    templates: [template],
  })
  assert.match(md, /\*\*Failed:\*\* boot/)
  assert.match(md, /`pnpm health --only kit\/nextjs --boot --pm pnpm`/)
})

test('skipped templates show why: the rust note surfaces when cargo is missing', () => {
  const template = {
    id: 'community/pinocchio',
    group: 'community',
    kind: 'rust',
    status: 'skip',
    needsSecrets: false,
    packageManager: 'npm',
    build: {
      status: 'skip',
      phase: 'none',
      command: '(no ci or build script)',
      exitCode: 0,
      timedOut: false,
      durationMs: 0,
      tail: 'No npm build/ci script — Rust template, see cargo result.',
    },
    deps: { status: 'pass', available: true, total: 0, major: 0, minor: 0, patch: 0, outdated: [] },
    audit: { status: 'pass', available: true, critical: 0, high: 0, moderate: 0, low: 0, info: 0 },
    deprecation: { status: 'pass', packages: [] },
    docDrift: { status: 'pass', missingScripts: [] },
    rust: {
      status: 'skip',
      available: false,
      command: '',
      exitCode: null,
      timedOut: false,
      durationMs: 0,
      tail: '',
      tested: false,
      note: 'cargo not installed',
    },
  } as unknown as TemplateReport
  assert.equal(
    skipReason(template),
    'No npm build/ci script — Rust template, see cargo result. · rust: cargo not installed',
  )
  const md = toMarkdown({
    schemaVersion: 1,
    generatedAt: '2026-10-10T00:00:00.000Z',
    packageManager: 'npm',
    options: { build: true, boot: false, source: 'local' },
    summary: { total: 1, pass: 0, warn: 0, fail: 0, skip: 1 },
    templates: [template],
  })
  assert.match(md, /## ⏭️ Skipped/)
  assert.match(md, /community\/pinocchio.*rust: cargo not installed/)
})

test('advisory checks that could not run stay visible in every section', () => {
  const base = {
    group: 'kit',
    kind: 'vite',
    needsSecrets: false,
    packageManager: 'npm',
    build: {
      status: 'pass',
      phase: 'ci',
      command: 'npm run ci',
      exitCode: 0,
      timedOut: false,
      durationMs: 1,
      tail: '',
    },
    deps: {
      status: 'skip',
      available: false,
      total: 0,
      major: 0,
      minor: 0,
      patch: 0,
      outdated: [],
      note: 'npm outdated: ECONNREFUSED registry.npmjs.org',
    },
    audit: {
      status: 'skip',
      available: false,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0,
      note: 'npm audit timed out after 120s',
    },
    deprecation: { status: 'pass', packages: [] },
    docDrift: { status: 'pass', missingScripts: [] },
  }
  const passing = { ...base, id: 'kit/react-vite', status: 'pass' } as unknown as TemplateReport
  const warning = {
    ...base,
    id: 'kit/react-vite-anchor',
    status: 'warn',
    deprecation: { status: 'warn', packages: ['eslint'] },
  } as unknown as TemplateReport
  const failing = {
    ...base,
    id: 'kit/nextjs',
    status: 'fail',
    build: { ...base.build, status: 'fail', exitCode: 1, tail: 'boom' },
  } as unknown as TemplateReport
  assert.deepEqual(unavailableChecks(passing), [
    'deps: npm outdated: ECONNREFUSED registry.npmjs.org',
    'vuln: npm audit timed out after 120s',
  ])
  const md = toMarkdown({
    schemaVersion: 1,
    generatedAt: '2026-10-10T00:00:00.000Z',
    packageManager: 'npm',
    options: { build: true, boot: false, source: 'local' },
    summary: { total: 3, pass: 1, warn: 1, fail: 1, skip: 0 },
    templates: [failing, warning, passing],
  })
  // status line marks both checks as unavailable instead of dropping them
  assert.match(md, /\*\*kit\/react-vite\*\* — build ✅ · deps ⏭️\(unavailable\) · vuln ⏭️\(unavailable\)/)
  // and each section carries the reason
  const sections = md.split('\n## ')
  for (const heading of ['❌ Failures', '⚠️ Warnings', '✅ Passing']) {
    const section = sections.find((part) => part.startsWith(heading))
    assert.ok(section, `section ${heading} present`)
    assert.match(
      section,
      /incomplete: deps: npm outdated: ECONNREFUSED registry\.npmjs\.org · vuln: npm audit timed out after 120s/,
    )
  }
})
