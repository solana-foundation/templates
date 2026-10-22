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
  /** how many page errors fired in total; more than pageErrors.length means the sample was truncated */
  readonly pageErrorsTotal: number
  readonly failedRequests: readonly string[]
  /** name of the error overlay found, null when none */
  readonly overlay: string | null
  /** bounded visible text of that overlay (first ~500 chars), null when none */
  readonly overlayText: string | null
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

// ---------- requires-configuration causation (pure, unit-tested) ----------

export type ConfigCause = {
  /** the declared, unsupplied env var the failure traces to */
  readonly key: string
  readonly source: 'page error' | 'console error' | 'overlay'
  readonly message: string
}

/** A configuration cause plus every hard signal (page error, overlay, blank page, harness failure) it does NOT explain. */
export type ConfigVerdict = { readonly cause: ConfigCause; readonly unexplained: readonly string[] }

/** Framework prefixes that carry no meaning of their own when matching a key against an error message. */
const PUBLIC_PREFIX = /^(NEXT_PUBLIC_|VITE_|PUBLIC_|EXPO_PUBLIC_|REACT_APP_|NUXT_PUBLIC_)/
/** Single words too generic to tie an error to one env var (every Solana template mentions "solana"). */
const GENERIC_STEM_WORDS = new Set(['solana', 'next', 'nextjs', 'vite', 'expo', 'react', 'public', 'node', 'env'])
/**
 * The wording that says a value is absent, as token sequences. A shortened key form only
 * counts when one of these sits within MISSING_WORDING_WINDOW tokens of it, in the same clause.
 */
const MISSING_WORDING: readonly (readonly string[])[] = [
  ['is', 'required'],
  ['required'],
  ['missing'],
  ['not', 'set'],
  ['not', 'configured'],
  ['not', 'provided'],
  ['must', 'be', 'set'],
  ['must', 'be', 'provided'],
  ['must', 'be', 'defined'],
  ['was', 'not', 'found'],
]
const MISSING_WORDING_WINDOW = 6
/** Clause boundaries inside one message: sentence punctuation followed by space, newlines, " - ". */
const CLAUSE_BOUNDARY = /[.;:]\s+|\r?\n| - /
/**
 * A JavaScript undefined-binding error ("network is not defined") is a code defect that
 * happens to share a word with a key, never evidence of missing configuration. It can only
 * match the full key name (a template's own guard: "NEXT_PUBLIC_SOLANA_NETWORK is not defined").
 */
const UNDEFINED_BINDING = /\bis not defined\b|ReferenceError|Cannot access .* before initialization/
const MIN_WORD_STEM_LENGTH = 4

/** Lowercase alphanumeric tokens: "NetworkError when..." -> ["networkerror", "when", ...]. */
const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0)

/** Start indexes at which `needle` (a token sequence) appears contiguously in `tokens`, whole tokens only. */
const findTokenSequence = (tokens: readonly string[], needle: readonly string[]): number[] => {
  const starts: number[] = []
  if (needle.length === 0 || needle.length > tokens.length) return starts
  for (let i = 0; i + needle.length <= tokens.length; i++) {
    let j = 0
    while (j < needle.length && tokens[i + j] === needle[j]) j++
    if (j === needle.length) starts.push(i)
  }
  return starts
}

/** Tokens between two token spans [aStart, aStart+aLength) and [bStart, bStart+bLength); 0 when adjacent or overlapping. */
const tokenGap = (aStart: number, aLength: number, bStart: number, bLength: number): number =>
  Math.max(0, bStart - (aStart + aLength), aStart - (bStart + bLength))

/**
 * True when a shortened stem and missing-value wording occur in the same clause of the
 * message, within MISSING_WORDING_WINDOW tokens of each other. "Missing wallet provider;
 * appId is configured" has both words, but in different clauses, so it is not a mention.
 */
const stemNearMissingWording = (message: string, stem: readonly string[]): boolean =>
  message.split(CLAUSE_BOUNDARY).some((clause) => {
    const tokens = tokenize(clause)
    const stemStarts = findTokenSequence(tokens, stem)
    if (stemStarts.length === 0) return false
    return MISSING_WORDING.some((wording) =>
      findTokenSequence(tokens, wording).some((wordingStart) =>
        stemStarts.some(
          (stemStart) => tokenGap(stemStart, stem.length, wordingStart, wording.length) <= MISSING_WORDING_WINDOW,
        ),
      ),
    )
  })

/** A word list as both a token sequence ("app id") and one joined token ("appid" / camelCase appId). */
const forms = (words: readonly string[]): string[] =>
  words.length > 1 ? [words.join(' '), words.join('')] : [...words]

/**
 * The spellings an error message might use for an env var, as space-separated token
 * sequences that must match whole tokens (never substrings: "NetworkError" is not NETWORK,
 * "Unsupported" is not PORT). `exact` is the full key name, which counts as a mention on
 * its own. `partial` is every shortened form, which only counts next to missing-value
 * wording: the prefix-free name ("phantom app id" / "phantomappid"), each adjacent word
 * pair ("app id" / "appid"), and each distinctive single word ("phantom").
 */
export const configKeyStems = (key: string): { exact: string[]; partial: string[] } => {
  const words = tokenize(key)
  const stripped = tokenize(key.replace(PUBLIC_PREFIX, ''))
  const exact = new Set<string>(forms(words))
  const partial = new Set<string>()
  if (stripped.length > 1) {
    for (const form of forms(stripped)) partial.add(form)
    for (let i = 0; i + 1 < stripped.length; i++) for (const form of forms(stripped.slice(i, i + 2))) partial.add(form)
  }
  for (const word of stripped) {
    if (word.length >= MIN_WORD_STEM_LENGTH && !GENERIC_STEM_WORDS.has(word)) partial.add(word)
  }
  for (const form of exact) partial.delete(form)
  return { exact: [...exact], partial: [...partial] }
}

/**
 * The full key name as an identifier: case-insensitive, but bounded by non-identifier
 * characters on both sides, so NEXT_PUBLIC_PHANTOM_APP_ID never matches inside
 * NEXT_PUBLIC_PHANTOM_APP_ID_SUFFIX. Also accepts the same name with the separators
 * dropped or swapped for dashes/spaces ("phantom-app-id", "PHANTOM APP ID") as whole words.
 */
const mentionsExactKey = (message: string, key: string): boolean => {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (new RegExp(`(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`, 'i').test(message)) return true
  const loose = key
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[-_ ]?')
  return new RegExp(`(?<![A-Za-z0-9_])${loose}(?![A-Za-z0-9_])`, 'i').test(message)
}

const SNAKE_IDENTIFIER = /(?<![A-Za-z0-9_])[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)+(?![A-Za-z0-9_])/g

const namesForeignIdentifier = (message: string, declaredKeys: readonly string[]): boolean => {
  // A declared key is known in full and in its prefix-free form (SUPABASE_URL for
  // NEXT_PUBLIC_SUPABASE_URL); anything else written as an identifier is foreign.
  const declared = new Set(
    declaredKeys.flatMap((key) => [key.toUpperCase(), key.replace(PUBLIC_PREFIX, '').toUpperCase()]),
  )
  return Array.from(message.matchAll(SNAKE_IDENTIFIER)).some((match) => !declared.has(match[0].toUpperCase()))
}

/** Longest shortened form of `key` (in tokens) that sits next to missing-value wording; 0 when none. */
const partialMatchStrength = (message: string, key: string): number =>
  configKeyStems(key).partial.reduce((best, stem) => {
    const parts = stem.split(' ')
    return parts.length > best && stemNearMissingWording(message, parts) ? parts.length : best
  }, 0)

/**
 * Does this message blame `key`? The full key name counts anywhere. A shortened form only
 * counts next to missing-value wording, never for an undefined JavaScript binding, never when
 * the message names a DIFFERENT declared key in full, and only when no other declared key
 * that WAS supplied matches at least as strongly: "Supabase URL is required" is about the
 * supplied NEXT_PUBLIC_SUPABASE_URL (two tokens), not about an unsupplied
 * NEXT_PUBLIC_SUPABASE_ANON_KEY that only shares "supabase".
 */
const mentionsKey = (
  message: string,
  key: string,
  declaredKeys: readonly string[] = [],
  unsuppliedKeys: readonly string[] = [key],
): boolean => {
  if (mentionsExactKey(message, key)) return true
  if (declaredKeys.some((other) => other !== key && mentionsExactKey(message, other))) return false
  if (UNDEFINED_BINDING.test(message)) return false
  // The message names a SCREAMING_SNAKE identifier that is not a declared key (for example
  // NEXT_PUBLIC_PHANTOM_APP_ID_SUFFIX): it is about that identifier, so no shortened form of a
  // declared key may claim it.
  if (namesForeignIdentifier(message, declaredKeys.length ? declaredKeys : [key])) return false
  const strength = partialMatchStrength(message, key)
  if (strength === 0) return false
  const supplied = declaredKeys.filter((other) => other !== key && !unsuppliedKeys.includes(other))
  return supplied.every((other) => partialMatchStrength(message, other) < strength)
}

const causeIn = (
  source: ConfigCause['source'],
  messages: readonly string[],
  unsuppliedKeys: readonly string[],
  declaredKeys: readonly string[],
): ConfigCause | null => {
  for (const message of messages) {
    // Rank the candidates: a full-name mention beats any shortened form, a longer shortened
    // form beats a shorter one, so "Supabase anon key is required" names the ANON_KEY even
    // when SUPABASE_URL is declared first.
    const ranked = unsuppliedKeys
      .filter((candidate) => mentionsKey(message, candidate, declaredKeys, unsuppliedKeys))
      .map((candidate) => ({
        key: candidate,
        rank: mentionsExactKey(message, candidate) ? Number.MAX_SAFE_INTEGER : partialMatchStrength(message, candidate),
      }))
      .sort((a, b) => b.rank - a.rank)
    if (ranked.length) return { key: ranked[0].key, source, message }
  }
  return null
}

type ConfigSignals = Pick<
  QaResult,
  | 'pageErrors'
  | 'pageErrorsTotal'
  | 'consoleErrors'
  | 'overlay'
  | 'overlayText'
  | 'blank'
  | 'failedRequests'
  | 'harnessError'
>

/** Dialog titles that precede the actual error message in an overlay. */
const OVERLAY_TITLE = /(Unhandled Runtime Error|Runtime Error|Build Error|Console Error|Failed to compile)/
/**
 * Where an overlay stops being the message and becomes a code frame or stack: a source path
 * with a position ("src/foo.tsx (29:5)", "./app/page.tsx:12:3"), a stack line ("at fn (file:1:2)"),
 * a numbered code line ("> 29 |", "27 |"), or the "Call Stack" / "Source" section headings.
 */
const OVERLAY_FRAME_MARKERS: readonly RegExp[] = [
  /\S+\.(?:[cm]?[jt]sx?|vue|svelte)\s*(?:\(\d+:\d+\)|:\d+:\d+)/,
  /\bat\s+(?:\S+\s+)?\(?\S+:\d+:\d+/,
  /(?:^|\s)>?\s*\d+\s*\|/,
  /\bCall Stack\b/,
  /\bSource\b/,
]

/**
 * The part of an overlay's text that is the error message: the leading dialog title (and
 * anything before it, such as the dev indicator's version line) stripped, and everything
 * from the first code-frame or stack marker dropped. Only this part is matched against
 * configuration keys, so a source excerpt that happens to read `process.env.SOME_KEY` under
 * an unrelated TypeError cannot explain the failure. The full text stays in the report.
 */
export const overlayMessage = (overlayText: string): string => {
  let text = overlayText
  const title = text.match(OVERLAY_TITLE)
  if (title && title.index !== undefined) text = text.slice(title.index + title[0].length)
  let cut = text.length
  for (const marker of OVERLAY_FRAME_MARKERS) {
    const match = text.match(marker)
    if (match && match.index !== undefined && match.index < cut) cut = match.index
  }
  return text.slice(0, cut).trim()
}

/** The overlay's evidence for matching: its message when text was captured, else its short label. */
const overlayMessages = (qa: ConfigSignals): string[] => {
  if (!qa.overlay) return []
  const message = qa.overlayText ? overlayMessage(qa.overlayText) : ''
  return [message || qa.overlay]
}

/**
 * The first page error, console error or overlay text that references one of the template's
 * declared env vars that received no value in this run. Null when nothing ties the failure
 * to a missing value. Same causation rule as the build-phase setup skip.
 */
export const missingConfigCause = (
  qa: ConfigSignals,
  unsuppliedKeys: readonly string[],
  declaredKeys: readonly string[] = unsuppliedKeys,
): ConfigCause | null => {
  if (unsuppliedKeys.length === 0) return null
  return (
    causeIn('page error', qa.pageErrors, unsuppliedKeys, declaredKeys) ??
    causeIn('console error', qa.consoleErrors, unsuppliedKeys, declaredKeys) ??
    causeIn('overlay', overlayMessages(qa), unsuppliedKeys, declaredKeys)
  )
}

/**
 * Whether missing configuration explains a QA failure: there is a cause, and every HARD
 * signal is one of its symptoms. Each page error and the overlay text must themselves
 * reference an unsupplied key; a blank page, or a failure the harness raised (navigation
 * timeout, unreachable server, inspection error) can never be explained, whatever else was
 * collected before it. Console errors never block: they only warn. Null when there is no cause.
 */
export const explainByConfig = (
  qa: ConfigSignals & { readonly note?: string },
  unsuppliedKeys: readonly string[],
  declaredKeys: readonly string[] = unsuppliedKeys,
): ConfigVerdict | null => {
  const cause = missingConfigCause(qa, unsuppliedKeys, declaredKeys)
  if (!cause) return null
  const explained = (message: string) =>
    unsuppliedKeys.some((key) => mentionsKey(message, key, declaredKeys, unsuppliedKeys))
  const unexplained: string[] = []
  for (const error of qa.pageErrors) if (!explained(error)) unexplained.push(`page error: ${error}`)
  for (const text of overlayMessages(qa)) if (!explained(text)) unexplained.push(`overlay: ${qa.overlay}`)
  if (qa.blank) unexplained.push('blank page')
  // Only the first MAX_SAMPLES page errors are kept: an unrelated one past that could be hiding.
  const pageErrorsTotal = qa.pageErrorsTotal ?? qa.pageErrors.length
  if (pageErrorsTotal > qa.pageErrors.length)
    unexplained.push(`evidence truncated (${pageErrorsTotal} page errors, ${qa.pageErrors.length} kept)`)
  if (qa.harnessError) unexplained.push(`harness: ${qa.harnessError}`)
  else if (
    classifyRender({
      ...qa,
      pageErrorsTotal,
      overlay: qa.overlay ?? null,
      overlayText: qa.overlayText ?? null,
    }).status !== 'fail'
  )
    unexplained.push(qa.note ?? 'failure raised outside the page signals')
  return { cause, unexplained }
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
const FAILURE_SCREENSHOT_TIMEOUT_MS = 5_000
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

/**
 * Bounded sample of a collected string. Newlines are kept: the configuration matcher reads
 * them as clause boundaries ("Missing wallet provider\nappId is configured" is two clauses).
 * Reports flatten with `oneLine` when they render.
 */
const sample = (text: string): string =>
  text
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\r?\n\s*/g, '\n')
    .trim()
    .slice(0, MAX_SAMPLE_CHARS)

/** A sample flattened to one line for notes and report lines. */
export const oneLine = (text: string): string => text.replace(/\s+/g, ' ').trim()

const pushSample = (list: string[], text: string): void => {
  if (list.length < MAX_SAMPLES) list.push(sample(text))
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type Inspected = { overlay: string | null; overlayText: string | null; textLength: number; hasGraphics: boolean }

/**
 * Runs inside the page, so it is plain JS in a string (the scripts tsconfig has no DOM lib,
 * and a string survives any transpiler rewrite of a function body).
 */
const INSPECT_SCRIPT = `(() => {
  const ERROR_TEXT = /Unhandled Runtime Error|Runtime Error|Build Error|Failed to compile|Internal Server Error/i
  // Only elements that actually paint count, for graphics and for dev dialogs alike: an SVG
  // sprite sheet or a display:none image must not rescue a visibly blank page, and a dialog
  // the framework keeps mounted but hidden is not an open error overlay.
  const paints = (el) => {
    if (!el.isConnected) return false
    const box = el.getBoundingClientRect()
    if (box.width <= 0 || box.height <= 0) return false
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
    }
    const style = getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0
  }
  const MAX_OVERLAY_TEXT = 500
  // Block-level structure survives as newlines: innerText already breaks between blocks, and a
  // shadow root (no innerText of its own) joins its children with newlines instead of running
  // "message" straight into "file name" the way textContent would.
  const blockText = (node) => {
    if (!node) return ''
    // An element's innerText is the rendered text, empty included: a blank body with hidden
    // text or inline scripts must stay empty, never fall through to its hidden children.
    if (typeof node.innerText === 'string') return node.innerText
    return Array.from(node.children || [])
      .map(blockText)
      .filter(Boolean)
      .join('\\n')
  }
  const visibleText = (node) =>
    blockText(node)
      .replace(/[ \\t]+/g, ' ')
      .replace(/\\s*\\n\\s*/g, '\\n')
      .trim()
  let overlay = null
  let overlayText = null
  // Next.js mounts <nextjs-portal> in dev even when healthy: it hosts the dev indicator badge
  // ("N Issues" after console errors) and can keep dialog markup mounted while closed. Only a
  // dialog that is open and visible is an error overlay; the badge alone is not (the console
  // errors behind it are still collected and warn on their own).
  const portal = document.querySelector('nextjs-portal')
  const root = portal && portal.shadowRoot
  if (root) {
    const dialogs = Array.from(
      root.querySelectorAll('[data-nextjs-dialog-overlay], [data-nextjs-dialog], [role="dialog"]'),
    ).filter(paints)
    if (dialogs.length) {
      // Outermost visible dialog first, so its text covers the nested ones without repeating.
      const dialogText = dialogs
        .filter((el) => !dialogs.some((other) => other !== el && other.contains(el)))
        .map(visibleText)
        .join('\\n')
      const match = dialogText.match(ERROR_TEXT) || (root.textContent || '').match(ERROR_TEXT)
      overlay = 'nextjs: ' + (match ? match[0] : 'error dialog')
      overlayText = dialogText.slice(0, MAX_OVERLAY_TEXT)
    }
  }
  // Vite only mounts <vite-error-overlay> when there is an error.
  const vite = !overlay && document.querySelector('vite-error-overlay')
  if (vite) {
    overlay = 'vite: vite-error-overlay'
    // Vite renders the message and the file location as separate elements; read them apart
    // so the location never fuses onto the message's last word.
    const viteRoot = vite.shadowRoot || vite
    const parts = ['.message', '.file', '.frame'].map((selector) => viteRoot.querySelector(selector)).filter(Boolean)
    overlayText = (parts.length ? parts.map(visibleText).filter(Boolean).join('\\n') : visibleText(viteRoot)).slice(
      0,
      MAX_OVERLAY_TEXT,
    )
  }
  const bodyBlocks = document.body ? visibleText(document.body) : ''
  const bodyText = bodyBlocks.replace(/\\s+/g, ' ')
  // Fallback for frameworks that render the error as plain text in the document.
  if (!overlay) {
    const match = bodyBlocks.match(/Unhandled Runtime Error|Build Error|Failed to compile/i)
    if (match) {
      overlay = 'page text: ' + match[0]
      overlayText = bodyBlocks.slice(Math.max(0, match.index - 100), match.index + MAX_OVERLAY_TEXT).trim()
    }
  }
  const hasGraphics = Array.from(document.querySelectorAll('img, canvas, svg, video')).some(paints)
  return { overlay, overlayText: overlayText || null, textLength: bodyText.trim().length, hasGraphics }
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
  let pageErrorsTotal = 0
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
      note: `could not launch a headless browser: ${oneLine(sample(String(error)))}`,
    }
  }

  let screenshot: string | undefined
  let signals: RenderSignals | undefined
  let note: string | undefined
  // Kept outside the session so a failed navigation can still be screenshotted in the catch.
  let page: import('puppeteer').Page | undefined
  try {
    // Hard ceiling on the whole page session: a hung renderer must not stall the run.
    const ceilingMs = navigationTimeoutMs + settleMs + 15_000
    const session = (async (): Promise<RenderSignals> => {
      page = await browser.newPage()
      await page.setViewport(opts.viewport ?? { width: 1280, height: 800 })
      page.on('console', (message) => {
        const type = message.type()
        const text = message.text()
        // Chrome logs every failed resource load as a console error too. Those are already
        // tracked (and filtered for noise like favicon) by the response/requestfailed hooks.
        if (/^Failed to load resource/.test(text)) return
        if (type !== 'error' && !(type === 'warn' && /hydrat/i.test(text))) return
        // `console.error(new Error(...))` prints as "JSHandle@error": resolve the real messages
        // from the arguments so the report says what broke, not that something did.
        if (!/JSHandle@/.test(text)) {
          pushSample(consoleErrors, text)
          return
        }
        void Promise.all(
          message
            .args()
            .map((arg) =>
              arg
                .evaluate((value: unknown) =>
                  value instanceof Error ? `${value.name}: ${value.message}` : String(value),
                )
                .catch(() => 'JSHandle@error'),
            ),
        ).then((parts) => pushSample(consoleErrors, parts.join(' ')))
      })
      page.on('pageerror', (error) => {
        pageErrorsTotal++
        pushSample(pageErrors, error.message || String(error))
      })
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

      screenshot = await takeScreenshot(page, opts.outDir, ref.id)

      return {
        consoleErrors,
        pageErrors,
        pageErrorsTotal,
        failedRequests,
        overlay: inspected.overlay,
        overlayText: inspected.overlayText,
        blank,
      }
    })()
    let ceiling: NodeJS.Timeout | undefined
    signals = await Promise.race([
      session,
      new Promise<never>((_, reject) => {
        ceiling = setTimeout(() => reject(new Error(`render check exceeded ${ceilingMs}ms`)), ceilingMs)
      }),
    ]).finally(() => clearTimeout(ceiling))
  } catch (error) {
    note = oneLine(sample(String(error)))
    // Best effort, bounded: whatever the page shows after a failed or timed-out navigation
    // is exactly the evidence a failure report needs. Never let it stall the boot window.
    if (page && !screenshot) {
      let timer: NodeJS.Timeout | undefined
      screenshot = await Promise.race([
        takeScreenshot(page, opts.outDir, ref.id).catch(() => undefined),
        new Promise<undefined>((resolve) => {
          timer = setTimeout(() => resolve(undefined), FAILURE_SCREENSHOT_TIMEOUT_MS)
        }),
      ]).finally(() => clearTimeout(timer))
    }
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
      pageErrorsTotal,
      harnessError: note ?? 'unknown error',
      durationMs: Date.now() - start,
      note: `page did not load cleanly: ${note ?? 'unknown error'}${
        screenshot ? ' (screenshot captured after the failed navigation)' : ' (no screenshot could be captured)'
      }`,
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
    pageErrorsTotal: signals.pageErrorsTotal,
    failedRequests: signals.failedRequests,
    overlay: signals.overlay ?? undefined,
    overlayText: signals.overlayText ?? undefined,
    blank: signals.blank,
    durationMs: Date.now() - start,
    note: verdict.reasons.length ? verdict.reasons.join('; ') : undefined,
  }
}

/** Full-page screenshot to `<outDir>/screenshots/<id>.png`; returns the report-relative path. */
const takeScreenshot = async (page: import('puppeteer').Page, outDir: string, templateId: string): Promise<string> => {
  const screenshotDir = join(outDir, 'screenshots')
  mkdirSync(screenshotDir, { recursive: true })
  const fileName = screenshotName(templateId)
  await page.screenshot({ path: join(screenshotDir, fileName), fullPage: true })
  return `screenshots/${fileName}`
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
