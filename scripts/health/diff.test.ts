import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diffReports } from './report.js'
import { buildFailureMentionsCredentials } from './checks.js'
import type { HealthReport, Status } from './types.js'

const report = (entries: Record<string, Status>): HealthReport =>
  ({
    templates: Object.entries(entries).map(([id, status]) => ({ id, status })),
  }) as unknown as HealthReport

test('fail to skip is NOT a fix, it becomes unverified', () => {
  const diff = diffReports(report({ a: 'skip' }), report({ a: 'fail' }))
  assert.deepEqual(diff.fixed, [])
  assert.deepEqual(diff.becameUnverified, ['a'])
})

test('pass or warn to skip surfaces as became unverified, not silence', () => {
  const diff = diffReports(report({ a: 'skip', b: 'skip' }), report({ a: 'pass', b: 'warn' }))
  assert.deepEqual(diff.becameUnverified, ['a', 'b'])
  assert.deepEqual(diff.regressions, [])
})

test('only fail to pass or warn counts as fixed', () => {
  const diff = diffReports(report({ a: 'pass', b: 'warn' }), report({ a: 'fail', b: 'fail' }))
  assert.deepEqual(diff.fixed, ['a', 'b'])
})

test('skip to fail alerts as both newly verified and a regression', () => {
  const diff = diffReports(report({ a: 'fail' }), report({ a: 'skip' }))
  assert.deepEqual(diff.newlyVerified, ['a (now fail)'])
  assert.deepEqual(diff.regressions, ['a'])
})

test('pass or warn to fail still regresses', () => {
  const diff = diffReports(report({ a: 'fail' }), report({ a: 'pass' }))
  assert.deepEqual(diff.regressions, ['a'])
})

test('credential causation requires a key name in the failure output', () => {
  const keys = ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
  assert.equal(buildFailureMentionsCredentials('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', keys), true)
  assert.equal(buildFailureMentionsCredentials('error: missing supabase_service_role_key in env', keys), true)
  assert.equal(buildFailureMentionsCredentials("Type error: Property 'cluster' is missing", keys), false)
  assert.equal(buildFailureMentionsCredentials('✖ 17 problems (9 errors, 8 warnings)', keys), false)
})

test('prose-detected templates never establish causation', () => {
  assert.equal(buildFailureMentionsCredentials('anything at all mentioning supabase', []), false)
})
