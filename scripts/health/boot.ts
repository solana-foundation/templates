/**
 * Dimension 3: runtime boot (web templates, opt-in). Starts the dev server, polls the URLs
 * it announces, and hands the first one that answers to an `onReady` hook (the render QA)
 * while the server is still up. Boots are serialised through a lock because dev servers
 * all want their default port.
 */

import { spawn } from 'child_process'
import type { BootResult, ResolvedRunOptions, TemplateRef } from './types.js'
import { sanitizedEnv } from './env.js'
import { killProcessTree, stripAnsi, tail, trackChild, untrackChild } from './process.js'

// Boot checks run one at a time even when template checks are parallel: dev servers all
// want their default port (3000/5173), and a server that hard-exits on EADDRINUSE would
// read as a broken template. Everything else (install, build, audit) stays concurrent.
let bootLock: Promise<void> = Promise.resolve()
const withBootLock = <T>(task: () => Promise<T>): Promise<T> => {
  const result = bootLock.then(task)
  bootLock = result.then(
    () => undefined,
    () => undefined,
  )
  return result
}

/** The boot result plus whatever `onReady` produced while the dev server was still up. */
export type BootOutcome<T> = { readonly boot: BootResult; readonly ready?: T }

/**
 * Boot the dev server and, when it responds, run `onReady(url)` while it is still up and
 * the boot lock is held. The server is killed as soon as `onReady` settles. This is the
 * seam the render QA (and any later browser-driven rung) attaches to.
 */
export const checkBoot = async <T = never>(
  workDir: string,
  ref: TemplateRef,
  opts: ResolvedRunOptions,
  onReady?: (url: string) => Promise<T>,
): Promise<BootOutcome<T>> => {
  if (ref.kind !== 'next' && ref.kind !== 'vite') {
    return {
      boot: { status: 'skip', available: false, note: `boot check only applies to web templates (kind: ${ref.kind})` },
    }
  }
  if (!ref.scripts.dev) {
    return { boot: { status: 'skip', available: false, note: 'no dev script' } }
  }
  return withBootLock(() => bootDevServer(workDir, opts, onReady))
}

const bootDevServer = async <T>(
  workDir: string,
  opts: ResolvedRunOptions,
  onReady?: (url: string) => Promise<T>,
): Promise<BootOutcome<T>> => {
  const start = Date.now()
  // detached: the dev command becomes its own process-group leader, so killProcessTree in
  // the finally below takes out the whole tree (pm -> next/vite -> workers), not just the pm.
  const child = spawn(opts.packageManager, ['run', 'dev'], {
    cwd: workDir,
    env: { ...sanitizedEnv(), ...opts.templateEnv, FORCE_COLOR: '0', NO_COLOR: '1' },
    detached: true,
  })
  trackChild(child)
  let output = ''
  let exited = false
  child.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()))
  child.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()))
  child.on('exit', () => (exited = true))

  const deadline = Date.now() + 60_000

  // Error statuses (4xx/5xx) don't pass, but they don't fail immediately either: dev
  // servers can respond 500 while still compiling, so keep polling until the deadline.
  let lastErrorStatus: number | null = null
  try {
    while (Date.now() < deadline) {
      if (exited) {
        return {
          boot: {
            status: 'fail',
            available: true,
            durationMs: Date.now() - start,
            note: `dev server exited before responding\n${tail(output, 15)}`,
          },
        }
      }
      // A dev script may start several servers (a Rust API plus Next.js): probe every
      // announced URL each poll, web-framework ones first, and accept the first that answers.
      for (const url of announcedUrls(output)) {
        const httpStatus = await tryFetch(url)
        if (httpStatus !== null && httpStatus >= 200 && httpStatus < 400) {
          const boot: BootResult = { status: 'pass', available: true, url, httpStatus, durationMs: Date.now() - start }
          // The hook runs inside the try, so the finally below still kills the server if it throws.
          return onReady ? { boot, ready: await onReady(url) } : { boot }
        }
        if (httpStatus !== null) {
          lastErrorStatus = httpStatus
        }
      }
      await sleep(1500)
    }
    if (lastErrorStatus !== null) {
      return {
        boot: {
          status: 'fail',
          available: true,
          httpStatus: lastErrorStatus,
          durationMs: Date.now() - start,
          note: `dev server kept responding with HTTP ${lastErrorStatus} until the 60s deadline\n${tail(output, 15)}`,
        },
      }
    }
    return {
      boot: {
        status: 'fail',
        available: true,
        durationMs: Date.now() - start,
        note: announcedUrls(output).length
          ? `dev server printed a URL but did not respond within 60s\n${tail(output, 15)}`
          : `dev server did not print a localhost URL within 60s\n${tail(output, 15)}`,
      },
    }
  } finally {
    killProcessTree(child)
    untrackChild(child)
  }
}

// Match only URLs the dev server announces for itself. We never probe guessed ports, since
// an unrelated service already listening on 3000/5173 would otherwise read as a pass.
const LOCAL_URL_PATTERN = /https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)/g
const FRAMEWORK_LINE_PATTERN = /\bLocal:|\bready\b|started server on/i

/**
 * Pure: every localhost URL announced in dev-server output, one per port, normalised to
 * http://localhost:<port>. URLs on web-framework lines (`Local:`, `ready`, `started server
 * on`) come first so a Rust API announced earlier doesn't shadow the web app.
 */
export const announcedUrls = (output: string): string[] => {
  const preferred: string[] = []
  const others: string[] = []
  for (const line of stripAnsi(output).split('\n')) {
    for (const match of line.matchAll(LOCAL_URL_PATTERN)) {
      const url = `http://localhost:${match[1]}`
      const bucket = FRAMEWORK_LINE_PATTERN.test(line) ? preferred : others
      if (!preferred.includes(url) && !others.includes(url)) bucket.push(url)
    }
  }
  return [...preferred, ...others.filter((url) => !preferred.includes(url))]
}

const tryFetch = async (url: string): Promise<number | null> => {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2000)
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    return response.status
  } catch {
    return null
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
