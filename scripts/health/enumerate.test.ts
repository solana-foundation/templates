import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { classify, enumerateTemplates } from './enumerate.js'

/** A fake repo root with one group holding the given template dirs. */
const fakeRoot = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'health-enumerate-'))
  writeFileSync(join(root, 'package.json'), JSON.stringify({ repokit: { groups: [{ path: 'kit' }] } }))
  mkdirSync(join(root, 'kit'))
  return root
}

test('a template with a root Cargo.toml and a Next.js app is next, and still has a cargo manifest', () => {
  const root = fakeRoot()
  try {
    const dir = join(root, 'kit', 'axum-keychain')
    mkdirSync(dir)
    writeFileSync(join(dir, 'Cargo.toml'), '[package]\nname = "axum-keychain"\n')
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({
        scripts: {
          dev: 'concurrently "cargo run" "next dev"',
          build: 'next build',
          ci: 'cargo fmt --check && next build',
        },
        dependencies: { next: '15.0.0', react: '19.0.0' },
      }),
    )
    writeFileSync(join(dir, '.env.example'), 'NEXT_PUBLIC_SUPABASE_URL=\nSUPABASE_SERVICE_ROLE_KEY=\n')

    const rustOnly = join(root, 'kit', 'pinocchio')
    mkdirSync(rustOnly)
    writeFileSync(join(rustOnly, 'Cargo.toml'), '[lib]\ncrate-type = ["cdylib"]\n')
    writeFileSync(join(rustOnly, 'package.json'), JSON.stringify({ scripts: { test: 'vitest' } }))

    const [axum, pinocchio] = enumerateTemplates(root)
    assert.equal(axum.id, 'kit/axum-keychain')
    assert.equal(axum.kind, 'next')
    assert.equal(axum.cargoManifestDir, dir)
    assert.equal(axum.isProgram, false)
    assert.deepEqual(axum.declaredEnvKeys, ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'])
    assert.deepEqual(axum.credentialKeys, ['SUPABASE_SERVICE_ROLE_KEY'])

    assert.equal(pinocchio.kind, 'rust')
    assert.equal(pinocchio.cargoManifestDir, rustOnly)
    assert.equal(pinocchio.isProgram, true)
    assert.deepEqual(pinocchio.declaredEnvKeys, [])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('classify: web signals win over cargo; cargo wins over plain node', () => {
  const root = fakeRoot()
  try {
    const dir = join(root, 'kit', 'x')
    mkdirSync(dir)
    writeFileSync(join(dir, 'Cargo.toml'), '[package]\nname = "x"\n')
    assert.equal(classify(dir, { dependencies: { vite: '7.0.0' } }), 'vite')
    assert.equal(classify(dir, { dependencies: { expo: '52.0.0' } }), 'expo')
    assert.equal(classify(dir, { scripts: { build: 'tsc' } }), 'rust')
    assert.equal(classify(dir, null), 'rust')
    assert.equal(classify(join(root, 'kit'), { scripts: { build: 'tsc' } }), 'node')
    assert.equal(classify(join(root, 'kit'), null), 'unknown')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
