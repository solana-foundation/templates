import { test } from 'node:test'
import assert from 'node:assert/strict'
import { overallStatus, worst } from './status.js'

test('a functional failure makes the template fail', () => {
  assert.equal(overallStatus(['fail'], ['pass']), 'fail')
  assert.equal(overallStatus(['pass', 'fail'], ['pass']), 'fail')
})

test('advisory failures cap at warn — they never fail a working template', () => {
  // e.g. npm audit reports high vulns but the template builds fine.
  assert.equal(overallStatus(['pass'], ['fail']), 'warn')
  assert.equal(overallStatus(['pass'], ['warn']), 'warn')
})

test('all green is pass', () => {
  assert.equal(overallStatus(['pass'], ['pass', 'pass']), 'pass')
})

test('functional pass with only skipped advisories is still pass', () => {
  assert.equal(overallStatus(['pass'], ['skip', 'skip']), 'pass')
})

test('everything skipped is skip', () => {
  assert.equal(overallStatus(['skip'], ['skip', 'skip']), 'skip')
})

test('all functional skipped is skip even with advisory pass', () => {
  // e.g. a Rust-only template on a machine without cargo: deps/audit passing proves nothing.
  assert.equal(overallStatus(['skip'], ['pass', 'pass']), 'skip')
  assert.equal(overallStatus(['skip', 'skip'], ['pass', 'warn']), 'skip')
})

test('one verified functional check alongside skipped ones still counts', () => {
  assert.equal(overallStatus(['pass', 'skip'], ['pass']), 'pass')
  assert.equal(overallStatus(['pass', 'skip'], ['warn']), 'warn')
})

test('worst picks the highest severity present', () => {
  assert.equal(worst(['skip', 'pass', 'warn']), 'warn')
  assert.equal(worst(['skip', 'pass']), 'pass')
  assert.equal(worst(['skip']), 'skip')
  assert.equal(worst(['warn', 'fail', 'pass']), 'fail')
})
