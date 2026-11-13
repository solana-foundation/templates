/**
 * Child processes and their output: spawn with a timeout and a tracked process group,
 * capture stdout/stderr, strip ANSI for human-facing notes, and take every tracked child
 * down on SIGINT/SIGTERM. Nothing here knows what a template is.
 */

import { spawn, spawnSync, type ChildProcess } from 'child_process'
import { sanitizedEnv } from './env.js'

export type Exec = {
  code: number | null
  /** combined stdout+stderr, for human-facing notes */
  output: string
  /** stdout alone, for parsing JSON output (stderr warnings would corrupt the parse) */
  stdout: string
  timedOut: boolean
  durationMs: number
}

const TAIL_LINES = 30
const MAX_CAPTURE_BYTES = 1_000_000

// Tools like Next.js hard-code ANSI colors into their error strings even with
// FORCE_COLOR=0/NO_COLOR set, which turns report notes into `[36m` soup. Strip
// CSI/OSC escape sequences from anything destined for human-facing notes.
// eslint-disable-next-line no-control-regex
export const stripAnsi = (text: string): string =>
  text.replace(/\x1b(?:\[[0-9;?]*[0-9A-Za-z]|\][^\x07]*(?:\x07|\x1b\\))/g, '')

export const tail = (text: string, lines = TAIL_LINES): string =>
  stripAnsi(text).trim().split('\n').slice(-lines).join('\n')

// Every detached child this process spawns (installs, builds, audits, dev servers). Tracked
// so the SIGINT/SIGTERM handler can take out their process groups before exiting. Without
// this a Ctrl-C mid-boot leaves a dev server holding its port, and the next run can end up
// probing that stale server instead of its own.
const activeChildren = new Set<ChildProcess>()

/**
 * SIGKILL a child's entire process group. Package managers spawn grandchildren (next dev,
 * vite, cargo, ...) that a plain child.kill() would orphan — an orphaned dev server holding
 * a port could then answer a LATER template's boot probe. Process groups are POSIX-only,
 * which this tool already assumes (CI runs on ubuntu, dev on macOS).
 */
export const killProcessTree = (child: ChildProcess): void => {
  try {
    if (child.pid) process.kill(-child.pid, 'SIGKILL')
  } catch {
    /* group already gone */
  }
  try {
    child.kill('SIGKILL')
  } catch {
    /* already dead */
  }
}

/** Register a child spawned outside `run` (the boot dev server) so the signal handlers can kill it. */
export const trackChild = (child: ChildProcess): void => {
  activeChildren.add(child)
}

export const untrackChild = (child: ChildProcess): void => {
  activeChildren.delete(child)
}

/** SIGKILL every child tree still running (used by the SIGINT/SIGTERM handlers). */
export const killActiveChildren = (): number => {
  const count = activeChildren.size
  for (const child of activeChildren) killProcessTree(child)
  activeChildren.clear()
  return count
}

/** Spawn a command, capture stdout+stderr, enforce a timeout. Spawned detached so the
 *  command becomes its own process-group leader and killProcessTree can take out its
 *  whole tree on timeout. */
export const run = (
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  extraEnv: Readonly<Record<string, string>> = {},
): Promise<Exec> =>
  new Promise((resolve) => {
    const start = Date.now()
    const child = spawn(command, args, {
      cwd,
      env: { ...sanitizedEnv(), ...extraEnv, CI: '1', FORCE_COLOR: '0', NO_COLOR: '1' },
      shell: false,
      detached: true,
    })
    activeChildren.add(child)
    let output = ''
    let stdout = ''
    let timedOut = false
    child.stdout.on('data', (chunk: Buffer) => {
      output += chunk.toString()
      stdout += chunk.toString()
      if (output.length > MAX_CAPTURE_BYTES) output = output.slice(-MAX_CAPTURE_BYTES)
      if (stdout.length > MAX_CAPTURE_BYTES) stdout = stdout.slice(-MAX_CAPTURE_BYTES)
    })
    child.stderr.on('data', (chunk: Buffer) => {
      output += chunk.toString()
      if (output.length > MAX_CAPTURE_BYTES) output = output.slice(-MAX_CAPTURE_BYTES)
    })
    const timer = setTimeout(() => {
      timedOut = true
      killProcessTree(child)
    }, timeoutMs)
    child.on('close', (code) => {
      clearTimeout(timer)
      activeChildren.delete(child)
      resolve({ code, output, stdout, timedOut, durationMs: Date.now() - start })
    })
    child.on('error', (spawnError) => {
      clearTimeout(timer)
      activeChildren.delete(child)
      resolve({
        code: -1,
        output: output + `\n${String(spawnError)}`,
        stdout,
        timedOut,
        durationMs: Date.now() - start,
      })
    })
  })

/** True when `cmd args` runs and exits 0 (used to detect cargo, pnpm, cargo-build-sbf, ...). */
export const hasBinary = (cmd: string, args: string[]): boolean => {
  try {
    return spawnSync(cmd, args, { stdio: 'ignore' }).status === 0
  } catch {
    return false
  }
}
