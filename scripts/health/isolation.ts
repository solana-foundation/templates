/**
 * Isolation: each template is copied into a fresh temp directory before anything runs,
 * leaving out installs, build output and private env files. Tracks this run's temp dirs
 * so a Ctrl-C can wipe them and sweeps orphans from killed runs at startup.
 */

import { spawnSync } from 'child_process'
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { basename, join, relative, sep } from 'path'
import type { TemplateRef } from './types.js'

/**
 * Directory names never copied into the isolated template copy: build output and installs
 * are recreated fresh, and `.git` is never needed to install or build.
 */
export const EXCLUDED_DIRS: readonly string[] = ['node_modules', '.git', '.next', 'dist', 'build', '.expo', '.turbo']

/**
 * Cargo output under any `target/` dir. `target` is NOT excluded wholesale: Anchor templates
 * commit `anchor/target/idl/*.json` and `anchor/target/types/*.ts` that their TS code imports.
 * Inside a git checkout the tracked/untracked distinction is used instead (see copyTemplate).
 */
export const CARGO_OUTPUT_PATTERN =
  /(^|\/)target\/(debug|release|deploy|sbf-solana-solana|\.rustc_info\.json|CACHEDIR\.TAG)(\/|$)/

/** The only `.env*` files that are safe to copy: placeholders, never real values. */
export const ENV_TEMPLATE_FILES: readonly string[] = ['.env.example', '.env.sample', '.env.template']

/**
 * True for private env files (`.env`, `.env.local`, `.env.production.local`, ...). A
 * developer's gitignored `.env` would otherwise ride along into the temp copy and Next.js /
 * Vite would load real credentials during the build, so these are never copied.
 */
export const isPrivateEnvFile = (name: string): boolean =>
  name === '.env' || (name.startsWith('.env.') && !ENV_TEMPLATE_FILES.includes(name))

/**
 * Pure: the cpSync filter for a template at `src`. Drops EXCLUDED_DIRS and private env files
 * at any depth. Under a `target/` dir, keeps only git-tracked entries when `tracked` (the
 * template's `git ls-files` output, template-relative) is known, otherwise drops Cargo output.
 */
export const copyFilterFor = (src: string, tracked: ReadonlySet<string> | null): ((source: string) => boolean) => {
  // Every ancestor dir of a tracked file, so cpSync descends into dirs that hold tracked files.
  const trackedDirs = new Set<string>()
  for (const file of tracked ?? []) {
    const parts = file.split('/')
    for (let depth = 1; depth < parts.length; depth++) trackedDirs.add(parts.slice(0, depth).join('/'))
  }
  return (source: string): boolean => {
    const name = basename(source)
    if (EXCLUDED_DIRS.includes(name) || isPrivateEnvFile(name)) return false
    const rel = relative(src, source).split(sep).join('/')
    if (rel === '' || !/(^|\/)target(\/|$)/.test(rel)) return true
    if (tracked) return tracked.has(rel) || trackedDirs.has(rel)
    return !CARGO_OUTPUT_PATTERN.test(rel)
  }
}

/** Template-relative paths git tracks under `dir`, or null outside a git checkout. */
const gitTrackedFiles = (dir: string): Set<string> | null => {
  const result = spawnSync('git', ['ls-files', '-z'], {
    cwd: dir,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
  })
  if (result.status !== 0 || typeof result.stdout !== 'string') return null
  return new Set(result.stdout.split('\0').filter((file) => file.length > 0))
}

/** Copy a template directory into dest, leaving out EXCLUDED_DIRS, private env files and Cargo output. */
export const copyTemplate = (src: string, dest: string): void => {
  cpSync(src, dest, { recursive: true, filter: copyFilterFor(src, gitTrackedFiles(src)) })
}

// Every scaffold copy this process creates lives under tmpdir()/health-*. We track the
// active ones so a Ctrl-C can wipe them, and sweep orphans (from a previously killed run)
// at startup — so the install/build artifacts never pile up across runs.
// Specific enough that the startup sweep won't touch unrelated `health-*` temp data
// belonging to other tools on a shared CI runner or dev machine. The owning PID is baked
// into each dir name so the sweep can tell a live concurrent run's dirs from true orphans.
const TEMP_PREFIX = 'sf-templates-health-'
const RUN_TEMP_PREFIX = `${TEMP_PREFIX}${process.pid}-`
const activeTempDirs = new Set<string>()

/** Copy a template into a fresh temp dir, dropping anything we'd rather install fresh. */
export const isolate = (ref: TemplateRef): string => {
  const dest = mkdtempSync(join(tmpdir(), `${RUN_TEMP_PREFIX}${ref.id.replace(/\//g, '-')}-`))
  activeTempDirs.add(dest)
  // Filtered copy: build output / installs are recreated fresh, and private env files
  // (.env, .env.local, ...) never leave the working tree. See copyTemplate.
  try {
    copyTemplate(ref.dir, dest)
  } catch (error) {
    throw new Error(`failed to copy ${ref.id}: ${String(error)}`)
  }
  return dest
}

export const disposeTempDir = (dir: string): void => {
  rmSync(dir, { recursive: true, force: true })
  activeTempDirs.delete(dir)
}

/** True when the process that owns a temp dir is still running (EPERM means it exists). */
const ownerProcessAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM'
  }
}

/**
 * Remove any leftover health-* temp dirs from a prior run that was killed mid-flight.
 * Dirs whose owning process is still alive belong to a concurrent run and are left alone.
 */
export const sweepOrphanTempDirs = (): number => {
  let removed = 0
  try {
    for (const name of readdirSync(tmpdir())) {
      if (!name.startsWith(TEMP_PREFIX)) continue
      const ownerPid = Number.parseInt(name.slice(TEMP_PREFIX.length), 10)
      if (Number.isInteger(ownerPid) && ownerPid !== process.pid && ownerProcessAlive(ownerPid)) continue
      rmSync(join(tmpdir(), name), { recursive: true, force: true })
      removed++
    }
  } catch {
    /* tmpdir not readable - nothing to sweep */
  }
  return removed
}

/** Wipe this run's in-flight temp dirs (used by the SIGINT/SIGTERM handlers). Never throws:
 *  a dir that can't be removed right now (a child still writing into it) is left for the
 *  startup sweep of the next run, and the signal handler must not crash on it. */
export const cleanupActiveTempDirs = (): void => {
  for (const dir of activeTempDirs) {
    try {
      rmSync(dir, { recursive: true, force: true })
    } catch {
      /* startup sweep of the next run gets it */
    }
  }
  activeTempDirs.clear()
}
