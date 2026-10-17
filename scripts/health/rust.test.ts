import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rustPhase } from './checks.js'
import type { RustResult } from './types.js'

const initial: RustResult = {
  status: 'skip',
  available: false,
  command: '',
  exitCode: null,
  timedOut: false,
  durationMs: 0,
  tail: '',
  tested: false,
}

test('a passing compile phase is reported as pass with its own command and tail', () => {
  const result = rustPhase(
    initial,
    'cargo check (program)',
    { code: 0, output: 'Finished', timedOut: false, durationMs: 1200 },
    false,
  )
  assert.equal(result.status, 'pass')
  assert.equal(result.available, true)
  assert.equal(result.command, 'cargo check (program)')
  assert.equal(result.exitCode, 0)
  assert.equal(result.timedOut, false)
  assert.equal(result.durationMs, 1200)
  assert.equal(result.tail, 'Finished')
  assert.equal(result.tested, false)
})

test('a failing test phase does not inherit the compile phase exit code or timeout flag', () => {
  const compiled = rustPhase(
    initial,
    'cargo build',
    { code: 0, output: 'ok', timedOut: false, durationMs: 1000 },
    false,
  )
  const tested = rustPhase(
    compiled,
    'cargo build && cargo test',
    { code: 101, output: 'test result: FAILED. 1 failed', timedOut: false, durationMs: 500 },
    true,
  )
  assert.equal(tested.status, 'fail')
  assert.equal(tested.exitCode, 101)
  assert.equal(tested.timedOut, false)
  assert.equal(tested.command, 'cargo build && cargo test')
  assert.match(tested.tail, /FAILED/)
  assert.equal(tested.tested, true)
  // total elapsed across both phases
  assert.equal(tested.durationMs, 1500)
})

test('a timed-out test phase reports timedOut and a null exit code', () => {
  const compiled = rustPhase(
    initial,
    'cargo check (program)',
    { code: 0, output: 'ok', timedOut: false, durationMs: 1000 },
    false,
  )
  const tested = rustPhase(
    compiled,
    'cargo check && cargo-build-sbf && cargo test',
    { code: null, output: 'running 3 tests', timedOut: true, durationMs: 720_000 },
    true,
  )
  assert.equal(tested.status, 'fail')
  assert.equal(tested.timedOut, true)
  assert.equal(tested.exitCode, null)
  assert.match(tested.tail, /^TIMED OUT after 720s/)
  assert.equal(tested.durationMs, 721_000)
})

test('a later phase clears a note left by an earlier one', () => {
  const noted: RustResult = { ...initial, status: 'pass', note: 'tests skipped' }
  const result = rustPhase(noted, 'cargo test', { code: 0, output: '', timedOut: false, durationMs: 1 }, true)
  assert.equal(result.note, undefined)
})
