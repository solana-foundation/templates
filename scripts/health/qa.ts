/**
 * Render QA (rung 1 of docs/agents/ui-testing-plan.md): open the booted dev server in a
 * headless browser, look at the page the way a person would, and flag the obvious visual
 * failures: framework error overlay, uncaught page error, blank page, console errors,
 * failed same-origin requests. Takes a full-page screenshot either way.
 *
 * Browser: puppeteer. It is already a devDependency (scripts/create-image.ts uses it), so
 * this adds no dependency. Playwright would be a small adapter swap: only `openPage` below
 * talks to the browser; `classifyRender` and the signal shape are browser-agnostic.
 *
 * `classifyRender` is pure so the verdict can be unit-tested without a browser.
 * `checkRender` never throws: launch failures and navigation timeouts come back as a
 * result with a clear note.
 */

import { mkdirSync } from 'fs'
import { join } from 'path'
import type { QaResult, Status, TemplateRef } from './types.js'

export type RenderSignals = {
  readonly consoleErrors: readonly string[]
  readonly pageErrors: readonly string[]
  readonly failedRequests: readonly string[]
  /** name of the error overlay found, null when none */
  readonly overlay: string | null
  readonly blank: boolean
}

export type RenderVerdict = { status: Status; reasons: string[] }

/**
 * overlay / page error / blank page -> fail (the page is visibly broken).
 * console errors or failed requests only -> warn (it rendered, but something is off).
 * nothing -> pass.
 */
export const classifyRender = (signals: RenderSignals): RenderVerdict => {
  const hard: string[] = []
  const soft: string[] = []
  if (signals.overlay) hard.push(`error overlay: ${signals.overlay}`)
  if (signals.pageErrors.length) hard.push(`${signals.pageErrors.length} uncaught page error(s)`)
  if (signals.blank) hard.push('blank page (no visible text or graphics)')
  if (signals.consoleErrors.length) soft.push(`${signals.consoleErrors.length} console error(s)`)
  if (signals.failedRequests.length) soft.push(`${signals.failedRequests.length} failed same-origin request(s)`)
  if (hard.length) return { status: 'fail', reasons: [...hard, ...soft] }
  if (soft.length) return { status: 'warn', reasons: soft }
  return { status: 'pass', reasons: [] }
}

export type RenderOptions = {
  /** report output dir; screenshots land in `<outDir>/screenshots/` */
  readonly outDir: string
  /** page.goto timeout (default 30s) */
  readonly navigationTimeoutMs?: number
  /** how long to let the page settle after load before reading signals (default 1.5s) */
  readonly settleMs?: number
  readonly viewport?: { readonly width: number; readonly height: number }
}

const DEFAULT_NAVIGATION_TIMEOUT_MS = 30_000
const DEFAULT_SETTLE_MS = 1_500
const BROWSER_CLOSE_TIMEOUT_MS = 5_000
const MAX_SAMPLES = 20
const MAX_SAMPLE_CHARS = 300
const BLANK_TEXT_THRESHOLD = 20

/** Screenshot file name for a template id: "kit/nextjs" -> "kit__nextjs.png". */
export const screenshotName = (templateId: string): string => `${templateId.replace(/\//g, '__')}.png`

/** Requests that are noise, not template problems: favicon and the dev servers' hot-reload channels. */
const IGNORED_REQUEST_PATHS = [/favicon/i, /\/_next\/webpack-hmr/, /\/__nextjs/, /\/@vite\//, /\/__vite/, /hot-update/]

/** True for a same-origin request that is worth reporting when it fails. */
export const isReportableRequest = (requestUrl: string, pageUrl: string): boolean => {
  let request: URL
  let page: URL
  try {
    request = new URL(requestUrl)
    page = new URL(pageUrl)
  } catch {
    return false
  }
  if (request.origin !== page.origin) return false
  return !IGNORED_REQUEST_PATHS.some((pattern) => pattern.test(request.pathname))
}

const sample = (text: string): string => text.replace(/\s+/g, ' ').trim().slice(0, MAX_SAMPLE_CHARS)

const pushSample = (list: string[], text: string): void => {
  if (list.length < MAX_SAMPLES) list.push(sample(text))
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type Inspected = { overlay: string | null; textLength: number; hasGraphics: boolean }

/**
 * Runs inside the page, so it is plain JS in a string (the scripts tsconfig has no DOM lib,
 * and a string survives any transpiler rewrite of a function body).
 */
const INSPECT_SCRIPT = `(() => {
  const ERROR_TEXT = /Unhandled Runtime Error|Runtime Error|Build Error|Failed to compile|Internal Server Error/i
  let overlay = null
  // Next.js mounts <nextjs-portal> in dev even when healthy (it hosts the dev indicator),
  // so its presence alone means nothing: read its shadow root for an open error dialog.
  const portal = document.querySelector('nextjs-portal')
  if (portal) {
    const root = portal.shadowRoot
    const text = ((root && root.textContent) || portal.textContent || '').replace(/\\s+/g, ' ')
    const dialog = root && root.querySelector('[data-nextjs-dialog], [data-nextjs-dialog-overlay]')
    const match = text.match(ERROR_TEXT)
    if (dialog || match) overlay = 'nextjs: ' + (match ? match[0] : 'error dialog')
  }
  // Vite only mounts <vite-error-overlay> when there is an error.
  if (!overlay && document.querySelector('vite-error-overlay')) overlay = 'vite: vite-error-overlay'
  const bodyText = (document.body && document.body.innerText ? document.body.innerText : '').replace(/\\s+/g, ' ')
  // Fallback for frameworks that render the error as plain text in the document.
  if (!overlay) {
    const match = bodyText.match(/Unhandled Runtime Error|Build Error|Failed to compile/i)
    if (match) overlay = 'page text: ' + match[0]
  }
  const hasGraphics = Boolean(document.querySelector('img, canvas, svg, video'))
  return { overlay, textLength: bodyText.trim().length, hasGraphics }
})()`

/**
 * Open `url` in a headless browser, collect render signals, screenshot it, classify.
 * Never throws. Browser launch failure -> skip (environment). Navigation timeout or any
 * other error while the page is open -> fail with the error in `note`.
 */
export const checkRender = async (url: string, ref: TemplateRef, opts: RenderOptions): Promise<QaResult> => {
  const start = Date.now()
  const navigationTimeoutMs = opts.navigationTimeoutMs ?? DEFAULT_NAVIGATION_TIMEOUT_MS
  const settleMs = opts.settleMs ?? DEFAULT_SETTLE_MS
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const failedRequests: string[] = []
  const empty = { consoleErrors, pageErrors, failedRequests, blank: false } as const

  let puppeteer: typeof import('puppeteer').default
  let browser: import('puppeteer').Browser
  try {
    puppeteer = (await import('puppeteer')).default
    browser = await puppeteer.launch({
      headless: true,
      // Sandboxing is what makes headless Chrome safe to point at arbitrary pages; only
      // drop it on CI runners, where the container usually forbids the sandbox.
      args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
    })
  } catch (error) {
    return {
      status: 'skip',
      available: false,
      url,
      ...empty,
      durationMs: Date.now() - start,
      note: `could not launch a headless browser: ${sample(String(error))}`,
    }
  }

  let screenshot: string | undefined
  let signals: RenderSignals | undefined
  let note: string | undefined
  try {
    // Hard ceiling on the whole page session: a hung renderer must not stall the run.
    const ceilingMs = navigationTimeoutMs + settleMs + 15_000
    const session = (async (): Promise<RenderSignals> => {
      const page = await browser.newPage()
      await page.setViewport(opts.viewport ?? { width: 1280, height: 800 })
      page.on('console', (message) => {
        const type = message.type()
        const text = message.text()
        // Chrome logs every failed resource load as a console error too. Those are already
        // tracked (and filtered for noise like favicon) by the response/requestfailed hooks.
        if (/^Failed to load resource/.test(text)) return
        if (type === 'error' || (type === 'warn' && /hydrat/i.test(text))) pushSample(consoleErrors, text)
      })
      page.on('pageerror', (error) => pushSample(pageErrors, error.message || String(error)))
      page.on('response', (response) => {
        const requestUrl = response.url()
        if (response.status() >= 400 && isReportableRequest(requestUrl, url))
          pushSample(failedRequests, `${response.status()} ${new URL(requestUrl).pathname}`)
      })
      page.on('requestfailed', (request) => {
        const reason = request.failure()?.errorText ?? 'failed'
        // ERR_ABORTED is the browser cancelling its own request (navigation, HMR), not a server fault.
        if (reason === 'net::ERR_ABORTED') return
        if (isReportableRequest(request.url(), url))
          pushSample(failedRequests, `${reason} ${new URL(request.url()).pathname}`)
      })

      await page.goto(url, { waitUntil: 'load', timeout: navigationTimeoutMs })
      // Let the app hydrate and fire its initial requests; don't fail on a long-poll that never idles.
      await page.waitForNetworkIdle({ idleTime: 500, timeout: settleMs * 2 }).catch(() => undefined)
      await sleep(settleMs)

      const inspected = (await page.evaluate(INSPECT_SCRIPT)) as Inspected
      const blank = inspected.textLength < BLANK_TEXT_THRESHOLD && !inspected.hasGraphics

      const screenshotDir = join(opts.outDir, 'screenshots')
      mkdirSync(screenshotDir, { recursive: true })
      const fileName = screenshotName(ref.id)
      await page.screenshot({ path: join(screenshotDir, fileName), fullPage: true })
      screenshot = `screenshots/${fileName}`

      return { consoleErrors, pageErrors, failedRequests, overlay: inspected.overlay, blank }
    })()
    let ceiling: NodeJS.Timeout | undefined
    signals = await Promise.race([
      session,
      new Promise<never>((_, reject) => {
        ceiling = setTimeout(() => reject(new Error(`render check exceeded ${ceilingMs}ms`)), ceilingMs)
      }),
    ]).finally(() => clearTimeout(ceiling))
  } catch (error) {
    note = sample(String(error))
  } finally {
    await closeBrowser(browser)
  }

  if (!signals) {
    return {
      status: 'fail',
      available: true,
      url,
      screenshot,
      ...empty,
      durationMs: Date.now() - start,
      note: `page did not load cleanly: ${note ?? 'unknown error'}`,
    }
  }
  const verdict = classifyRender(signals)
  return {
    status: verdict.status,
    available: true,
    url,
    screenshot,
    consoleErrors: signals.consoleErrors,
    pageErrors: signals.pageErrors,
    failedRequests: signals.failedRequests,
    overlay: signals.overlay ?? undefined,
    blank: signals.blank,
    durationMs: Date.now() - start,
    note: verdict.reasons.length ? verdict.reasons.join('; ') : undefined,
  }
}

/** Close the browser, and SIGKILL it if close() hangs, so the boot window can always end. */
const closeBrowser = async (browser: import('puppeteer').Browser): Promise<void> => {
  let timer: NodeJS.Timeout | undefined
  const forceKill = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      try {
        browser.process()?.kill('SIGKILL')
      } catch {
        /* already gone */
      }
      resolve()
    }, BROWSER_CLOSE_TIMEOUT_MS)
  })
  await Promise.race([browser.close().catch(() => undefined), forceKill])
  clearTimeout(timer)
}
