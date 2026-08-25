import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bumpKind, parseVersion } from './semver.js'

test('parseVersion strips range prefixes and pre-release suffixes', () => {
  assert.deepEqual(parseVersion('^1.2.3'), [1, 2, 3])
  assert.deepEqual(parseVersion('>=2.0.0'), [2, 0, 0])
  assert.deepEqual(parseVersion('~0.5.9'), [0, 5, 9])
  assert.deepEqual(parseVersion('1.2.3-rc.1'), [1, 2, 3])
})

test('parseVersion returns null for non-semver', () => {
  assert.equal(parseVersion('latest'), null)
  assert.equal(parseVersion('workspace:*'), null)
})

test('bumpKind classifies the gap', () => {
  assert.equal(bumpKind('1.0.0', '2.0.0'), 'major')
  assert.equal(bumpKind('16.2.6', '16.3.0'), 'minor')
  assert.equal(bumpKind('1.1.1', '1.1.2'), 'patch')
  assert.equal(bumpKind('5.9.3', '6.0.3'), 'major')
})

test('bumpKind is unknown when either version is unparseable', () => {
  assert.equal(bumpKind('latest', '1.0.0'), 'unknown')
  assert.equal(bumpKind('1.0.0', 'next'), 'unknown')
})
