import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { classify, enumerateRepo, enumerateTemplates } from './enumerate.js'

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
    assert.equal(classify(join(root, 'kit'), { scripts: { ci: 'tsc' } }), 'node')
    // start alone is not a build the check can run: not a node template
    assert.equal(classify(join(root, 'kit'), { scripts: { start: 'node server.js' } }), 'unknown')
    assert.equal(classify(join(root, 'kit'), { scripts: { build: '   ' } }), 'unknown')
    assert.equal(classify(join(root, 'kit'), null), 'unknown')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('enumerateRepo flags what it cannot classify instead of dropping it or crashing', () => {
  const root = mkdtempSync(join(tmpdir(), 'health-enumerate-'))
  try {
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({ repokit: { groups: [{ path: 'kit' }, { path: 'kit/legacy' }, { path: 'missing' }] } }),
    )
    mkdirSync(join(root, 'kit'))

    const good = join(root, 'kit', 'good')
    mkdirSync(good)
    writeFileSync(join(good, 'package.json'), JSON.stringify({ scripts: { build: 'tsc' } }))

    mkdirSync(join(root, 'kit', 'empty'))

    const broken = join(root, 'kit', 'broken')
    mkdirSync(broken)
    writeFileSync(join(broken, 'package.json'), '{ "name": "broken",')

    const bare = join(root, 'kit', 'bare')
    mkdirSync(bare)
    writeFileSync(join(bare, 'package.json'), JSON.stringify({ name: 'bare', scripts: { postinstall: 'node x.js' } }))

    // unknown framework but a ci script: still a template, the build check can run it
    const scripted = join(root, 'kit', 'scripted')
    mkdirSync(scripted)
    writeFileSync(join(scripted, 'package.json'), JSON.stringify({ name: 'scripted', scripts: { ci: 'tsc' } }))

    // unknown framework with only a dev script: nothing the check can run or boot
    const devOnly = join(root, 'kit', 'devonly')
    mkdirSync(devOnly)
    writeFileSync(join(devOnly, 'package.json'), JSON.stringify({ name: 'devonly', scripts: { dev: 'node x.js' } }))

    // start-only, framework-less: used to slip through as kind 'node' and end as an unverified warn
    const startOnly = join(root, 'kit', 'startonly')
    mkdirSync(startOnly)
    writeFileSync(
      join(startOnly, 'package.json'),
      JSON.stringify({ name: 'startonly', scripts: { start: 'node server.js' } }),
    )

    // never templates: hidden dirs, node_modules, a nested group's own directory, loose files
    mkdirSync(join(root, 'kit', '.cache'))
    mkdirSync(join(root, 'kit', 'node_modules'))
    mkdirSync(join(root, 'kit', 'legacy'))
    writeFileSync(join(root, 'kit', 'README.md'), '# kit\n')

    const { templates, unrecognized } = enumerateRepo(root)
    assert.deepEqual(
      templates.map((template) => template.id),
      ['kit/good', 'kit/scripted'],
    )
    assert.deepEqual(
      unrecognized.map(({ id, reason }) => ({ id, reason })),
      [
        { id: 'kit/bare', reason: 'no recognised framework and no ci/build script' },
        { id: 'kit/broken', reason: unrecognized[1].reason },
        { id: 'kit/devonly', reason: 'no recognised framework and no ci/build script' },
        { id: 'kit/empty', reason: 'no package.json or Cargo.toml' },
        { id: 'kit/startonly', reason: 'no recognised framework and no ci/build script' },
        { id: 'missing', reason: 'group directory missing' },
      ],
    )
    assert.match(unrecognized[1].reason, /^package\.json is not valid JSON: /)
    assert.equal(unrecognized[1].path, broken)
    assert.equal(unrecognized[5].path, join(root, 'missing'))

    // the templates-only view is unchanged for existing callers
    assert.deepEqual(
      enumerateTemplates(root).map((template) => template.id),
      ['kit/good', 'kit/scripted'],
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
