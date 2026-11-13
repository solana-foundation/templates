import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseAudit, parseOutdated } from './advisory.js'

const ok = (stdout: string, code = 0) => ({ code, stdout, timedOut: false })

test('npm outdated: exit 1 with a package map is data, not an error', () => {
  const stdout = JSON.stringify({
    react: { current: '18.2.0', wanted: '18.3.1', latest: '19.0.0' },
    typescript: { current: '5.4.0', wanted: '5.4.5', latest: '5.4.5' },
    'up-to-date': { current: '1.0.0', latest: '1.0.0' },
  })
  const result = parseOutdated('npm', ok(stdout, 1))
  assert.equal(result.available, true)
  assert.equal(result.status, 'warn')
  assert.equal(result.total, 2)
  assert.equal(result.major, 1)
  assert.equal(result.patch, 1)
})

test('outdated: clean exit with empty or {} output means nothing outdated', () => {
  for (const stdout of ['', '{}', '\n']) {
    const result = parseOutdated('pnpm', ok(stdout, 0))
    assert.equal(result.available, true, JSON.stringify(stdout))
    assert.equal(result.status, 'pass')
    assert.equal(result.total, 0)
  }
})

test('outdated: an npm error object is unavailable, never a clean pass', () => {
  const stdout = JSON.stringify({
    error: { code: 'E401', summary: 'Unable to authenticate', detail: 'need auth' },
  })
  const result = parseOutdated('npm', ok(stdout, 1))
  assert.equal(result.status, 'skip')
  assert.equal(result.available, false)
  assert.match(result.note ?? '', /E401: Unable to authenticate/)
})

test('outdated: empty output with a non-zero exit, a timeout, or a spawn failure is unavailable', () => {
  const empty = parseOutdated('npm', ok('', 1))
  assert.equal(empty.status, 'skip')
  assert.equal(empty.available, false)
  assert.match(empty.note ?? '', /no output/)

  const timedOut = parseOutdated('npm', { code: null, stdout: '', timedOut: true })
  assert.equal(timedOut.available, false)
  assert.match(timedOut.note ?? '', /timed out/)

  const spawnFailed = parseOutdated('pnpm', { code: -1, stdout: '', timedOut: false })
  assert.equal(spawnFailed.available, false)
  assert.match(spawnFailed.note ?? '', /could not be started/)
})

test('outdated: malformed JSON or a non-object payload is unavailable', () => {
  for (const stdout of ['npm ERR! network ECONNREFUSED', '[1,2]', 'null', '42']) {
    const result = parseOutdated('npm', ok(stdout, 1))
    assert.equal(result.status, 'skip', stdout)
    assert.equal(result.available, false, stdout)
  }
})

test('audit: severity counts come from metadata.vulnerabilities', () => {
  const stdout = JSON.stringify({
    metadata: { vulnerabilities: { critical: 0, high: 2, moderate: 1, low: 0, info: 0 } },
  })
  const result = parseAudit('npm', ok(stdout, 1))
  assert.equal(result.available, true)
  assert.equal(result.status, 'fail')
  assert.equal(result.high, 2)
  assert.equal(result.moderate, 1)

  const clean = parseAudit('pnpm', ok(JSON.stringify({ metadata: { vulnerabilities: {} } }), 0))
  assert.equal(clean.status, 'pass')
  assert.equal(clean.available, true)
})

test('audit: an error object, empty output, malformed JSON or a missing shape is unavailable', () => {
  const cases = [
    ok(JSON.stringify({ error: { code: 'ECONNREFUSED', summary: 'registry unreachable' } }), 1),
    ok('', 1),
    ok('not json at all', 1),
    ok(JSON.stringify({ advisories: {} }), 0),
    { code: null, stdout: '', timedOut: true },
  ]
  for (const exec of cases) {
    const result = parseAudit('npm', exec)
    assert.equal(result.status, 'skip', JSON.stringify(exec))
    assert.equal(result.available, false, JSON.stringify(exec))
    assert.ok(result.note, JSON.stringify(exec))
    assert.equal(result.critical + result.high + result.moderate, 0)
  }
  const refused = parseAudit('npm', cases[0])
  assert.match(refused.note ?? '', /ECONNREFUSED: registry unreachable/)
})

test('audit: npm 7+ vulnerabilities become named advisories, worst first, with direct/fix/via', () => {
  const stdout = JSON.stringify({
    vulnerabilities: {
      'tar-fs': {
        name: 'tar-fs',
        severity: 'high',
        isDirect: false,
        via: [{ source: 1, name: 'tar-fs', title: 'path traversal', url: 'https://github.com/advisories/x' }],
        effects: ['puppeteer'],
        fixAvailable: false,
      },
      next: {
        name: 'next',
        severity: 'critical',
        isDirect: true,
        via: [{ source: 2, name: 'next', title: 'rce', url: 'https://github.com/advisories/y' }],
        effects: [],
        fixAvailable: { name: 'next', version: '15.2.3', isSemVerMajor: false },
      },
      puppeteer: {
        name: 'puppeteer',
        severity: 'high',
        isDirect: true,
        via: ['tar-fs'],
        effects: [],
        fixAvailable: true,
      },
      esbuild: {
        name: 'esbuild',
        severity: 'moderate',
        isDirect: false,
        via: [{ source: 3, name: 'esbuild', title: 'dev server', url: 'https://github.com/advisories/z' }],
        effects: ['vite'],
        fixAvailable: true,
      },
    },
    metadata: { vulnerabilities: { critical: 1, high: 2, moderate: 1, low: 0, info: 0, total: 4 } },
  })
  const result = parseAudit('npm', ok(stdout, 1))
  assert.equal(result.status, 'fail')
  assert.equal(result.critical, 1)
  assert.equal(result.high, 2)
  assert.equal(result.moderate, 1)
  assert.deepEqual(result.advisories, [
    { name: 'next', severity: 'critical', direct: true, fixAvailable: true },
    { name: 'puppeteer', severity: 'high', direct: true, fixAvailable: true },
    { name: 'tar-fs', severity: 'high', direct: false, fixAvailable: false, via: 'puppeteer' },
    { name: 'esbuild', severity: 'moderate', direct: false, fixAvailable: true, via: 'vite' },
  ])
  assert.equal(result.advisoriesTruncated, undefined)
})

test('audit: npm 6 style advisories are named from module_name and findings paths (no importer prefix)', () => {
  const stdout = JSON.stringify({
    advisories: {
      '1001': {
        module_name: 'minimist',
        severity: 'critical',
        patched_versions: '>=1.2.6',
        findings: [{ version: '1.2.5', paths: ['mkdirp>minimist', 'rimraf>minimist'] }],
      },
      '1002': {
        module_name: 'lodash',
        severity: 'high',
        patched_versions: '<0.0.0',
        findings: [{ version: '4.17.20', paths: ['lodash'] }],
      },
      '1003': {
        module_name: 'lodash',
        severity: 'low',
        patched_versions: '>=4.17.21',
        findings: [{ version: '4.17.20', paths: ['lodash'] }],
      },
    },
    metadata: { vulnerabilities: { critical: 1, high: 1, moderate: 0, low: 1, info: 0 } },
  })
  const result = parseAudit('npm', ok(stdout, 1))
  assert.equal(result.status, 'fail')
  assert.equal(result.critical, 1)
  assert.equal(result.low, 1)
  assert.deepEqual(result.advisories, [
    { name: 'minimist', severity: 'critical', direct: false, fixAvailable: true, via: 'mkdirp' },
    { name: 'lodash', severity: 'high', direct: true, fixAvailable: false },
  ])
})

test('audit: npm 7+ via points at what a package consumes, so the parent comes from effects', () => {
  // app -> middle -> leaf: `middle` is vulnerable because of `leaf`; `app` is what pulls `middle` in.
  const stdout = JSON.stringify({
    vulnerabilities: {
      app: { name: 'app', severity: 'high', isDirect: true, via: ['middle'], effects: [], fixAvailable: true },
      middle: {
        name: 'middle',
        severity: 'high',
        isDirect: false,
        via: ['leaf'],
        effects: ['app'],
        fixAvailable: true,
      },
      leaf: {
        name: 'leaf',
        severity: 'high',
        isDirect: false,
        via: [{ source: 9, name: 'leaf', title: 'bad', url: 'https://github.com/advisories/leaf' }],
        effects: ['middle'],
        fixAvailable: true,
      },
      orphan: { name: 'orphan', severity: 'low', isDirect: false, via: ['leaf'], effects: [], fixAvailable: false },
    },
    metadata: { vulnerabilities: { high: 3, low: 1 } },
  })
  const result = parseAudit('npm', ok(stdout, 1))
  assert.deepEqual(result.advisories, [
    { name: 'app', severity: 'high', direct: true, fixAvailable: true },
    { name: 'leaf', severity: 'high', direct: false, fixAvailable: true, via: 'middle' },
    { name: 'middle', severity: 'high', direct: false, fixAvailable: true, via: 'app' },
    // no dependents recorded: better no parent than the reversed one from `via`
    { name: 'orphan', severity: 'low', direct: false, fixAvailable: false },
  ])
})

test('audit: pnpm paths always start with the importer, which is dropped before classifying', () => {
  const advisory = (module_name: string, severity: string, paths: string[]) => ({
    module_name,
    severity,
    patched_versions: '>=0.0.1',
    findings: [{ version: '0.0.0', paths }],
  })
  const stdout = JSON.stringify({
    advisories: {
      '1': advisory('lodash', 'high', ['.>lodash']),
      '2': advisory('minimist', 'critical', ['.>mkdirp>minimist', '.>rimraf>minimist']),
      // pnpm 10 workspace importers: slashes become `__`, a top-level package is its bare name
      '3': advisory('semver', 'moderate', ['packages__app>semver']),
      '4': advisory('ws', 'moderate', ['app>ws']),
      '5': advisory('qs', 'low', ['app>mkdirp>qs', 'packages__api > express > qs']),
    },
    metadata: { vulnerabilities: { critical: 1, high: 1, moderate: 2, low: 1 } },
  })
  const result = parseAudit('pnpm', ok(stdout, 1))
  assert.deepEqual(result.advisories, [
    { name: 'minimist', severity: 'critical', direct: false, fixAvailable: true, via: 'mkdirp' },
    { name: 'lodash', severity: 'high', direct: true, fixAvailable: true },
    { name: 'semver', severity: 'moderate', direct: true, fixAvailable: true },
    { name: 'ws', severity: 'moderate', direct: true, fixAvailable: true },
    { name: 'qs', severity: 'low', direct: false, fixAvailable: true, via: 'mkdirp' },
  ])
})

test('audit: npm 6 style paths carry no importer prefix', () => {
  const stdout = JSON.stringify({
    advisories: {
      '1': { module_name: 'lodash', severity: 'high', patched_versions: '>=1', findings: [{ paths: ['lodash'] }] },
      '2': {
        module_name: 'minimist',
        severity: 'high',
        patched_versions: '>=1',
        findings: [{ paths: ['mkdirp>minimist'] }],
      },
    },
    metadata: { vulnerabilities: { high: 2 } },
  })
  const result = parseAudit('npm', ok(stdout, 1))
  assert.deepEqual(result.advisories, [
    { name: 'lodash', severity: 'high', direct: true, fixAvailable: true },
    { name: 'minimist', severity: 'high', direct: false, fixAvailable: true, via: 'mkdirp' },
  ])
})

test('audit: the advisory list is capped at 25 and flagged as truncated', () => {
  const vulnerabilities: Record<string, unknown> = {}
  for (let index = 0; index < 30; index += 1) {
    vulnerabilities[`pkg-${String(index).padStart(2, '0')}`] = {
      severity: index < 5 ? 'critical' : 'low',
      isDirect: index % 2 === 0,
      via: [],
      fixAvailable: true,
    }
  }
  const stdout = JSON.stringify({ vulnerabilities, metadata: { vulnerabilities: { critical: 5, low: 25 } } })
  const result = parseAudit('npm', ok(stdout, 1))
  const advisories = result.advisories ?? []
  assert.equal(advisories.length, 25)
  assert.equal(result.advisoriesTruncated, true)
  assert.equal(advisories[0]?.name, 'pkg-00')
  assert.equal(advisories[0]?.severity, 'critical')
  assert.equal(result.critical, 5)
  assert.equal(result.low, 25)
})

test('audit: a missing or malformed advisory list keeps the counts and yields no names', () => {
  const cases = [
    { metadata: { vulnerabilities: { high: 2 } } },
    { vulnerabilities: 'nope', metadata: { vulnerabilities: { high: 2 } } },
    { vulnerabilities: [1, 2], metadata: { vulnerabilities: { high: 2 } } },
    {
      vulnerabilities: { bad: null, worse: { severity: 'enormous' }, odd: 7 },
      metadata: { vulnerabilities: { high: 2 } },
    },
    {
      advisories: { '1': { severity: 'high' }, '2': 'x', '3': { module_name: 'a', severity: 'high', findings: 'no' } },
      metadata: { vulnerabilities: { high: 2 } },
    },
  ]
  for (const payload of cases) {
    const result = parseAudit('npm', ok(JSON.stringify(payload), 1))
    assert.equal(result.available, true, JSON.stringify(payload))
    assert.equal(result.high, 2, JSON.stringify(payload))
    assert.equal(result.status, 'fail', JSON.stringify(payload))
    const advisories = result.advisories ?? []
    assert.ok(advisories.length <= 1, JSON.stringify(payload))
    for (const advisory of advisories) assert.equal(advisory.severity, 'high')
  }
  const skipped = parseAudit('npm', ok('', 1))
  assert.deepEqual(skipped.advisories, [])
})
