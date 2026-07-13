import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extractDeprecations } from './checks.js'

const installOutput = `
npm warn deprecated @solana-program/token-2022@0.7.0: This package has been deprecated
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
 WARN  deprecated inflight@1.0.6: This module is not supported, and leaks memory
 WARN  deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
`

test('captures scoped and unscoped specs, but only for direct deps', () => {
  const got = extractDeprecations(installOutput, ['@solana-program/token-2022', 'rimraf'])
  assert.deepEqual([...got].sort(), ['@solana-program/token-2022@0.7.0', 'rimraf@3.0.2'])
})

test('drops transitive deprecations (not in direct deps) to keep the signal actionable', () => {
  assert.deepEqual(extractDeprecations(installOutput, []), [])
  // inflight/glob are present in the output but not direct deps here:
  assert.deepEqual(extractDeprecations(installOutput, ['rimraf']), ['rimraf@3.0.2'])
})

test('dedupes repeated warnings', () => {
  const dupes = 'deprecated foo@1.0.0: x\ndeprecated foo@1.0.0: x'
  assert.deepEqual(extractDeprecations(dupes, ['foo']), ['foo@1.0.0'])
})
