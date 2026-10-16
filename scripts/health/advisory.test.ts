import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseAudit, parseOutdated } from './checks.js'

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
