import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { HealthReport, QaResult } from '../health/types.js'
import { AUTO_PATCHABLE, classifyReport, classifyTemplate, reproOptionsOf, RULES } from './classify.js'
import { regressionIds } from './load.js'
import type { Finding, FindingClass, TriagedTemplateReport } from './types.js'
import { FINDING_CLASSES } from './types.js'
import { draftIssue } from './report.js'

const here = dirname(fileURLToPath(import.meta.url))
const load = (name: string): HealthReport =>
  JSON.parse(readFileSync(join(here, 'fixtures', name), 'utf-8')) as HealthReport

const sample = load('health-report.sample.json')
const baseline = load('health-report.baseline.json')
const templates = sample.templates as readonly TriagedTemplateReport[]
const byId = (id: string): TriagedTemplateReport => {
  const found = templates.find((template) => template.id === id)
  assert.ok(found, `fixture has ${id}`)
  return found
}
const primaryOf = (id: string) => classifyTemplate(byId(id), false)[0]

const qaResult = (overrides: Partial<QaResult>): QaResult => ({
  status: 'fail',
  available: true,
  pageErrors: [],
  consoleErrors: [],
  failedRequests: [],
  blank: false,
  durationMs: 10,
  note: '1 uncaught page error(s)',
  ...overrides,
})

test('real QA errors reach draft issues and distinguish crashes with identical count notes', () => {
  for (const field of ['pageErrors', 'consoleErrors', 'overlayText'] as const) {
    const classifyCrash = (message: string) =>
      classifyTemplate(
        {
          ...byId('kit/qa-demo'),
          qa: qaResult({ [field]: field === 'overlayText' ? message : [message] }),
        },
        false,
      )[0]
    const first = classifyCrash('TypeError: wallet.connect is not a function')
    const second = classifyCrash('ReferenceError: provider is not defined')
    assert.equal(first.class, 'qa-render-failure')
    assert.equal(first.evidence[0], 'TypeError: wallet.connect is not a function')
    assert.notEqual(first.dedupeKey, second.dedupeKey, field)
    assert.equal(first.dedupeKey, classifyCrash('TypeError: wallet.connect is not a function').dedupeKey)
    const draft = draftIssue(first, {
      source: {
        report: 'health.json',
        reportGeneratedAt: sample.generatedAt,
        baseline: null,
      },
    })
    assert.match(draft.body, /TypeError: wallet\.connect is not a function/)
  }
})

test('QA classification uses recorded error messages and keeps the first crash in a bounded sample', () => {
  const template = byId('kit/qa-demo')
  const missingModule = classifyTemplate(
    { ...template, qa: qaResult({ overlayText: "Module not found: Can't resolve 'wallet-adapter'" }) },
    false,
  )[0]
  assert.equal(missingModule.class, 'missing-module')
  const crash = classifyTemplate(
    {
      ...template,
      qa: qaResult({
        pageErrors: ['TypeError: first crash\n  at App (app.tsx:10:2)', ...Array(10).fill('Error: later crash')],
      }),
    },
    false,
  )[0]
  assert.equal(crash.evidence.length, 5)
  assert.match(crash.evidence[0], /^TypeError: first crash/)
})

test('QA configuration skips preserve their cause and repro even for public app IDs', () => {
  for (const needsSecrets of [false, true]) {
    const note = 'requires configuration: VITE_PHANTOM_APP_ID (page error: appId is required)'
    const result = classifyTemplate(
      {
        ...byId('kit/pass-demo'),
        status: 'skip',
        needsSecrets,
        qa: qaResult({ status: 'skip', note }),
      },
      false,
    )[0]
    assert.equal(result.class, 'needs-credentials')
    assert.equal(result.severity, 'warn')
    assert.deepEqual(result.evidence, [note])
    assert.match(result.reproduce, /--boot --qa$/)
  }
})

test('build setup skips use the recorded cause; unrelated skips do not imply missing credentials', () => {
  const template = byId('kit/pass-demo')
  const tail = 'SKIPPED — needs setup/credentials (env required). Build without setup:\nSUPABASE_URL is not set'
  const result = classifyTemplate(
    { ...template, status: 'skip', needsSecrets: true, build: { ...template.build, status: 'skip', tail } },
    false,
  )[0]
  assert.equal(result.class, 'needs-credentials')
  assert.ok(result.evidence.includes('SUPABASE_URL is not set'))
  assert.deepEqual(
    classifyTemplate(
      {
        ...template,
        status: 'skip',
        needsSecrets: true,
        qa: qaResult({ status: 'skip', available: false, note: 'browser launch failed' }),
      },
      false,
    ),
    [],
  )
})

const EXPECTED: Record<string, FindingClass> = {
  'kit/lockfile-demo': 'lockfile-out-of-date',
  'kit/peer-demo': 'peer-dependency-conflict',
  'kit/missing-module-demo': 'missing-module',
  'kit/ts-demo': 'typescript-error',
  'kit/framework-demo': 'framework-breaking-change',
  'kit/network-demo': 'registry-or-network',
  'kit/infra-demo': 'temp-dir-or-process',
  'community/creds-demo': 'needs-credentials',
  'community/creds-skip': 'needs-credentials',
  'kit/rust-demo': 'rust-compile',
  'kit/boot-demo': 'boot-failure',
  'kit/qa-demo': 'qa-render-failure',
  'kit/outdated-demo': 'outdated-major',
  'kit/vuln-demo': 'vulnerable-deps',
  'kit/deprecated-demo': 'deprecated-direct-dep',
  'kit/docs-demo': 'doc-drift',
  'kit/unknown-demo': 'unknown-failure',
}

test('every class is produced by the fixture, and each template gets the expected primary class', () => {
  const seen = new Set<FindingClass>()
  for (const [id, expected] of Object.entries(EXPECTED)) {
    const primary = primaryOf(id)
    assert.ok(primary, `${id} has a finding`)
    assert.equal(primary.class, expected, `${id} -> ${expected} (got ${primary.class}: ${primary.evidence[0]})`)
    seen.add(primary.class)
  }
  for (const cls of FINDING_CLASSES) assert.ok(seen.has(cls), `fixture covers ${cls}`)
})

test('a passing template yields no findings', () => {
  assert.deepEqual(classifyTemplate(byId('kit/pass-demo'), false), [])
})

test('functional failures are fail severity; advisories and credential skips are warn', () => {
  assert.equal(primaryOf('kit/ts-demo').severity, 'fail')
  assert.equal(primaryOf('community/creds-demo').severity, 'fail')
  assert.equal(primaryOf('community/creds-skip').severity, 'warn')
  assert.equal(primaryOf('kit/outdated-demo').severity, 'warn')
  assert.equal(primaryOf('kit/vuln-demo').severity, 'warn')
})

test('evidence holds the matched lines, capped at five, and the repro names the failing command', () => {
  const finding = primaryOf('kit/peer-demo')
  assert.ok(finding.evidence.length >= 1 && finding.evidence.length <= 5)
  assert.ok(finding.evidence.every((line) => /ERESOLVE|peer/i.test(line)))
  assert.match(finding.reproduce, /^pnpm health --only kit\/peer-demo\n/)
  assert.match(finding.reproduce, /cd kit\/peer-demo && npm install$/)
  const rust = primaryOf('kit/rust-demo')
  assert.equal(rust.reproduce, 'pnpm health --only kit/rust-demo\ncd kit/rust-demo/program && cargo check')
})

test('repro flags follow the failing phase: --boot for boot, --boot --qa for qa, --cargo-test for rust test runs', () => {
  assert.match(
    primaryOf('kit/boot-demo').reproduce,
    /^pnpm health --only kit\/boot-demo --boot\ncd kit\/boot-demo && npm run dev$/,
  )
  // a qa failure carries the pair on purpose: a health CLI without --qa still runs the boot check
  assert.equal(primaryOf('kit/qa-demo').reproduce, 'pnpm health --only kit/qa-demo --boot --qa')
  const rustBase = byId('kit/rust-demo')
  const tested: TriagedTemplateReport = {
    ...rustBase,
    rust: { ...rustBase.rust!, tested: true, command: 'cargo check && cargo-build-sbf && cargo test' },
  }
  assert.equal(
    classifyTemplate(tested, false)[0].reproduce,
    'pnpm health --only kit/rust-demo --cargo-test\ncd kit/rust-demo/program && cargo test',
  )
  // a rust label is never pasted as a shell command when the manifest dir is unknown
  const { manifestDir: _ignored, ...withoutDir } = rustBase.rust as typeof rustBase.rust & { manifestDir?: string }
  assert.equal(
    classifyTemplate({ ...rustBase, rust: withoutDir }, false)[0].reproduce,
    'pnpm health --only kit/rust-demo',
  )
})

test('report options override the class-derived flags and add --pm', () => {
  const options = { boot: true, cargoTest: true, pm: 'pnpm' }
  assert.equal(
    classifyTemplate(byId('kit/ts-demo'), false, options)[0].reproduce,
    'pnpm health --only kit/ts-demo --boot --cargo-test --pm pnpm\ncd kit/ts-demo && npm run ci',
  )
  assert.equal(
    classifyTemplate(byId('kit/boot-demo'), false, { boot: false })[0].reproduce,
    'pnpm health --only kit/boot-demo\ncd kit/boot-demo && npm run dev',
  )
  assert.deepEqual(reproOptionsOf(sample), { boot: true, qa: undefined, cargoTest: undefined, pm: undefined })
})

test('a report produced with --qa yields repros carrying --boot --qa, exactly once each', () => {
  const qaRun = { options: { build: true, boot: true, qa: true, source: 'local' } }
  const options = reproOptionsOf(qaRun)
  assert.equal(options.qa, true)
  assert.equal(
    classifyTemplate(byId('kit/ts-demo'), false, options)[0].reproduce,
    'pnpm health --only kit/ts-demo --boot --qa\ncd kit/ts-demo && npm run ci',
  )
  const qaFinding = classifyTemplate(byId('kit/qa-demo'), false, options)[0]
  assert.equal(qaFinding.class, 'qa-render-failure')
  assert.equal(qaFinding.reproduce, 'pnpm health --only kit/qa-demo --boot --qa')
  // qa implies boot even when the report did not record boot (or recorded it false)
  assert.equal(
    classifyTemplate(byId('kit/ts-demo'), false, { qa: true, boot: false })[0].reproduce,
    'pnpm health --only kit/ts-demo --boot --qa\ncd kit/ts-demo && npm run ci',
  )
  // an explicit qa: false in the report options falls back to the class-derived --boot
  assert.equal(
    classifyTemplate(byId('kit/boot-demo'), false, { qa: false })[0].reproduce,
    'pnpm health --only kit/boot-demo --boot\ncd kit/boot-demo && npm run dev',
  )
})

test('a structured timeout is infra (retry), never rust-compile or unknown, in both text formats', () => {
  const rustBase = byId('kit/rust-demo')
  const rustTimeout: TriagedTemplateReport = {
    ...rustBase,
    rust: { ...rustBase.rust!, timedOut: true, tail: 'TIMED OUT\n   Compiling solana-program v2.1.0' },
  }
  const rustFinding = classifyTemplate(rustTimeout, false)[0]
  assert.equal(rustFinding.class, 'temp-dir-or-process')
  assert.deepEqual(rustFinding.evidence, ['TIMED OUT'])
  const buildBase = byId('kit/unknown-demo')
  const buildTimeout: TriagedTemplateReport = {
    ...buildBase,
    build: { ...buildBase.build, timedOut: true, tail: 'TIMED OUT after 720s\n> next build' },
  }
  assert.equal(classifyTemplate(buildTimeout, false)[0].class, 'temp-dir-or-process')
  // flag set but no marker line in the tail: still infra, with a synthetic evidence line
  const bare: TriagedTemplateReport = {
    ...buildBase,
    build: { ...buildBase.build, timedOut: true, tail: '> next build' },
  }
  const bareFinding = classifyTemplate(bare, false)[0]
  assert.equal(bareFinding.class, 'temp-dir-or-process')
  assert.equal(bareFinding.evidence[0], 'timed out (build)')
})

test('infra and credential rules beat generic ones even when a TS or module line is also present', () => {
  const template: TriagedTemplateReport = {
    ...byId('kit/ts-demo'),
    id: 'kit/mixed',
    build: {
      ...byId('kit/ts-demo').build,
      tail: "error TS2307: Cannot find module 'x'\nError: ENOTEMPTY: directory not empty, rmdir '/tmp/foo'",
    },
  }
  assert.equal(classifyTemplate(template, false)[0].class, 'temp-dir-or-process')
})

test('rules are ordered most specific first and name a different class each', () => {
  const classes = RULES.map((rule) => rule.class)
  assert.equal(new Set(classes).size, classes.length)
  assert.ok(classes.indexOf('needs-credentials') < classes.indexOf('missing-module'))
  assert.ok(classes.indexOf('missing-module') < classes.indexOf('typescript-error'))
  assert.ok(classes.indexOf('registry-or-network') < classes.indexOf('lockfile-out-of-date'))
})

test('auto-patchable needs a recipe AND its precondition: lockfile recipes only with a tracked lockfile', () => {
  const flagged = (findings: readonly Finding[]) =>
    [...new Set(findings.filter((finding) => finding.autoPatchable).map((finding) => finding.class))].sort()
  const ofClass = (findings: readonly Finding[], cls: FindingClass) => {
    const found = findings.find((finding) => finding.class === cls)
    assert.ok(found, `has ${cls}`)
    return found
  }

  // default (no tracked set): only doc-drift keeps the flag, the two lockfile recipes say why not
  const untracked = classifyReport(templates, new Set())
  assert.deepEqual(flagged(untracked), ['doc-drift'])
  assert.ok(
    untracked.filter((finding) => !AUTO_PATCHABLE.has(finding.class)).every((finding) => !finding.autoPatchable),
  )
  const vuln = ofClass(untracked, 'vulnerable-deps')
  assert.match(vuln.recommendedAction, / \(no tracked lockfile: bump the ranges in package\.json by hand\)$/)
  assert.match(
    ofClass(untracked, 'lockfile-out-of-date').recommendedAction,
    / \(no tracked lockfile: regenerate it by hand\)$/,
  )

  // with the template's lockfile tracked, both recipes are advertised and the action is untouched
  const tracked = classifyReport(templates, new Set(), {
    trackedLockfiles: new Set(['kit/lockfile-demo', 'kit/vuln-demo']),
  })
  assert.deepEqual(flagged(tracked), ['doc-drift', 'lockfile-out-of-date', 'vulnerable-deps'])
  assert.doesNotMatch(ofClass(tracked, 'vulnerable-deps').recommendedAction, /by hand/)
  // the appended reason never changes the dedupe key
  assert.equal(vuln.dedupeKey, ofClass(tracked, 'vulnerable-deps').dedupeKey)

  // pnpm has no audit fix, so a tracked pnpm-lock.yaml still leaves vulnerable-deps manual
  const pnpmVuln = ofClass(
    classifyTemplate({ ...byId('kit/vuln-demo'), packageManager: 'pnpm' }, false, {
      trackedLockfiles: new Set(['kit/vuln-demo']),
    }),
    'vulnerable-deps',
  )
  assert.equal(pnpmVuln.autoPatchable, false)
  assert.match(pnpmVuln.recommendedAction, /\(pnpm has no audit fix: bump the ranges in package\.json by hand\)$/)
})

test('regressions come from the baseline diff and sort first', () => {
  const regressions = regressionIds(sample, baseline)
  assert.deepEqual([...regressions].sort(), ['kit/boot-demo', 'kit/ts-demo'])
  const findings = classifyReport(templates, regressions)
  assert.ok(findings[0].regression && findings[1].regression)
  assert.deepEqual(
    findings
      .slice(0, 2)
      .map((finding) => finding.templateId)
      .sort(),
    ['kit/boot-demo', 'kit/ts-demo'],
  )
  assert.ok(findings.slice(2).every((finding) => !finding.regression))
  // then every fail, then every warn
  const rest = findings.slice(2).map((finding) => finding.severity)
  const firstWarn = rest.indexOf('warn')
  assert.ok(rest.slice(firstWarn).every((severity) => severity === 'warn'))
})

test('no baseline means no regressions', () => {
  assert.equal(regressionIds(sample, null).size, 0)
})

test('dedupe keys are stable across runs and ignore temp paths and timings', () => {
  const first = primaryOf('kit/infra-demo')
  const again = classifyTemplate(
    {
      ...byId('kit/infra-demo'),
      build: {
        ...byId('kit/infra-demo').build,
        durationMs: 999,
        tail: byId('kit/infra-demo').build.tail.replace('x1/sf-templates-health-4242', 'zz/sf-templates-health-9999'),
      },
    },
    false,
  )[0]
  assert.equal(first.dedupeKey, again.dedupeKey)
  assert.match(first.dedupeKey, /^kit\/infra-demo#temp-dir-or-process#[0-9a-f]{10}$/)
  assert.notEqual(first.dedupeKey, primaryOf('kit/network-demo').dedupeKey)
})

test('a template with a functional failure plus advisories gets one primary and the advisories', () => {
  const template: TriagedTemplateReport = {
    ...byId('kit/ts-demo'),
    deps: byId('kit/outdated-demo').deps,
    docDrift: byId('kit/docs-demo').docDrift,
  }
  const findings = classifyTemplate(template, false)
  assert.deepEqual(
    findings.map((finding) => finding.class),
    ['typescript-error', 'outdated-major', 'doc-drift'],
  )
  assert.equal(findings.filter((finding) => finding.severity === 'fail').length, 1)
})
