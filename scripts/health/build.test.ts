import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scriptChainReferencesCargo } from './checks.js'

// kit/axum-keychain-style package.json: ci chains into rust:* scripts that call cargo.
const scripts = {
  build: 'next build',
  'build:rust': 'cargo build',
  ci: 'npm run rust:fmt && npm run rust:clippy && npm run build:rust && npm run build && npm run lint',
  dev: 'concurrently -n rust,next "cargo run" "next dev"',
  lint: 'eslint',
  'rust:clippy': 'cargo clippy --all-targets -- -D warnings',
  'rust:fmt': 'cargo fmt --check',
}

test('a ci script that chains into cargo via npm run is detected', () => {
  assert.equal(scriptChainReferencesCargo(scripts, 'ci'), true)
  assert.equal(scriptChainReferencesCargo(scripts, 'build:rust'), true)
})

test('scripts that never reach cargo are not flagged', () => {
  assert.equal(scriptChainReferencesCargo(scripts, 'build'), false)
  assert.equal(scriptChainReferencesCargo(scripts, 'lint'), false)
  assert.equal(scriptChainReferencesCargo(scripts, 'missing'), false)
  // the word inside another identifier does not count
  assert.equal(scriptChainReferencesCargo({ ci: 'node scripts/cargocult.js' }, 'ci'), false)
})

test('chains through pnpm/yarn/{pm} and survives cycles', () => {
  assert.equal(scriptChainReferencesCargo({ ci: 'pnpm check', check: 'yarn fmt', fmt: 'cargo fmt' }, 'ci'), true)
  assert.equal(scriptChainReferencesCargo({ ci: 'npm run lint', lint: 'npm run ci' }, 'ci'), false)
})
