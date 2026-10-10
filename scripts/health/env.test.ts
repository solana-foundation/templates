import { test } from 'node:test'
import assert from 'node:assert/strict'
import { credentialsForTemplate, parseDotenv, redactDeep, redactSecrets } from './env.js'
import { toMarkdown } from './report.js'
import type { HealthReport, TemplateReport } from './types.js'

test('parseDotenv handles comments, export, quotes and inline comments', () => {
  const env = parseDotenv(
    [
      '# a comment',
      '',
      'PLAIN=value',
      'export EXPORTED=yes',
      'SPACED = padded ',
      'INLINE=value # trailing comment',
      'DOUBLE="with # hash\\nand newline"',
      "SINGLE='keep \\n literal'",
      'EMPTY=',
      'not a pair',
      '1BAD=skipped',
    ].join('\n'),
  )
  assert.deepEqual(env, {
    PLAIN: 'value',
    EXPORTED: 'yes',
    SPACED: 'padded',
    INLINE: 'value',
    DOUBLE: 'with # hash\nand newline',
    SINGLE: 'keep \\n literal',
    EMPTY: '',
  })
})

test('forwarded credentials only reach templates that declare them', () => {
  const forwarded = { AI_GATEWAY_API_KEY: 'k1', SUPABASE_SERVICE_ROLE_KEY: 'k2' }
  // declares one key: receives that one only
  assert.deepEqual(credentialsForTemplate({ needsSecrets: true, credentialKeys: ['AI_GATEWAY_API_KEY'] }, forwarded), {
    AI_GATEWAY_API_KEY: 'k1',
  })
  // declares a key nobody forwarded: receives nothing
  assert.deepEqual(credentialsForTemplate({ needsSecrets: true, credentialKeys: ['OTHER_KEY'] }, forwarded), {})
  // prose-detected need (no key names): receives every forwarded key
  assert.deepEqual(credentialsForTemplate({ needsSecrets: true, credentialKeys: [] }, forwarded), forwarded)
  // needs no secrets: never receives any
  assert.deepEqual(credentialsForTemplate({ needsSecrets: false, credentialKeys: [] }, forwarded), {})
  assert.deepEqual(
    credentialsForTemplate({ needsSecrets: false, credentialKeys: ['AI_GATEWAY_API_KEY'] }, forwarded),
    {},
  )
})

test('redactSecrets masks every occurrence, longest value first', () => {
  assert.equal(redactSecrets('token=abc123 again abc123', ['abc123']), 'token=*** again ***')
  assert.equal(redactSecrets('abc123xyz', ['abc123', 'abc123xyz']), '***')
  assert.equal(redactSecrets('untouched', ['', 'nothing']), 'untouched')
})

test('a forwarded value never reaches the JSON or Markdown report', () => {
  const secret = 'sk-live-PLANTED-VALUE-9f8e7d'
  const template: TemplateReport = {
    id: 'community/eve-pay',
    group: 'community',
    kind: 'next',
    status: 'fail',
    needsSecrets: true,
    packageManager: 'npm',
    build: {
      status: 'fail',
      phase: 'build',
      command: `npm run build (AI_GATEWAY_API_KEY=${secret})`,
      exitCode: 1,
      timedOut: false,
      durationMs: 10,
      tail: `Error: request with key ${secret} was rejected`,
    },
    deps: { status: 'skip', available: false, total: 0, major: 0, minor: 0, patch: 0, outdated: [], note: secret },
    audit: { status: 'skip', available: false, critical: 0, high: 0, moderate: 0, low: 0, info: 0, note: secret },
    deprecation: { status: 'pass', packages: [] },
    docDrift: { status: 'pass', missingScripts: [] },
    boot: { status: 'fail', available: true, note: `dev server printed ${secret}` },
    rust: {
      status: 'skip',
      available: false,
      command: '',
      exitCode: null,
      timedOut: false,
      durationMs: 0,
      tail: '',
      tested: false,
      note: secret,
    },
  }
  const redacted = redactDeep(template, [secret])
  const report: HealthReport = {
    schemaVersion: 1,
    generatedAt: '2026-10-10T00:00:00.000Z',
    packageManager: 'npm',
    options: { build: true, boot: true, source: 'local' },
    summary: { total: 1, pass: 0, warn: 0, fail: 1, skip: 0 },
    templates: [redacted],
  }
  assert.ok(!JSON.stringify(report).includes(secret))
  assert.ok(!toMarkdown(report).includes(secret))
  assert.ok(JSON.stringify(report).includes('***'))
  // structure survives redaction
  assert.equal(redacted.build.exitCode, 1)
  assert.equal(redacted.boot?.status, 'fail')
})
