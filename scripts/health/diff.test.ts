import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diffReports, diffToMarkdown } from './report.js'
import { buildFailureMentionsCredentials, unsuppliedCredentialKeys } from './build.js'
import type { HealthReport, Status } from './types.js'

const report = (entries: Record<string, Status>, unrecognized?: Record<string, string>): HealthReport =>
  ({
    templates: Object.entries(entries).map(([id, status]) => ({ id, status })),
    ...(unrecognized
      ? { unrecognized: Object.entries(unrecognized).map(([id, reason]) => ({ id, path: `/repo/${id}`, reason })) }
      : {}),
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

test('a credential that was explicitly supplied cannot explain a failure', () => {
  const keys = ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
  const tailText = 'Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set'
  // nothing supplied: the mention establishes causation -> setup skip
  assert.equal(buildFailureMentionsCredentials(tailText, unsuppliedCredentialKeys(keys, {})), true)
  // the mentioned key was supplied via --env-file: it was not missing -> stays a failure
  const supplied = { NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon' }
  assert.deepEqual(unsuppliedCredentialKeys(keys, supplied), ['SUPABASE_SERVICE_ROLE_KEY'])
  assert.equal(buildFailureMentionsCredentials(tailText, unsuppliedCredentialKeys(keys, supplied)), false)
  // all supplied: nothing is left to blame
  assert.deepEqual(unsuppliedCredentialKeys(keys, { ...supplied, SUPABASE_SERVICE_ROLE_KEY: 'x' }), [])
})

test('prose-detected templates never establish causation', () => {
  assert.equal(buildFailureMentionsCredentials('anything at all mentioning supabase', []), false)
})

test('a template that becomes unrecognised is lost verification, not removed; and back is restored, not new', () => {
  const baseline = report({ a: 'pass', b: 'fail', gone: 'pass' }, { c: 'no package.json or Cargo.toml', d: 'x' })
  const current = report(
    { c: 'warn', fresh: 'pass' },
    { a: 'package.json is not valid JSON: boom', d: 'x', e: 'group directory missing' },
  )
  const diff = diffReports(current, baseline)
  assert.deepEqual(diff.lostVerification, ['a — package.json is not valid JSON: boom'])
  assert.deepEqual(diff.verificationRestored, ['c (now warn)'])
  assert.deepEqual(diff.newUnrecognized, ['e — group directory missing'])
  assert.deepEqual(diff.newTemplates, ['fresh'])
  // b vanished entirely (not unrecognised now) and gone too: truly removed; d unrecognised in both: silent
  assert.deepEqual(diff.removed, ['b', 'gone'])
  assert.deepEqual(diff.regressions, [])
  assert.deepEqual(diff.fixed, [])
  const md = diffToMarkdown(diff)
  assert.match(
    md,
    /Lost verification \(now unrecognized, needs attention\):\*\* a — package\.json is not valid JSON: boom/,
  )
  assert.match(md, /Verification restored:\*\* c \(now warn\)/)
  assert.match(md, /\*\*Removed:\*\* b, gone/)
  assert.match(md, /New unrecognized \(never verified\):\*\* e — group directory missing/)
})

test('an unrecognised entry in neither baseline list is a change, not silence', () => {
  const diff = diffReports(report({ a: 'pass' }, { z: 'no package.json or Cargo.toml' }), report({ a: 'pass' }))
  assert.deepEqual(diff.newUnrecognized, ['z — no package.json or Cargo.toml'])
  assert.deepEqual(diff.lostVerification, [])
  assert.deepEqual(diff.newTemplates, [])
  const md = diffToMarkdown(diff)
  assert.doesNotMatch(md, /No changes vs baseline/)
  assert.match(md, /❓ \*\*New unrecognized \(never verified\):\*\* z — no package\.json or Cargo\.toml/)
})

test('baselines written before the unrecognized field existed diff as having none', () => {
  const diff = diffReports(
    report({ a: 'pass' }, { b: 'no package.json or Cargo.toml' }),
    report({ a: 'pass', b: 'pass' }),
  )
  assert.deepEqual(diff.lostVerification, ['b — no package.json or Cargo.toml'])
  assert.deepEqual(diff.removed, [])
  assert.deepEqual(diffReports(report({ a: 'pass' }), report({ a: 'pass' })).lostVerification, [])
  assert.match(diffToMarkdown(diffReports(report({ a: 'pass' }), report({ a: 'pass' }))), /No changes vs baseline/)
})

test('an unreadable group puts its children under lost verification, not removed', () => {
  const baseline = report({ 'web3js/a': 'pass', 'web3js/b': 'warn', 'web3js/legacy/c': 'pass', 'kit/x': 'pass' })
  const current = report(
    { 'kit/x': 'pass' },
    { web3js: 'group directory not readable: EACCES', 'web3js/legacy': 'group directory missing' },
  )
  const diff = diffReports(current, baseline)
  assert.deepEqual(diff.lostVerification, [
    'web3js/a — group directory not readable: EACCES',
    'web3js/b — group directory not readable: EACCES',
    // the nearest (longest) unrecognised group wins for a nested group's child
    'web3js/legacy/c — group directory missing',
  ])
  assert.deepEqual(diff.removed, [])
  assert.deepEqual(diff.newUnrecognized, [
    'web3js — group directory not readable: EACCES',
    'web3js/legacy — group directory missing',
  ])
  // a template that really vanished, with no unrecognised group above it, is still removed
  assert.deepEqual(diffReports(report({ 'kit/x': 'pass' }), baseline).removed, [
    'web3js/a',
    'web3js/b',
    'web3js/legacy/c',
  ])
})

test('unrecognised -> skip is recognized again but not verified; a real verdict restores verification', () => {
  const baseline = report(
    { a: 'pass' },
    { b: 'package.json is not valid JSON: boom', c: 'no package.json or Cargo.toml' },
  )
  const current = {
    templates: [
      { id: 'a', status: 'pass' },
      {
        id: 'b',
        status: 'skip',
        build: { status: 'skip', tail: 'needs-setup: requires credentials (API_KEY)' },
        deps: {},
      },
      { id: 'c', status: 'warn' },
    ],
    unrecognized: [],
  } as unknown as HealthReport
  const diff = diffReports(current, baseline)
  assert.deepEqual(diff.recognizedNotVerified, ['b — needs-setup: requires credentials (API_KEY)'])
  assert.deepEqual(diff.verificationRestored, ['c (now warn)'])
  assert.deepEqual(diff.newTemplates, [])
  const md = diffToMarkdown(diff)
  assert.match(
    md,
    /❓ \*\*Recognized again but not verified \(skip\):\*\* b — needs-setup: requires credentials \(API_KEY\)/,
  )
  assert.match(md, /Verification restored:\*\* c \(now warn\)/)
  // a skip without the dimensions a reason needs (older/partial report) still diffs, id only
  const bare = diffReports(report({ b: 'skip' }), report({}, { b: 'x' }))
  assert.deepEqual(bare.recognizedNotVerified, ['b'])
  assert.doesNotMatch(diffToMarkdown(bare), /No changes vs baseline/)
})

test('a group that becomes readable again restores its children; the group entry is not removed', () => {
  const baseline = report({ 'kit/x': 'pass' }, { web3js: 'group directory not readable: EACCES' })
  const current = {
    templates: [
      { id: 'kit/x', status: 'pass' },
      { id: 'web3js/a', status: 'pass' },
      { id: 'web3js/b', status: 'skip', build: { status: 'skip', tail: 'cargo not installed' }, deps: {} },
      { id: 'web3js/legacy/c', status: 'warn' },
    ],
    unrecognized: [{ id: 'web3js/d', path: '/repo/web3js/d', reason: 'no package.json or Cargo.toml' }],
  } as unknown as HealthReport
  const diff = diffReports(current, baseline)
  assert.deepEqual(diff.verificationRestored, ['web3js/a (now pass)', 'web3js/legacy/c (now warn)'])
  assert.deepEqual(diff.recognizedNotVerified, ['web3js/b — cargo not installed'])
  assert.deepEqual(diff.newTemplates, [])
  assert.deepEqual(diff.removed, [])
  // a child never seen before (the group was unreadable) that is unrecognised now is still reported
  assert.deepEqual(diff.newUnrecognized, ['web3js/d — no package.json or Cargo.toml'])
  // the group entry only counts as removed when nothing under it exists any more
  assert.deepEqual(diffReports(report({ 'kit/x': 'pass' }), baseline).removed, ['web3js'])
})
