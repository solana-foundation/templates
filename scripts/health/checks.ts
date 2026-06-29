/**
 * The actual checks. Each template is copied into an isolated temp directory,
 * installed once, then probed across the five dimensions. Nothing here mutates
 * the working tree or hits mainnet.
 */

import { spawn, spawnSync } from 'child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join, relative } from 'path'
import type {
  AuditResult,
  BootResult,
  BuildResult,
  DepsResult,
  DeprecationResult,
  DocDriftResult,
  OutdatedDep,
  RustResult,
  Status,
  TemplateRef,
} from './types.js'
import { bumpKind } from './semver.js'

export type RunOptions = {
  /** force a package manager; null means "use each template's pinned one (npm if unset)" */
  readonly packageManager: string | null
  readonly build: boolean
  readonly boot: boolean
  /** also run `cargo test` (host) / build-sbf + test (programs) for Rust templates */
  readonly cargoTest: boolean
  readonly installTimeoutMs: number
  readonly buildTimeoutMs: number
}

type Exec = { code: number | null; output: string; timedOut: boolean; durationMs: number }

const TAIL_LINES = 30

const tail = (s: string, n = TAIL_LINES): string => s.trim().split('\n').slice(-n).join('\n')

/** Spawn a command, capture combined stdout+stderr, enforce a timeout. */
const run = (command: string, args: string[], cwd: string, timeoutMs: number): Promise<Exec> =>
  new Promise((resolve) => {
    const start = Date.now()
    const child = spawn(command, args, { cwd, env: { ...process.env, CI: '1', FORCE_COLOR: '0' }, shell: false })
    let output = ''
    let timedOut = false
    const cap = (buf: Buffer) => {
      output += buf.toString()
      if (output.length > 1_000_000) output = output.slice(-1_000_000)
    }
    child.stdout.on('data', cap)
    child.stderr.on('data', cap)
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeoutMs)
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, output, timedOut, durationMs: Date.now() - start })
    })
    child.on('error', (e) => {
      clearTimeout(timer)
      resolve({ code: -1, output: output + `\n${String(e)}`, timedOut, durationMs: Date.now() - start })
    })
  })

// Every scaffold copy this process creates lives under tmpdir()/health-*. We track the
// active ones so a Ctrl-C can wipe them, and sweep orphans (from a previously killed run)
// at startup — so the install/build artifacts never pile up across runs.
const TEMP_PREFIX = 'health-'
const activeTempDirs = new Set<string>()

/** Copy a template into a fresh temp dir, dropping anything we'd rather install fresh. */
const isolate = (ref: TemplateRef): string => {
  const dest = mkdtempSync(join(tmpdir(), `${TEMP_PREFIX}${ref.id.replace(/\//g, '-')}-`))
  activeTempDirs.add(dest)
  // cp -R copies into dest; trailing /. copies contents.
  // (CI runs on ubuntu, dev on macOS - both have cp -R.)
  const cp = spawnSyncCp(ref.dir, dest)
  if (!cp) throw new Error(`failed to copy ${ref.id}`)
  for (const junk of ['node_modules', '.next', 'dist', 'build', 'target', '.expo']) {
    rmSync(join(dest, junk), { recursive: true, force: true })
  }
  return dest
}

const disposeTempDir = (dir: string): void => {
  rmSync(dir, { recursive: true, force: true })
  activeTempDirs.delete(dir)
}

/** Remove any leftover health-* temp dirs from a prior run that was killed mid-flight. */
export const sweepOrphanTempDirs = (): number => {
  let removed = 0
  try {
    for (const name of readdirSync(tmpdir())) {
      if (name.startsWith(TEMP_PREFIX)) {
        rmSync(join(tmpdir(), name), { recursive: true, force: true })
        removed++
      }
    }
  } catch {
    /* tmpdir not readable - nothing to sweep */
  }
  return removed
}

/** Wipe this run's in-flight temp dirs (used by the SIGINT/SIGTERM handlers). */
export const cleanupActiveTempDirs = (): void => {
  for (const dir of activeTempDirs) rmSync(dir, { recursive: true, force: true })
  activeTempDirs.clear()
}

// Small synchronous cp helper kept separate so isolate() reads cleanly.
const spawnSyncCp = (src: string, dest: string): boolean => {
  const r = spawnSync('cp', ['-R', `${src}/.`, dest], { stdio: 'ignore' })
  return r.status === 0
}

// ---------- deprecation extraction (pure, unit-tested) ----------

const pkgNameOf = (spec: string): string => {
  const at = spec.lastIndexOf('@')
  return at > 0 ? spec.slice(0, at) : spec
}

/**
 * Pull `name@version` specs out of install output's "deprecated" warnings, keeping only
 * those that are DIRECT deps — transitive ones (inflight, glob, ...) aren't the template
 * author's to fix and would drown the signal. Works for both npm and pnpm output.
 */
export const extractDeprecations = (installOutput: string, directDeps: readonly string[]): string[] => {
  const direct = new Set(directDeps)
  return Array.from(installOutput.matchAll(/deprecated\s+(\S+@[^\s:]+)/gi))
    .map((m) => m[1])
    .filter((spec) => direct.has(pkgNameOf(spec)))
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 25)
}

// ---------- dimension 1 + 4: install / build / deprecation ----------

export const runBuild = async (
  workDir: string,
  ref: TemplateRef,
  opts: RunOptions,
): Promise<{ build: BuildResult; deprecation: DeprecationResult }> => {
  const pm = opts.packageManager
  const install = await run(pm, ['install'], workDir, opts.installTimeoutMs)

  // Registry deprecation warnings surface during install ("npm warn deprecated X@1: ...").
  const deprecated = extractDeprecations(install.output, ref.directDeps)
  const deprecation: DeprecationResult = {
    status: deprecated.length === 0 ? 'pass' : 'warn',
    packages: deprecated,
  }

  if (install.code !== 0) {
    return {
      build: buildResult('install', `${pm} install`, install),
      deprecation,
    }
  }

  if (!opts.build) {
    return { build: { ...buildResult('install', `${pm} install`, install), status: 'pass' }, deprecation }
  }

  // Prefer the template's own `ci` script (the canonical health command); fall back to build.
  const hasCi = Boolean(ref.scripts.ci)
  const hasBuild = Boolean(ref.scripts.build)
  if (!hasCi && !hasBuild) {
    return {
      build: {
        status: 'warn',
        phase: 'none',
        command: '(no ci or build script)',
        exitCode: 0,
        timedOut: false,
        durationMs: 0,
        tail: 'Template has no `ci` or `build` script to verify.',
      },
      deprecation,
    }
  }
  const script = hasCi ? 'ci' : 'build'
  const built = await run(pm, ['run', script], workDir, opts.buildTimeoutMs)
  return { build: buildResult(hasCi ? 'ci' : 'build', `${pm} run ${script}`, built), deprecation }
}

const buildResult = (phase: BuildResult['phase'], command: string, exec: Exec): BuildResult => ({
  status: exec.timedOut ? 'fail' : exec.code === 0 ? 'pass' : 'fail',
  phase,
  command,
  exitCode: exec.code,
  timedOut: exec.timedOut,
  durationMs: exec.durationMs,
  tail: exec.timedOut
    ? `TIMED OUT after ${Math.round(exec.durationMs / 1000)}s\n${tail(exec.output)}`
    : tail(exec.output),
})

// ---------- dimension 2: dependency freshness ----------

export const checkOutdated = async (workDir: string, pm: string): Promise<DepsResult> => {
  if (pm !== 'npm') {
    return {
      status: 'skip',
      available: false,
      total: 0,
      major: 0,
      minor: 0,
      patch: 0,
      outdated: [],
      note: `outdated parsing only implemented for npm (ran with ${pm})`,
    }
  }
  // `npm outdated` exits 1 when anything is outdated - that's not an error for us.
  const r = await run('npm', ['outdated', '--json'], workDir, 120_000)
  let parsed: Record<string, { current?: string; latest?: string }>
  try {
    parsed = JSON.parse(r.output || '{}')
  } catch {
    return {
      status: 'skip',
      available: false,
      total: 0,
      major: 0,
      minor: 0,
      patch: 0,
      outdated: [],
      note: 'could not parse npm outdated output',
    }
  }
  const outdated: OutdatedDep[] = Object.entries(parsed)
    .filter(([, v]) => v.current && v.latest && v.current !== v.latest)
    .map(([name, v]) => ({ name, current: v.current!, latest: v.latest!, bump: bumpKind(v.current!, v.latest!) }))
  const major = outdated.filter((o) => o.bump === 'major').length
  const minor = outdated.filter((o) => o.bump === 'minor').length
  const patch = outdated.filter((o) => o.bump === 'patch').length
  return {
    status: major > 0 ? 'warn' : 'pass',
    available: true,
    total: outdated.length,
    major,
    minor,
    patch,
    outdated: outdated.sort((a, b) => a.name.localeCompare(b.name)),
  }
}

// ---------- dimension 2b: known vulnerabilities (snapshot, overlaps dependabot) ----------

export const checkAudit = async (workDir: string, pm: string): Promise<AuditResult> => {
  if (pm !== 'npm') {
    return {
      status: 'skip',
      available: false,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0,
      note: `audit parsing only implemented for npm (ran with ${pm})`,
    }
  }
  const r = await run('npm', ['audit', '--json'], workDir, 120_000)
  try {
    const j = JSON.parse(r.output || '{}') as { metadata?: { vulnerabilities?: Record<string, number> } }
    const v = j.metadata?.vulnerabilities ?? {}
    const critical = v.critical ?? 0
    const high = v.high ?? 0
    const moderate = v.moderate ?? 0
    const low = v.low ?? 0
    const info = v.info ?? 0
    const status: Status = critical > 0 || high > 0 ? 'fail' : moderate > 0 ? 'warn' : 'pass'
    return { status, available: true, critical, high, moderate, low, info }
  } catch {
    return {
      status: 'skip',
      available: false,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0,
      note: 'could not parse npm audit output',
    }
  }
}

// ---------- dimension 5: doc / reality drift ----------

export const checkDocDrift = (ref: TemplateRef): DocDriftResult => {
  const sources: string[] = []
  const readme = join(ref.dir, 'README.md')
  if (existsSync(readme)) sources.push(readFileSync(readme, 'utf-8'))
  const pkgPath = join(ref.dir, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const instr = JSON.parse(readFileSync(pkgPath, 'utf-8'))['create-solana-dapp']?.instructions
      if (Array.isArray(instr)) sources.push(instr.join('\n'))
      else if (typeof instr === 'string') sources.push(instr)
    } catch {
      /* ignore */
    }
  }
  const text = sources.join('\n')
  // Match `npm run <x>`, `pnpm <x>`, `pnpm run <x>`, `yarn <x>`.
  const referenced = new Set<string>()
  for (const m of text.matchAll(/\b(?:npm run|pnpm run|yarn run|pnpm|yarn)\s+([a-z][a-z0-9:_-]+)/gi)) {
    const name = m[1].toLowerCase()
    // skip package-manager subcommands that aren't user scripts
    if (['install', 'i', 'add', 'create', 'dlx', 'exec', 'why', 'audit', 'outdated', 'update'].includes(name)) continue
    referenced.add(name)
  }
  const scripts = new Set(Object.keys(ref.scripts))
  const missing = [...referenced].filter((s) => !scripts.has(s)).sort()
  return {
    status: missing.length === 0 ? 'pass' : 'warn',
    missingScripts: missing,
    note: missing.length ? 'README/instructions reference scripts not in package.json' : undefined,
  }
}

// ---------- dimension 3: runtime boot (web templates, opt-in) ----------

export const checkBoot = async (workDir: string, ref: TemplateRef, opts: RunOptions): Promise<BootResult> => {
  if (ref.kind !== 'next' && ref.kind !== 'vite') {
    return { status: 'skip', available: false, note: `boot check only applies to web templates (kind: ${ref.kind})` }
  }
  if (!ref.scripts.dev) {
    return { status: 'skip', available: false, note: 'no dev script' }
  }
  const start = Date.now()
  const child = spawn(opts.packageManager, ['run', 'dev'], { cwd: workDir, env: { ...process.env, FORCE_COLOR: '0' } })
  let out = ''
  child.stdout.on('data', (b) => (out += b.toString()))
  child.stderr.on('data', (b) => (out += b.toString()))

  const candidates = ref.kind === 'vite' ? [5173, 4321, 3000] : [3000, 3001]
  const deadline = Date.now() + 60_000
  const kill = () => {
    try {
      child.kill('SIGKILL')
    } catch {
      /* ignore */
    }
  }

  try {
    while (Date.now() < deadline) {
      // Prefer a URL the dev server actually printed.
      const printed = out.match(/https?:\/\/localhost:(\d+)/)
      const ports = printed ? [Number(printed[1]), ...candidates] : candidates
      for (const port of ports) {
        const url = `http://localhost:${port}`
        const res = await tryFetch(url)
        if (res !== null) {
          kill()
          return { status: 'pass', available: true, url, httpStatus: res, durationMs: Date.now() - start }
        }
      }
      await sleep(1500)
    }
    kill()
    return {
      status: 'fail',
      available: true,
      durationMs: Date.now() - start,
      note: `dev server did not respond within 60s\n${tail(out, 15)}`,
    }
  } finally {
    kill()
  }
}

const tryFetch = async (url: string): Promise<number | null> => {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    return res.status
  } catch {
    return null
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ---------- dimension 3b: Rust (cargo) ----------

const hasBinary = (cmd: string, args: string[]): boolean => {
  try {
    return spawnSync(cmd, args, { stdio: 'ignore' }).status === 0
  } catch {
    return false
  }
}

const skipRust = (note: string): RustResult => ({
  status: 'skip',
  available: false,
  command: '',
  exitCode: null,
  timedOut: false,
  durationMs: 0,
  tail: '',
  tested: false,
  note,
})

/**
 * Compile-check a Rust template. On-chain programs use `cargo check` (fast, host-target,
 * matches the templates' own `check` recipe — no SBF tools needed). Host binaries use
 * `cargo build`. With opts.cargoTest, also run the test suite: host crates via `cargo test`,
 * programs via `cargo-build-sbf` + `cargo test` (skipped with a note if the SBF tools aren't
 * installed, since program tests load the compiled .so).
 */
export const checkRust = async (workDir: string, ref: TemplateRef, opts: RunOptions): Promise<RustResult> => {
  if (!ref.cargoManifestDir) return skipRust('no Cargo.toml')
  if (!hasBinary('cargo', ['--version'])) return skipRust('cargo not installed')

  const manifestDir = join(workDir, relative(ref.dir, ref.cargoManifestDir))
  // For programs, compile-check the program crate only. The integration-test crate of a
  // Solana program `include_bytes!`s the built .so, so a workspace-wide `cargo check` can't
  // compile it without first running cargo-build-sbf — that's the --cargo-test path below.
  const programDir = existsSync(join(workDir, 'program')) ? join(workDir, 'program') : manifestDir
  const verb = ref.isProgram ? 'check' : 'build'
  const compileDir = ref.isProgram ? programDir : manifestDir
  const compile = await run('cargo', [verb], compileDir, opts.buildTimeoutMs)
  const base: RustResult = {
    status: compile.timedOut ? 'fail' : compile.code === 0 ? 'pass' : 'fail',
    available: true,
    command: ref.isProgram ? 'cargo check (program)' : 'cargo build',
    exitCode: compile.code,
    timedOut: compile.timedOut,
    durationMs: compile.durationMs,
    tail: compile.timedOut ? `TIMED OUT\n${tail(compile.output)}` : tail(compile.output),
    tested: false,
  }
  if (base.status !== 'pass' || !opts.cargoTest) return base

  // Host binary: a plain cargo test is enough.
  if (!ref.isProgram) {
    const t = await run('cargo', ['test'], manifestDir, opts.buildTimeoutMs)
    return {
      ...base,
      status: t.timedOut || t.code !== 0 ? 'fail' : 'pass',
      command: 'cargo build && cargo test',
      tail: tail(t.output),
      durationMs: base.durationMs + t.durationMs,
      tested: true,
    }
  }

  // Program: tests load the compiled .so, so they need the Solana SBF toolchain.
  const sbf = hasBinary('cargo-build-sbf', ['--version']) || hasBinary('cargo', ['build-sbf', '--version'])
  if (!sbf) {
    return { ...base, note: 'cargo check passed; tests skipped (requires solana platform tools / cargo-build-sbf)' }
  }
  const built = await run('cargo-build-sbf', [], programDir, opts.buildTimeoutMs)
  if (built.timedOut || built.code !== 0) {
    return { ...base, status: 'fail', command: 'cargo-build-sbf', tail: tail(built.output), tested: true }
  }
  const t = await run('cargo', ['test'], manifestDir, opts.buildTimeoutMs)
  return {
    ...base,
    status: t.timedOut || t.code !== 0 ? 'fail' : 'pass',
    command: 'cargo check && cargo-build-sbf && cargo test',
    tail: tail(t.output),
    durationMs: base.durationMs + built.durationMs + t.durationMs,
    tested: true,
  }
}

// ---------- per-template orchestration ----------

export const checkTemplate = async (ref: TemplateRef, opts: RunOptions) => {
  let workDir: string | null = null
  try {
    workDir = isolate(ref)

    // Effective PM: explicit --pm override > the template's pinned one > npm. Fall back to
    // npm if the chosen PM isn't installed, so a missing pnpm/yarn never reads as a template
    // failure. (This is what removes the npm-vs-pnpm false ERESOLVE failures.)
    let pm = opts.packageManager ?? ref.packageManager
    let pmNote: string | undefined
    if (pm !== 'npm' && !hasBinary(pm, ['--version'])) {
      pmNote = `${pm} not installed — fell back to npm`
      pm = 'npm'
    }
    const effOpts: RunOptions = { ...opts, packageManager: pm }

    let { build, deprecation } = await runBuild(workDir, ref, effOpts)
    const installed = build.phase !== 'install' || build.status === 'pass'

    // Rust check runs alongside the npm side (pinocchio has both a Rust program and TS clients).
    const rust = opts.build ? await checkRust(workDir, ref, effOpts) : undefined

    // A Rust-only template with no npm build/ci script shouldn't be flagged "warn" for that —
    // cargo is its build. Downgrade the "no script" warning to skip when Rust carried the build.
    if (ref.cargoManifestDir && build.phase === 'none' && build.status === 'warn') {
      build = { ...build, status: 'skip', tail: 'No npm build/ci script — Rust template, see cargo result.' }
    }

    // needs-setup: a template that declares env/credentials and can't build without that setup
    // step isn't "broken" — mark it skip so the fail list only holds genuinely broken templates.
    // This dominates the overall status (see toTemplateReport): we genuinely couldn't validate
    // it, so it must read "skip", not get bubbled up to pass/warn by advisory checks.
    let needsSetupSkip = false
    if (ref.needsSecrets && build.status === 'fail') {
      needsSetupSkip = true
      build = {
        ...build,
        status: 'skip',
        tail: `SKIPPED — needs setup/credentials (${ref.secretsReason ?? 'env required'}). Build without setup:\n${build.tail}`,
      }
    }

    const deps = installed ? await checkOutdated(workDir, pm) : skipDeps('install failed')
    const audit = installed ? await checkAudit(workDir, pm) : skipAudit('install failed')
    const docDrift = checkDocDrift(ref)
    const boot = opts.boot && installed && build.status === 'pass' ? await checkBoot(workDir, ref, effOpts) : undefined
    return { build, deprecation, deps, audit, docDrift, boot, rust, packageManager: pm, pmNote, needsSetupSkip }
  } finally {
    if (workDir) disposeTempDir(workDir)
  }
}

const skipDeps = (note: string): DepsResult => ({
  status: 'skip',
  available: false,
  total: 0,
  major: 0,
  minor: 0,
  patch: 0,
  outdated: [],
  note,
})
const skipAudit = (note: string): AuditResult => ({
  status: 'skip',
  available: false,
  critical: 0,
  high: 0,
  moderate: 0,
  low: 0,
  info: 0,
  note,
})
