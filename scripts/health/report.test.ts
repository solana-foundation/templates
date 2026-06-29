import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diffReports } from './report.js'
import type { HealthReport } from './types.js'

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
  const d = diffReports(current, baseline)
  assert.deepEqual(d.regressions, ['kit/nextjs'])
  assert.deepEqual(d.fixed, ['kit/react-vite'])
  assert.deepEqual(d.newTemplates, ['community/new'])
  assert.deepEqual(d.removed, ['web3js/old'])
})

test('warn → fail counts as a regression; warn → warn does not', () => {
  const baseline = report([
    ['a', 'warn'],
    ['b', 'warn'],
  ])
  const current = report([
    ['a', 'fail'],
    ['b', 'warn'],
  ])
  const d = diffReports(current, baseline)
  assert.deepEqual(d.regressions, ['a'])
  assert.deepEqual(d.fixed, [])
})
