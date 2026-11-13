/**
 * Patch recipes for the auto-patchable classes. Every recipe works on a COPY of the
 * template in a temp dir, never on the working tree, and returns a unified diff whose
 * paths are repo-relative so `git apply --check` from the repo root can validate it.
 *
 * The recipes propose; they do not decide. A human reads the diff and the PR body, applies
 * it with `pnpm triage --apply <patch>` and opens a draft PR with `gh pr create --draft`.
 */

import { spawnSync } from 'child_process'
import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, relative } from 'path'
import { copyTemplate } from '../health/isolation.js'
import type { Finding, PatchProposal } from './types.js'

export type PatchTarget = {
  /** group-relative id, e.g. "kit/nextjs" */
  readonly id: string
  /** absolute path of the template directory in the working tree */
  readonly dir: string
  /** absolute repo root, used to make diff paths relative */
  readonly root: string
  readonly packageManager: string
  readonly scripts: Readonly<Record<string, string>>
}

export type PatchOptions = {
  /** allow recipes that run a package manager (lockfile, audit fix). Off in tests. */
  readonly allowInstall: boolean
  readonly timeoutMs: number
}

const TEMP_PREFIX = 'sf-templates-triage-'

// ---------- shared helpers (pure where possible) ----------

/**
 * Edit distance with adjacent transpositions (optimal string alignment), so `tset` is one
 * edit from `test`. Small inputs only: script names.
 */
export const editDistance = (left: string, right: string): number => {
  if (left === right) return 0
  if (!left.length) return right.length
  if (!right.length) return left.length
  const rows: number[][] = Array.from({ length: left.length + 1 }, (_, row) => [row])
  for (let column = 1; column <= right.length; column++) rows[0][column] = column
  for (let row = 1; row <= left.length; row++) {
    for (let column = 1; column <= right.length; column++) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1
      let best = Math.min(rows[row - 1][column] + 1, rows[row][column - 1] + 1, rows[row - 1][column - 1] + cost)
      if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1])
        best = Math.min(best, rows[row - 2][column - 2] + 1)
      rows[row][column] = best
    }
  }
  return rows[left.length][right.length]
}

/** A close enough existing script for a misspelled one, or null when nothing is near. */
export const closestScript = (missing: string, existing: readonly string[]): string | null => {
  const maxDistance = missing.length <= 4 ? 1 : 2
  let best: { name: string; distance: number } | null = null
  for (const name of [...existing].sort()) {
    const distance = editDistance(missing.toLowerCase(), name.toLowerCase())
    if (distance <= maxDistance && (!best || distance < best.distance)) best = { name, distance }
  }
  return best?.name ?? null
}

/** Replace `pnpm biuld` / `npm run biuld` / `yarn biuld` with the corrected script name. */
export const rewriteScriptReferences = (text: string, from: string, to: string): string =>
  text.replace(
    new RegExp(`(\\b(?:npm run|pnpm run|yarn run|pnpm|yarn)\\s+)${escapeRegExp(from)}(?![a-z0-9:_-])`, 'gi'),
    `$1${to}`,
  )

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const copyToTemp = (target: PatchTarget): string => {
  const dest = mkdtempSync(join(tmpdir(), `${TEMP_PREFIX}${target.id.replace(/\//g, '-')}-`))
  try {
    copyTemplate(target.dir, dest)
    return realpathSync(dest)
  } catch (error) {
    rmSync(dest, { recursive: true, force: true })
    throw new Error(`failed to copy ${target.id}: ${String(error)}`)
  }
}

/**
 * Unified diff of the original template vs its patched copy, restricted to `files`, with
 * a/<repo-relative> b/<repo-relative> headers. Uses `git diff --no-index`, which exits 1
 * when there are differences and 0 when there are none.
 */
export const diffAgainstCopy = (target: PatchTarget, copyDir: string, files: readonly string[]): string => {
  const relDir = relative(target.root, realpathSync(target.dir)).split('\\').join('/')
  const chunks: string[] = []
  for (const file of files) {
    const original = join(realpathSync(target.dir), file)
    const patched = join(copyDir, file)
    if (!existsSync(original) || !existsSync(patched)) continue
    const result = spawnSync('git', ['diff', '--no-index', '--no-color', '--', original, patched], {
      encoding: 'utf-8',
      maxBuffer: 50_000_000,
    })
    if (result.status === 0 || !result.stdout) continue
    const repoPath = `${relDir}/${file}`.split('\\').join('/')
    const strip = (absolute: string) => absolute.replace(/^\//, '')
    const rewritten = result.stdout.split(strip(original)).join(repoPath).split(strip(patched)).join(repoPath)
    chunks.push(rewritten)
  }
  return chunks.join('')
}

const prBody = (
  finding: Finding,
  summary: string,
  checklist: readonly string[],
  extra: readonly string[] = [],
): string => {
  const lines: string[] = []
  lines.push('## Summary', '', summary, '')
  lines.push(`Class: \`${finding.class}\` (confidence ${finding.confidence}) for \`${finding.templateId}\`.`, '')
  lines.push('## Evidence', '', '```', ...finding.evidence, '```', '')
  lines.push('## Reproduce', '', '```bash', finding.reproduce, '```', '')
  if (extra.length) lines.push(...extra, '')
  lines.push('## Checklist', '', ...checklist.map((item) => `- [ ] ${item}`), '')
  lines.push('Generated by `pnpm triage --patch`. Review before opening the draft PR.', '')
  return lines.join('\n')
}

// ---------- recipe: doc-drift ----------

/**
 * README (and csd instructions) reference a script that does not exist. When an existing
 * script is within a small edit distance, rewrite the reference; otherwise emit a TODO so
 * the human decides whether the doc or the package.json is wrong.
 */
export const patchDocDrift = (finding: Finding, target: PatchTarget): PatchProposal => {
  const missing = finding.evidence
    .map((line) => line.match(/missing script: (\S+)/)?.[1])
    .filter((name): name is string => Boolean(name))
  if (missing.length === 0) return { patchable: false, finding, reason: 'no missing script names in evidence' }

  const existing = Object.keys(target.scripts)
  const renames: Array<{ from: string; to: string }> = []
  const todos: string[] = []
  for (const name of missing) {
    const candidate = closestScript(name, existing)
    if (candidate) renames.push({ from: name, to: candidate })
    else todos.push(`\`${name}\`: no existing script is close enough; add it to package.json or fix the README by hand`)
  }
  if (renames.length === 0)
    return { patchable: false, finding, reason: `no close match for ${missing.join(', ')}; ${todos.join('; ')}` }

  const readmePath = join(target.dir, 'README.md')
  if (!existsSync(readmePath)) return { patchable: false, finding, reason: 'template has no README.md' }

  const copyDir = copyToTemp(target)
  try {
    const original = readFileSync(readmePath, 'utf-8')
    const patched = renames.reduce((text, { from, to }) => rewriteScriptReferences(text, from, to), original)
    if (patched === original)
      return { patchable: false, finding, reason: 'the misspelled script is not referenced in README.md' }
    writeFileSync(join(copyDir, 'README.md'), patched, 'utf-8')
    const diff = diffAgainstCopy(target, copyDir, ['README.md'])
    if (!diff) return { patchable: false, finding, reason: 'git diff produced no output' }
    const renameList = renames.map(({ from, to }) => `\`${from}\` -> \`${to}\``).join(', ')
    return {
      patchable: true,
      finding,
      diff,
      title: `docs(${target.id}): fix script name${renames.length > 1 ? 's' : ''} in README (${renameList})`,
      body: prBody(
        finding,
        `The README references ${renameList}, which does not exist in package.json. This renames the reference to the closest existing script.`,
        ['README commands match package.json scripts', 'No other docs reference the old name', 'pnpm lint passes'],
        todos.length ? ['## Still manual', '', ...todos.map((todo) => `- ${todo}`)] : [],
      ),
    }
  } finally {
    rmSync(copyDir, { recursive: true, force: true })
  }
}

// ---------- recipe: lockfile-out-of-date ----------

/**
 * True only when git tracks the file. Per-template lockfiles are gitignored in this repo,
 * so one left behind by a local install exists on disk but must never be patched.
 */
export const isTracked = (dir: string, file: string): boolean =>
  spawnSync('git', ['ls-files', '--error-unmatch', '--', file], { cwd: dir, stdio: 'ignore' }).status === 0

const LOCKFILES: Record<string, string> = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
}

/**
 * Ids of the templates whose lockfile (for their package manager) git tracks, from a
 * single `git ls-files` at the repo root. Empty when git is missing or `root` is not a
 * repo, so classification just reports every lockfile recipe as manual.
 */
export const trackedLockfileTemplates = (
  root: string,
  templates: readonly Pick<PatchTarget, 'id' | 'dir' | 'packageManager'>[],
): Set<string> => {
  const pathspecs = Object.values(LOCKFILES).map((file) => `*${file}`)
  const listed = spawnSync('git', ['ls-files', '-z', '--', ...pathspecs], { cwd: root, encoding: 'utf-8' })
  if (listed.error || listed.status !== 0) return new Set()
  const tracked = new Set(listed.stdout.split('\0').filter(Boolean))
  const ids = new Set<string>()
  for (const template of templates) {
    const lockfile = LOCKFILES[template.packageManager]
    if (!lockfile) continue
    const dir = relative(root, template.dir).split('\\').join('/')
    if (tracked.has(`${dir}/${lockfile}`)) ids.add(template.id)
  }
  return ids
}

const lockfileOnlyArgs = (pm: string): string[] | null => {
  if (pm === 'npm') return ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund']
  if (pm === 'pnpm') return ['install', '--lockfile-only', '--ignore-scripts']
  return null
}

export const patchLockfile = (finding: Finding, target: PatchTarget, options: PatchOptions): PatchProposal => {
  const lockfile = LOCKFILES[target.packageManager]
  if (!lockfile || !existsSync(join(target.dir, lockfile)) || !isTracked(target.dir, lockfile))
    return {
      patchable: false,
      finding,
      reason: `no tracked ${lockfile ?? 'lockfile'} in the template; nothing to regenerate (per-template lockfiles are gitignored in this repo)`,
    }
  const args = lockfileOnlyArgs(target.packageManager)
  if (!args)
    return {
      patchable: false,
      finding,
      reason: `${target.packageManager} has no lockfile-only install mode; regenerate by hand`,
    }
  if (!options.allowInstall)
    return {
      patchable: false,
      finding,
      reason: 'lockfile recipe needs a package manager run; pass --patch outside tests',
    }

  const copyDir = copyToTemp(target)
  try {
    const run = spawnSync(target.packageManager, args, {
      cwd: copyDir,
      encoding: 'utf-8',
      timeout: options.timeoutMs,
      env: { ...process.env, CI: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
    })
    if (run.status !== 0)
      return {
        patchable: false,
        finding,
        reason: `${target.packageManager} ${args.join(' ')} exited ${run.status}: ${(run.stderr || run.stdout).trim().split('\n').slice(-3).join(' | ')}`,
      }
    const diff = diffAgainstCopy(target, copyDir, [lockfile, 'package.json'])
    if (!diff)
      return {
        patchable: false,
        finding,
        reason: 'lockfile-only install produced no change; the failure may be environmental',
      }
    return {
      patchable: true,
      finding,
      diff,
      title: `chore(${target.id}): regenerate ${lockfile}`,
      body: prBody(
        finding,
        `\`${target.packageManager} ${args.join(' ')}\` regenerated ${lockfile} in an isolated copy of the template.`,
        [
          `${target.packageManager} install succeeds with the new lockfile`,
          'Template ci/build passes',
          'No unintended dependency bumps',
        ],
      ),
    }
  } finally {
    rmSync(copyDir, { recursive: true, force: true })
  }
}

// ---------- recipe: vulnerable-deps ----------

export const patchVulnerableDeps = (finding: Finding, target: PatchTarget, options: PatchOptions): PatchProposal => {
  const counts = finding.evidence[0] ?? 'see audit'
  if (target.packageManager !== 'npm')
    return {
      patchable: false,
      finding,
      reason: `manual: ${target.packageManager} has no equivalent of npm audit fix (${counts})`,
    }
  if (!existsSync(join(target.dir, 'package-lock.json')) || !isTracked(target.dir, 'package-lock.json'))
    return {
      patchable: false,
      finding,
      reason: `manual: no tracked package-lock.json, so audit fix has nothing to commit (${counts})`,
    }
  if (!options.allowInstall)
    return { patchable: false, finding, reason: 'audit recipe needs a package manager run; pass --patch outside tests' }

  const args = ['audit', 'fix', '--package-lock-only', '--ignore-scripts', '--no-fund']
  const copyDir = copyToTemp(target)
  try {
    const run = spawnSync('npm', args, {
      cwd: copyDir,
      encoding: 'utf-8',
      timeout: options.timeoutMs,
      env: { ...process.env, CI: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
    })
    // npm audit fix exits 1 when some advisories remain; the lockfile change is still useful.
    const diff = diffAgainstCopy(target, copyDir, ['package-lock.json', 'package.json'])
    if (!diff)
      return {
        patchable: false,
        finding,
        reason: `npm audit fix changed nothing (exit ${run.status}); the remaining advisories need a major bump or an upstream fix (${counts})`,
      }
    return {
      patchable: true,
      finding,
      diff,
      title: `fix(${target.id}): npm audit fix (${counts})`,
      body: prBody(
        finding,
        `\`npm ${args.join(' ')}\` in an isolated copy resolved advisories within the current semver ranges.${run.status !== 0 ? ' Some advisories remain and need a manual bump.' : ''}`,
        ['npm ci succeeds with the new lockfile', 'Template ci/build passes', 'Remaining advisories noted in the PR'],
      ),
    }
  } finally {
    rmSync(copyDir, { recursive: true, force: true })
  }
}

// ---------- dispatch ----------

export const proposePatch = (finding: Finding, target: PatchTarget, options: PatchOptions): PatchProposal => {
  switch (finding.class) {
    case 'doc-drift':
      return patchDocDrift(finding, target)
    case 'lockfile-out-of-date':
      return patchLockfile(finding, target, options)
    case 'vulnerable-deps':
      return patchVulnerableDeps(finding, target, options)
    default:
      return { patchable: false, finding, reason: `no recipe for class ${finding.class}` }
  }
}

/** `kit/nextjs` -> `kit__nextjs` so the patch file name is flat. */
export const patchFileStem = (finding: Finding): string => `${finding.templateId.replace(/\//g, '__')}.${finding.class}`

/** `git apply --check` then `git apply`, from the repo root. Never commits. */
export const applyPatch = (root: string, patchPath: string): { ok: true } | { ok: false; error: string } => {
  const check = spawnSync('git', ['apply', '--check', patchPath], { cwd: root, encoding: 'utf-8' })
  if (check.status !== 0)
    return { ok: false, error: `git apply --check failed:\n${(check.stderr || check.stdout).trim()}` }
  const apply = spawnSync('git', ['apply', patchPath], { cwd: root, encoding: 'utf-8' })
  if (apply.status !== 0) return { ok: false, error: `git apply failed:\n${(apply.stderr || apply.stdout).trim()}` }
  return { ok: true }
}
