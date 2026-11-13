/**
 * Dimension 3b: Rust (cargo). Compile-check programs with `cargo check`, build host
 * binaries, and optionally run the test suite (programs need the SBF toolchain for that).
 */

import { existsSync } from 'fs'
import { join, relative } from 'path'
import type { RunOptions, RustResult, TemplateRef } from './types.js'
import { hasBinary, run, tail, type Exec } from './process.js'

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
  const base = rustPhase(skipRust(''), ref.isProgram ? 'cargo check (program)' : 'cargo build', compile, false)
  if (base.status !== 'pass' || !opts.cargoTest) return base

  // Host binary: a plain cargo test is enough.
  if (!ref.isProgram) {
    const testRun = await run('cargo', ['test'], manifestDir, opts.buildTimeoutMs)
    return rustPhase(base, 'cargo build && cargo test', testRun, true)
  }

  // Program: tests load the compiled .so, so they need the Solana SBF toolchain.
  const sbf = hasBinary('cargo-build-sbf', ['--version']) || hasBinary('cargo', ['build-sbf', '--version'])
  if (!sbf) {
    return { ...base, note: 'cargo check passed; tests skipped (requires solana platform tools / cargo-build-sbf)' }
  }
  const built = await run('cargo-build-sbf', [], programDir, opts.buildTimeoutMs)
  if (built.timedOut || built.code !== 0) {
    return rustPhase(base, 'cargo check && cargo-build-sbf', built, true)
  }
  const testRun = await run('cargo', ['test'], manifestDir, opts.buildTimeoutMs)
  const afterSbf = { ...base, durationMs: base.durationMs + built.durationMs }
  return rustPhase(afterSbf, 'cargo check && cargo-build-sbf && cargo test', testRun, true)
}

/**
 * Pure: fold one cargo phase into the running Rust result. Status, exit code, timeout flag,
 * command and tail all describe THIS phase (a failing `cargo test` must not keep the passing
 * `cargo check`'s exitCode 0 / timedOut false); durationMs accumulates across phases.
 */
export const rustPhase = (
  previous: RustResult,
  command: string,
  exec: Pick<Exec, 'code' | 'output' | 'timedOut' | 'durationMs'>,
  tested: boolean,
): RustResult => ({
  ...previous,
  status: exec.timedOut ? 'fail' : exec.code === 0 ? 'pass' : 'fail',
  available: true,
  command,
  exitCode: exec.code,
  timedOut: exec.timedOut,
  durationMs: previous.durationMs + exec.durationMs,
  tail: exec.timedOut
    ? `TIMED OUT after ${Math.round(exec.durationMs / 1000)}s\n${tail(exec.output)}`
    : tail(exec.output),
  tested,
  note: undefined,
})
