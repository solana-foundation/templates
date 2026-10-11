import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkDocDrift, commandContexts, scriptsInCommands } from './checks.js'
import type { TemplateRef } from './types.js'

test('prose never yields script references', () => {
  const prose = [
    'pnpm is the package manager to use for this template.',
    'Use pnpm instead of npm, then run the dev server.',
    'yarn run is not supported here.',
  ].join('\n')
  assert.deepEqual(scriptsInCommands(commandContexts(prose).join('\n')), [])
  assert.deepEqual(commandContexts(prose), [])
})

test('fenced blocks and inline code spans are command contexts', () => {
  const markdown = [
    'Install with `pnpm install` and start with `pnpm dev`.',
    '',
    '```bash',
    'pnpm run build',
    'npm run lint && yarn test',
    'bun run deploy:devnet',
    '```',
    '',
    'Then `npm run` whatever you like.',
  ].join('\n')
  const scripts = scriptsInCommands(commandContexts(markdown).join('\n'))
  assert.deepEqual(scripts.sort(), ['build', 'deploy:devnet', 'dev', 'lint', 'test'])
})

test('package manager built-ins are not scripts', () => {
  const commands = [
    'pnpm install',
    'pnpm i',
    'pnpm add -D typescript',
    'pnpm remove foo',
    'pnpm up',
    'pnpm dlx create-solana-dapp',
    'yarn create vite',
    'pnpm exec tsc',
    'pnpm run',
    'pnpm',
  ].join('\n')
  assert.deepEqual(scriptsInCommands(commands), [])
})

test('npm without run only reaches scripts through start/test', () => {
  assert.deepEqual(scriptsInCommands('npm start\nnpm test\nnpm ci\nnpm publish\nnpm run anchor-build'), [
    'start',
    'test',
    'anchor-build',
  ])
})

test('the create-solana-dapp {pm} placeholder counts as a package manager', () => {
  assert.deepEqual(scriptsInCommands('+{pm} install\n+{pm} dev\n+{pm} run anchor-build'), ['dev', 'anchor-build'])
})

test('a bare pm <x> naming a direct dependency runs its binary, not a script', () => {
  assert.deepEqual(scriptsInCommands('+{pm} prisma generate\npnpm vite build', ['prisma', 'vite']), [])
  // without the dependency it is a real reference that can only be a (missing) script
  assert.deepEqual(scriptsInCommands('+{pm} prisma generate', ['@prisma/client']), ['prisma'])
  // `run` is explicit: a dependency with the same name as a script does not hide drift
  assert.deepEqual(scriptsInCommands('pnpm run prisma', ['prisma']), ['prisma'])
})

test('command lines that cd elsewhere are not checked against this package.json', () => {
  assert.deepEqual(
    scriptsInCommands('+cd frontend && {pm} install\n+cd frontend && pnpm run dev\n$ cd app; yarn dev'),
    [],
  )
  assert.deepEqual(scriptsInCommands('cd frontend\npnpm run dev'), ['dev'])
})

const ref = (dir: string, scripts: Record<string, string>): TemplateRef => ({
  id: 'test/template',
  group: 'test',
  dir,
  kind: 'next',
  scripts,
  directDeps: [],
  cargoManifestDir: null,
  isProgram: false,
  packageManager: 'npm',
  needsSecrets: false,
  credentialKeys: [],
  declaredEnvKeys: [],
})

test('checkDocDrift: the old false positives are gone, real drift is still reported', () => {
  const dir = mkdtempSync(join(tmpdir(), 'health-docdrift-'))
  try {
    writeFileSync(
      join(dir, 'README.md'),
      [
        '# Template',
        '',
        'pnpm is the package manager to use. Run pnpm instead of npm.',
        '',
        '```sh',
        'pnpm install',
        'pnpm dev',
        'pnpm run deploy',
        '```',
      ].join('\n'),
    )
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ 'create-solana-dapp': { instructions: ['Start it:', '+{pm} dev', '+{pm} run anchor-build'] } }),
    )
    const result = checkDocDrift(ref(dir, { dev: 'next dev', build: 'next build' }))
    assert.equal(result.status, 'warn')
    assert.deepEqual(result.missingScripts, ['anchor-build', 'deploy'])
    for (const word of ['is', 'to', 'instead', 'run']) assert.ok(!result.missingScripts.includes(word), word)

    const clean = checkDocDrift(ref(dir, { dev: 'next dev', deploy: 'x', 'anchor-build': 'y' }))
    assert.equal(clean.status, 'pass')
    assert.deepEqual(clean.missingScripts, [])

    // multi-package template: a script defined in a nested package.json (frontend/, app/) counts
    mkdirSync(join(dir, 'frontend'))
    writeFileSync(
      join(dir, 'frontend', 'package.json'),
      JSON.stringify({ scripts: { deploy: 'x', 'anchor-build': 'y' } }),
    )
    const nested = checkDocDrift(ref(dir, { dev: 'next dev' }))
    assert.equal(nested.status, 'pass')
    assert.deepEqual(nested.missingScripts, [])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
