import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  closestScript,
  copyToTemp,
  editDistance,
  isTracked,
  patchDocDrift,
  patchFileStem,
  proposePatch,
  rewriteScriptReferences,
  trackedLockfileTemplates,
} from './patcher.js'
import type { Finding } from './types.js'

const temporaryDirectories: string[] = []
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { force: true, recursive: true })
})

const docDriftFinding = (missing: string[]): Finding => ({
  templateId: 'fixture/demo',
  class: 'doc-drift',
  severity: 'warn',
  confidence: 'high',
  evidence: missing.map((script) => `README references missing script: ${script}`),
  reproduce: 'pnpm health --only fixture/demo',
  recommendedAction: 'Point the README at a script that exists.',
  autoPatchable: true,
  regression: false,
  dedupeKey: 'fixture/demo#doc-drift#0000000000',
})

/** A git repo with one template at fixture/demo whose README says `pnpm biuld`. */
const fixtureRepo = (readme: string) => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'sf-triage-test-')))
  temporaryDirectories.push(root)
  spawnSync('git', ['init', '-q'], { cwd: root })
  const dir = join(root, 'fixture', 'demo')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ scripts: { build: 'next build', dev: 'next dev' } }))
  writeFileSync(join(dir, 'README.md'), readme)
  return {
    root,
    target: { id: 'fixture/demo', dir, root, packageManager: 'npm', scripts: { build: 'next build', dev: 'next dev' } },
  }
}

test('editDistance and closestScript pick a near miss but not a stranger', () => {
  assert.equal(editDistance('biuld', 'build'), 1)
  assert.equal(editDistance('deploy', 'build'), 5)
  assert.equal(closestScript('biuld', ['build', 'dev']), 'build')
  assert.equal(closestScript('bulid', ['build', 'dev']), 'build')
  assert.equal(closestScript('deploy', ['build', 'dev']), null)
  assert.equal(closestScript('tset', ['test', 'dev']), 'test')
})

test('rewriteScriptReferences only touches package manager invocations of that exact script', () => {
  const text = 'Run `pnpm biuld`, then `npm run biuld` and `yarn biuld:watch`; biuld alone stays.'
  assert.equal(
    rewriteScriptReferences(text, 'biuld', 'build'),
    'Run `pnpm build`, then `npm run build` and `yarn biuld:watch`; biuld alone stays.',
  )
})

test('doc-drift recipe produces a repo-relative diff that git apply --check accepts', () => {
  const { root, target } = fixtureRepo('# Demo\n\nStart with:\n\n```bash\npnpm install\npnpm biuld\n```\n')
  const proposal = patchDocDrift(docDriftFinding(['biuld']), target)
  assert.ok(proposal.patchable, `patchable: ${!proposal.patchable ? proposal.reason : ''}`)
  assert.match(proposal.diff, /^diff --git a\/fixture\/demo\/README\.md b\/fixture\/demo\/README\.md/m)
  assert.match(proposal.diff, /^-pnpm biuld$/m)
  assert.match(proposal.diff, /^\+pnpm build$/m)
  assert.doesNotMatch(proposal.diff, /sf-triage-|tmp\//)
  assert.match(proposal.title, /docs\(fixture\/demo\): fix script name in README \(`biuld` -> `build`\)/)
  assert.match(proposal.body, /## Checklist/)
  assert.match(proposal.body, /## Reproduce/)

  const patchPath = join(root, 'proposal.diff')
  writeFileSync(patchPath, proposal.diff)
  const check = spawnSync('git', ['apply', '--check', patchPath], { cwd: root, encoding: 'utf-8' })
  assert.equal(check.status, 0, check.stderr)
  spawnSync('git', ['apply', patchPath], { cwd: root })
  assert.match(readFileSync(join(target.dir, 'README.md'), 'utf-8'), /pnpm build/)
  // the working tree was untouched until git apply ran: the recipe itself only wrote to a temp copy
})

test('doc-drift recipe emits a TODO instead of a patch when nothing is close', () => {
  const { target } = fixtureRepo('Run `pnpm deploy`.\n')
  const proposal = patchDocDrift(docDriftFinding(['deploy']), target)
  assert.equal(proposal.patchable, false)
  if (!proposal.patchable) assert.match(proposal.reason, /no close match for deploy/)
})

test('patch copies exclude nested installs, build output and private env files but keep tracked Anchor types', () => {
  const { root, target } = fixtureRepo('Run `pnpm biuld`.\n')
  const excluded = [
    'node_modules/pkg/index.js',
    'app/node_modules/pkg/index.js',
    'app/.next/cache/data',
    'app/dist/index.js',
    'anchor/target/debug/program',
    'anchor/target/deploy/program.so',
    '.env',
    'app/.env.local',
  ]
  const kept = ['anchor/target/idl/demo.json', 'anchor/target/types/demo.ts', '.env.example', 'app/src/index.ts']
  for (const file of [...excluded, ...kept]) {
    const path = join(target.dir, file)
    mkdirSync(join(path, '..'), { recursive: true })
    writeFileSync(path, 'fixture')
  }
  const added = spawnSync('git', ['add', '-f', ...kept.map((file) => `fixture/demo/${file}`)], { cwd: root })
  assert.equal(added.status, 0)
  const copy = copyToTemp(target)
  temporaryDirectories.push(copy)
  for (const file of excluded) assert.equal(existsSync(join(copy, file)), false, file)
  for (const file of kept) assert.equal(readFileSync(join(copy, file), 'utf-8'), 'fixture', file)
  assert.ok(patchDocDrift(docDriftFinding(['biuld']), target).patchable)
  assert.equal(readFileSync(join(target.dir, 'README.md'), 'utf-8'), 'Run `pnpm biuld`.\n')
})

test('trackedLockfileTemplates lists templates whose own lockfile git tracks; empty outside a repo', () => {
  const { root, target } = fixtureRepo('x')
  // same directory, different package manager: a tracked package-lock.json is not a pnpm-lock.yaml
  const templates = [target, { ...target, id: 'fixture/pnpm-twin', packageManager: 'pnpm' }]
  writeFileSync(join(target.dir, 'package-lock.json'), '{}')
  assert.deepEqual(trackedLockfileTemplates(root, templates), new Set())
  spawnSync('git', ['add', 'fixture/demo/package-lock.json'], { cwd: root })
  assert.deepEqual(trackedLockfileTemplates(root, templates), new Set(['fixture/demo']))
  const notARepo = realpathSync(mkdtempSync(join(tmpdir(), 'sf-triage-nogit-')))
  temporaryDirectories.push(notARepo)
  assert.deepEqual(trackedLockfileTemplates(notARepo, templates), new Set())
})

test('dependency recipes refuse an untracked (gitignored) lockfile left behind by a local install', () => {
  const { target } = fixtureRepo('x')
  writeFileSync(join(target.dir, 'package-lock.json'), '{}')
  assert.equal(isTracked(target.dir, 'package-lock.json'), false)
  const lock = proposePatch(
    { ...docDriftFinding([]), class: 'lockfile-out-of-date', evidence: ['npm ci can only install packages when'] },
    target,
    { allowInstall: true, timeoutMs: 1000 },
  )
  assert.equal(lock.patchable, false)
  if (!lock.patchable) assert.match(lock.reason, /no tracked package-lock\.json/)
  const audit = proposePatch(
    { ...docDriftFinding([]), class: 'vulnerable-deps', evidence: ['0 critical, 1 high, 0 moderate (npm audit)'] },
    target,
    { allowInstall: true, timeoutMs: 1000 },
  )
  assert.equal(audit.patchable, false)
  if (!audit.patchable) assert.match(audit.reason, /manual: no tracked package-lock\.json/)
})

test('with a tracked lockfile the dependency recipes proceed, but still refuse to run installs in tests', () => {
  const { root, target } = fixtureRepo('x')
  writeFileSync(join(target.dir, 'package-lock.json'), '{}')
  spawnSync('git', ['add', 'fixture/demo/package-lock.json'], { cwd: root })
  assert.equal(isTracked(target.dir, 'package-lock.json'), true)
  const lock = proposePatch(
    { ...docDriftFinding([]), class: 'lockfile-out-of-date', evidence: ['npm ci can only install packages when'] },
    target,
    { allowInstall: false, timeoutMs: 1000 },
  )
  assert.equal(lock.patchable, false)
  if (!lock.patchable) assert.match(lock.reason, /needs a package manager run/)
  const audit = proposePatch(
    { ...docDriftFinding([]), class: 'vulnerable-deps', evidence: ['0 critical, 1 high, 0 moderate (npm audit)'] },
    target,
    { allowInstall: false, timeoutMs: 1000 },
  )
  assert.equal(audit.patchable, false)
  if (!audit.patchable) assert.match(audit.reason, /needs a package manager run/)
  const pnpmAudit = proposePatch(
    { ...docDriftFinding([]), class: 'vulnerable-deps', evidence: ['0 critical, 1 high, 0 moderate (pnpm audit)'] },
    { ...target, packageManager: 'pnpm' },
    { allowInstall: false, timeoutMs: 1000 },
  )
  assert.equal(pnpmAudit.patchable, false)
  if (!pnpmAudit.patchable) assert.match(pnpmAudit.reason, /manual: pnpm/)
})

test('classes without a recipe are reported as not patchable', () => {
  const { target } = fixtureRepo('x')
  const proposal = proposePatch({ ...docDriftFinding([]), class: 'typescript-error' }, target, {
    allowInstall: false,
    timeoutMs: 1000,
  })
  assert.equal(proposal.patchable, false)
  if (!proposal.patchable) assert.match(proposal.reason, /no recipe for class typescript-error/)
})

test('patch file stems flatten the template id', () => {
  assert.equal(patchFileStem(docDriftFinding([])), 'fixture__demo.doc-drift')
})
