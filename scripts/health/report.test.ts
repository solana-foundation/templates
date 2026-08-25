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
