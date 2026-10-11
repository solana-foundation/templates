import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer, type Server } from 'node:http'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  checkRender,
  classifyRender,
  configKeyStems,
  explainByConfig,
  isReportableRequest,
  missingConfigCause,
  overlayMessage,
  screenshotName,
  type RenderSignals,
} from './qa.js'
import { diffReports, skipReason } from './report.js'
import { overallStatus, templateStatus } from './status.js'
import type { HealthReport, QaResult, Status, TemplateRef, TemplateReport } from './types.js'

const signals = (partial: Partial<RenderSignals> = {}): RenderSignals => ({
  consoleErrors: [],
  pageErrors: [],
  pageErrorsTotal: 0,
  failedRequests: [],
  overlay: null,
  overlayText: null,
  blank: false,
  ...partial,
})

test('clean render passes with no reasons', () => {
  assert.deepEqual(classifyRender(signals()), { status: 'pass', reasons: [] })
})

test('an error overlay is a fail', () => {
  const verdict = classifyRender(signals({ overlay: 'nextjs: Build Error' }))
  assert.equal(verdict.status, 'fail')
  assert.match(verdict.reasons.join(), /overlay: nextjs: Build Error/)
})

test('an uncaught page error is a fail', () => {
  const verdict = classifyRender(signals({ pageErrors: ['boom'] }))
  assert.equal(verdict.status, 'fail')
  assert.match(verdict.reasons.join(), /1 uncaught page error/)
})

test('a blank page is a fail', () => {
  const verdict = classifyRender(signals({ blank: true }))
  assert.equal(verdict.status, 'fail')
  assert.match(verdict.reasons.join(), /blank page/)
})

test('console errors or failed requests alone only warn', () => {
  assert.equal(classifyRender(signals({ consoleErrors: ['Warning: hydration mismatch'] })).status, 'warn')
  assert.equal(classifyRender(signals({ failedRequests: ['404 /missing.js'] })).status, 'warn')
  const both = classifyRender(signals({ consoleErrors: ['x'], failedRequests: ['y'] }))
  assert.equal(both.status, 'warn')
  assert.equal(both.reasons.length, 2)
})

test('a hard failure keeps the soft reasons as evidence', () => {
  const verdict = classifyRender(signals({ blank: true, consoleErrors: ['x'] }))
  assert.equal(verdict.status, 'fail')
  assert.equal(verdict.reasons.length, 2)
})

test('only same-origin, non-noise requests are reportable', () => {
  const page = 'http://localhost:3000'
  assert.equal(isReportableRequest('http://localhost:3000/api/thing', page), true)
  assert.equal(isReportableRequest('http://localhost:3000/favicon.ico', page), false)
  assert.equal(isReportableRequest('http://localhost:3000/_next/webpack-hmr', page), false)
  assert.equal(isReportableRequest('http://localhost:3000/@vite/client', page), false)
  assert.equal(isReportableRequest('https://api.devnet.solana.com/', page), false)
  assert.equal(isReportableRequest('not a url', page), false)
})

test('screenshot names flatten the template id', () => {
  assert.equal(screenshotName('kit/nextjs'), 'kit__nextjs.png')
  assert.equal(screenshotName('web3js/legacy/react-vite'), 'web3js__legacy__react-vite.png')
})

test('qa gates like boot: a qa fail fails the template and reads as a regression', () => {
  const report = (entries: Record<string, Status>): HealthReport =>
    ({ templates: Object.entries(entries).map(([id, status]) => ({ id, status })) }) as unknown as HealthReport
  const before = overallStatus(['pass', 'pass', 'pass'], ['pass'])
  const after = overallStatus(['pass', 'pass', 'fail'], ['pass'])
  assert.equal(after, 'fail')
  assert.deepEqual(diffReports(report({ 'kit/nextjs': after }), report({ 'kit/nextjs': before })).regressions, [
    'kit/nextjs',
  ])
  assert.equal(overallStatus(['pass', 'pass', 'warn'], ['pass']), 'warn')
})

// ---------- requires-configuration causation ----------

const PHANTOM_KEY = 'NEXT_PUBLIC_PHANTOM_APP_ID'
const PHANTOM_ERROR = 'appId is required when using embedded providers (google, apple, phantom, etc.)'

const qaOf = (partial: Partial<QaResult> = {}): QaResult => ({
  status: 'fail',
  available: true,
  consoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  blank: false,
  durationMs: 0,
  ...partial,
})

test('config key stems are whole-token forms: the full name, prefix-free forms, word pairs, distinctive words', () => {
  const { exact, partial } = configKeyStems(PHANTOM_KEY)
  assert.deepEqual(exact, ['next public phantom app id', 'nextpublicphantomappid'])
  for (const stem of ['phantom app id', 'phantomappid', 'phantom app', 'app id', 'appid', 'phantom'])
    assert.ok(partial.includes(stem), `partial stem ${stem}`)
  // short or ecosystem-wide words never become stems on their own
  const rpc = configKeyStems('NEXT_PUBLIC_SOLANA_RPC_URL')
  assert.ok(!rpc.partial.includes('solana'))
  assert.ok(!rpc.partial.includes('url'))
  assert.ok(rpc.partial.includes('rpc url'))
  assert.deepEqual(configKeyStems('PORT'), { exact: ['port'], partial: [] })
})

test('a page error naming an unsupplied declared key is a configuration cause', () => {
  const cause = missingConfigCause(qaOf({ pageErrors: [PHANTOM_ERROR], overlay: 'nextjs: Runtime Error' }), [
    PHANTOM_KEY,
    'NEXT_PUBLIC_SOLANA_RPC_URL',
  ])
  assert.deepEqual(cause, { key: PHANTOM_KEY, source: 'page error', message: PHANTOM_ERROR })
  // the literal key name is a mention on its own, in any case, from any signal
  assert.equal(
    missingConfigCause(qaOf({ consoleErrors: ['set next_public_phantom_app_id in .env'] }), [PHANTOM_KEY])?.source,
    'console error',
  )
  // the overlay matches on its captured text, not on its short label
  const overlay = qaOf({
    overlay: 'nextjs: Unhandled Runtime Error',
    overlayText: 'Unhandled Runtime Error Missing NEXT_PUBLIC_PHANTOM_APP_ID',
  })
  assert.equal(missingConfigCause(overlay, [PHANTOM_KEY])?.source, 'overlay')
  assert.equal(missingConfigCause(qaOf({ overlay: 'nextjs: Runtime Error' }), [PHANTOM_KEY]), null)
})

test('a declared key with an unrelated error stays a failure', () => {
  const unrelated = qaOf({
    pageErrors: ["Cannot read properties of undefined (reading 'publicKey')"],
    overlay: 'nextjs: Runtime Error',
  })
  assert.equal(missingConfigCause(unrelated, [PHANTOM_KEY]), null)
  // a shared word without any "required"/"missing" wording is not causation either
  assert.equal(missingConfigCause(qaOf({ consoleErrors: ['Phantom wallet not detected'] }), [PHANTOM_KEY]), null)
  assert.equal(
    missingConfigCause(qaOf({ consoleErrors: ['solana connection is required'] }), ['NEXT_PUBLIC_SOLANA_RPC_URL']),
    null,
  )
})

test('key names match whole tokens only, never substrings', () => {
  const networkError = qaOf({ pageErrors: ['NetworkError when attempting to fetch resource.'] })
  assert.equal(missingConfigCause(networkError, ['NEXT_PUBLIC_NETWORK']), null)
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['Unsupported operation'] }), ['PORT']), null)
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['Error: PORT is required'] }), ['PORT'])?.key, 'PORT')
  // the prefix-free name needs missing-value wording too; only the full key name stands alone
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['network: devnet'] }), ['NEXT_PUBLIC_NETWORK']), null)
  assert.equal(
    missingConfigCause(qaOf({ pageErrors: ['NEXT_PUBLIC_NETWORK: devnet'] }), ['NEXT_PUBLIC_NETWORK'])?.key,
    'NEXT_PUBLIC_NETWORK',
  )
})

test('a shortened stem only counts next to missing-value wording in the same clause', () => {
  const keys = [PHANTOM_KEY]
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['Missing wallet provider; appId is configured'] }), keys), null)
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['Missing wallet provider. appId was set'] }), keys), null)
  assert.equal(
    missingConfigCause(qaOf({ pageErrors: ['appId is required when using embedded providers'] }), keys)?.key,
    PHANTOM_KEY,
  )
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['Error: PORT is required'] }), ['PORT'])?.key, 'PORT')
  assert.equal(
    missingConfigCause(qaOf({ pageErrors: ['Config error. The phantom app id was not found'] }), keys)?.key,
    PHANTOM_KEY,
  )
  // same clause, but too far apart to be about the stem
  const far = 'phantom wallet adapter loaded with seven more words in between and then the rpc endpoint is required'
  assert.equal(missingConfigCause(qaOf({ pageErrors: [far] }), keys), null)
})

test('only the overlay message is matched, never its code frame or stack', () => {
  const phantomOverlay =
    '1/ 1 Next.js 16.3.4 (stale) Turbopack Runtime Error appId is required when using embedded providers (google, apple, phantom, etc.) src/provider/ConnectionProvider.tsx (29:5) @ ConnectionProvider 27 | 28 | return ( > 29 | <PhantomProvider | ^ 30 | config={{ Call Stack 52'
  assert.equal(
    overlayMessage(phantomOverlay),
    'appId is required when using embedded providers (google, apple, phantom, etc.)',
  )
  assert.equal(
    overlayMessage('Unhandled Runtime Error Missing NEXT_PUBLIC_PHANTOM_APP_ID'),
    'Missing NEXT_PUBLIC_PHANTOM_APP_ID',
  )
  assert.equal(
    overlayMessage('Build Error Module not found ./app/page.tsx:12:3 at build (x.js:1:2)'),
    'Module not found',
  )
  assert.equal(overlayMessage('Error: boom at render (file.tsx:4:5)'), 'Error: boom')
  const matched = qaOf({ overlay: 'nextjs: Runtime Error', overlayText: phantomOverlay })
  assert.deepEqual(explainByConfig(matched, [PHANTOM_KEY]), {
    cause: { key: PHANTOM_KEY, source: 'overlay', message: overlayMessage(phantomOverlay) },
    unexplained: [],
  })
  // the source excerpt under an unrelated TypeError names the key, but the message does not
  const framed = qaOf({
    pageErrors: ['NEXT_PUBLIC_SOLANA_NETWORK is required'],
    overlay: 'nextjs: Runtime Error',
    overlayText:
      "Runtime Error Cannot read properties of undefined (reading 'x') src/app/page.tsx (10:2) const n = process.env.NEXT_PUBLIC_SOLANA_NETWORK",
  })
  const verdict = explainByConfig(framed, ['NEXT_PUBLIC_SOLANA_NETWORK'])
  assert.equal(verdict?.cause.source, 'page error')
  assert.deepEqual(verdict?.unexplained, ['overlay: nextjs: Runtime Error'])
})

test('a newline is a clause boundary, and a truncated page-error sample blocks the downgrade', () => {
  const keys = [PHANTOM_KEY]
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['Missing wallet provider\nappId is configured'] }), keys), null)
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['Missing wallet provider\r\nappId is configured'] }), keys), null)
  const full = qaOf({ pageErrors: Array.from({ length: 20 }, () => PHANTOM_ERROR), pageErrorsTotal: 20 })
  assert.deepEqual(explainByConfig(full, keys)?.unexplained, [])
  const truncated = qaOf({ pageErrors: Array.from({ length: 20 }, () => PHANTOM_ERROR), pageErrorsTotal: 21 })
  assert.deepEqual(explainByConfig(truncated, keys)?.unexplained, ['evidence truncated (21 page errors, 20 kept)'])
  // older results without the total are taken at face value
  const legacy = { ...qaOf({ pageErrors: [PHANTOM_ERROR] }), pageErrorsTotal: undefined }
  assert.deepEqual(explainByConfig(legacy, keys)?.unexplained, [])
})

test('an undefined-binding error is a code defect, never a shortened-name configuration match', () => {
  const networkKey = ['NEXT_PUBLIC_SOLANA_NETWORK']
  assert.equal(missingConfigCause(qaOf({ pageErrors: ['network is not defined'] }), networkKey), null)
  assert.equal(
    missingConfigCause(qaOf({ pageErrors: ['ReferenceError: phantom is not defined'] }), [PHANTOM_KEY]),
    null,
  )
  assert.equal(
    missingConfigCause(qaOf({ pageErrors: ["Cannot access 'appId' before initialization"] }), [PHANTOM_KEY]),
    null,
  )
  // a template's own guard naming the full key still counts
  assert.equal(
    missingConfigCause(qaOf({ pageErrors: ['NEXT_PUBLIC_SOLANA_NETWORK is not defined'] }), networkKey)?.key,
    'NEXT_PUBLIC_SOLANA_NETWORK',
  )
})

test('a key that was supplied cannot explain the failure', () => {
  // the caller passes only the unsupplied keys, so a supplied key is simply not a candidate
  assert.equal(missingConfigCause(qaOf({ pageErrors: [PHANTOM_ERROR] }), []), null)
  assert.equal(missingConfigCause(qaOf({ pageErrors: [PHANTOM_ERROR] }), ['NEXT_PUBLIC_SOLANA_RPC_URL']), null)
})

test('configuration must explain every hard signal before the failure is downgraded', () => {
  const keys = [PHANTOM_KEY]
  const only = qaOf({
    pageErrors: [PHANTOM_ERROR],
    overlay: 'nextjs: Runtime Error',
    overlayText: `Runtime Error ${PHANTOM_ERROR}`,
    consoleErrors: ['some unrelated console noise'],
    note: 'error overlay: nextjs: Runtime Error; 1 uncaught page error(s)',
  })
  assert.deepEqual(explainByConfig(only, keys), {
    cause: { key: PHANTOM_KEY, source: 'page error', message: PHANTOM_ERROR },
    unexplained: [],
  })
  const mixed = qaOf({
    pageErrors: [`Missing ${PHANTOM_KEY}`, "Cannot read properties of undefined (reading 'publicKey')"],
    note: 'error overlay: nextjs: Runtime Error; 2 uncaught page error(s)',
  })
  const verdict = explainByConfig(mixed, keys)
  assert.equal(verdict?.cause.key, PHANTOM_KEY)
  assert.deepEqual(verdict?.unexplained, ["page error: Cannot read properties of undefined (reading 'publicKey')"])
  // an overlay whose text says something else, or a blank page, is not a configuration symptom
  const otherOverlay = qaOf({
    pageErrors: [PHANTOM_ERROR],
    overlay: 'nextjs: Build Error',
    overlayText: 'Build Error Module not found',
  })
  assert.deepEqual(explainByConfig(otherOverlay, keys)?.unexplained, ['overlay: nextjs: Build Error'])
  assert.deepEqual(explainByConfig(qaOf({ pageErrors: [PHANTOM_ERROR], blank: true }), keys)?.unexplained, [
    'blank page',
  ])
  // a harness failure (navigation timeout) is never explained, even next to a config page error
  const harness = qaOf({
    pageErrors: [PHANTOM_ERROR],
    harnessError: 'Navigation timeout of 30000 ms exceeded',
    note: 'page did not load cleanly: Navigation timeout of 30000 ms exceeded',
  })
  assert.deepEqual(explainByConfig(harness, keys)?.unexplained, ['harness: Navigation timeout of 30000 ms exceeded'])
  const noSignals = qaOf({ consoleErrors: [PHANTOM_ERROR], note: 'page did not load cleanly: timeout' })
  assert.deepEqual(explainByConfig(noSignals, keys)?.unexplained, ['page did not load cleanly: timeout'])
  assert.equal(explainByConfig(qaOf({ pageErrors: ['boom'] }), keys), null)
})

test('a requires-configuration qa skip reads as skip overall and in the Skipped section', () => {
  assert.equal(templateStatus(['pass', 'pass', 'skip'], ['pass'], true), 'skip')
  assert.equal(templateStatus(['pass', 'pass', 'fail'], ['pass'], false), 'fail')
  const template = {
    id: 'community/phantom-embedded-react',
    kind: 'next',
    status: 'skip',
    build: { status: 'pass', tail: '' },
    deps: {},
    boot: { status: 'pass' },
    qa: qaOf({
      status: 'skip',
      screenshot: 'screenshots/community__phantom-embedded-react.png',
      note: `requires configuration: ${PHANTOM_KEY} (page error: ${PHANTOM_ERROR})`,
    }),
  } as unknown as TemplateReport
  assert.equal(skipReason(template), `qa: requires configuration: ${PHANTOM_KEY} (page error: ${PHANTOM_ERROR})`)
})

// ---------- real browser (skipped when no Chrome can launch here) ----------

const PAGES: Record<string, string> = {
  '/clean': '<!doctype html><html><body><h1>Hello from the health check QA fixture page</h1></body></html>',
  '/throws':
    '<!doctype html><html><body><h1>This page has enough text to not be blank</h1><script>throw new Error("boom")</script></body></html>',
  '/blank': '<!doctype html><html><body></body></html>',
  '/overlay':
    '<!doctype html><html><body><h1>Rendered, but the dev overlay is open</h1><vite-error-overlay></vite-error-overlay></body></html>',
  '/hidden-text':
    '<!doctype html><html><body><div style="display:none">This paragraph is long enough to look like real content but it is hidden from every viewer of the page.</div><script>var x = "inline script text that must not count as rendered content either";</script></body></html>',
  '/hidden-graphic':
    '<!doctype html><html><body><svg style="display:none" width="0" height="0"><symbol id="icon"><rect width="10" height="10"/></symbol></svg><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" style="display:none"></body></html>',
  '/hang':
    '<!doctype html><html><body><h1>Document arrived, but one resource never finishes</h1><img src="/never"></body></html>',
  '/noisy':
    '<!doctype html><html><body><h1>Rendered with a console error and a broken asset</h1><script>console.error("something odd"); console.error(new Error("boom from an Error object")); fetch("/missing.json")</script></body></html>',
  // Next dev indicator state: the portal holds a closed (hidden) dialog plus the visible "Issues" badge.
  '/next-badge': `<!doctype html><html><body><h1>Rendered fully, Next dev badge says 3 Issues</h1>
    <nextjs-portal></nextjs-portal>
    <script>
      console.error('You have tried to read "publicKey" on a WalletContext without providing one.')
      const root = document.querySelector('nextjs-portal').attachShadow({ mode: 'open' })
      root.innerHTML = '<div data-nextjs-dialog style="display:none"><h2>Unhandled Runtime Error</h2></div>' +
        '<div data-nextjs-dev-tools-button style="position:fixed;bottom:16px;left:16px;padding:6px 10px;background:#000;color:#fff;border-radius:999px">N 3 Issues</div>'
    </script></body></html>`,
  // Two-line page error: the newline must survive collection so the clauses stay apart.
  '/two-line':
    '<!doctype html><html><body><h1>Rendered, then threw a two-line error</h1><script>throw new Error("Missing wallet provider\\nappId is configured")</script></body></html>',
  // More page errors than the sample keeps.
  '/many-errors':
    '<!doctype html><html><body><h1>Rendered, then threw 25 errors</h1><script>for (let i = 0; i < 25; i++) setTimeout(() => { throw new Error("appId is required #" + i) }, 0)</script></body></html>',
  // Vite overlay with message and file as separate elements in its shadow root.
  '/vite-config': `<!doctype html><html><body><h1>Rendered, but the Vite overlay is open</h1>
    <vite-error-overlay></vite-error-overlay>
    <script>
      const root = document.querySelector('vite-error-overlay').attachShadow({ mode: 'open' })
      root.innerHTML = '<div class="window"><pre class="message"><span class="message-body">Missing VITE_APP_ID</span></pre><pre class="file"><span class="file-link">/src/main.ts:1:2</span></pre></div>'
    </script></body></html>`,
  // Next error overlay whose only mention of the missing value is inside the dialog.
  '/next-dialog-config': `<!doctype html><html><body><h1>Rendered, but the Next error dialog is open</h1>
    <nextjs-portal></nextjs-portal>
    <script>
      const root = document.querySelector('nextjs-portal').attachShadow({ mode: 'open' })
      root.innerHTML = '<div data-nextjs-dialog-overlay style="position:fixed;inset:0;background:rgba(0,0,0,.5)">' +
        '<div data-nextjs-dialog role="dialog" style="margin:40px;padding:20px;background:#fff"><h1>Unhandled Runtime Error</h1><p>Missing NEXT_PUBLIC_PHANTOM_APP_ID</p></div></div>'
    </script></body></html>`,
  // Next error overlay state: a visible dialog overlay with the runtime error text.
  '/next-dialog': `<!doctype html><html><body><h1>Rendered, but the Next error dialog is open</h1>
    <nextjs-portal></nextjs-portal>
    <script>
      const root = document.querySelector('nextjs-portal').attachShadow({ mode: 'open' })
      root.innerHTML = '<div data-nextjs-dialog-overlay style="position:fixed;inset:0;background:rgba(0,0,0,.5)">' +
        '<div data-nextjs-dialog role="dialog" style="margin:40px;padding:20px;background:#fff"><h1>Unhandled Runtime Error</h1><p>Error: boom</p></div></div>'
    </script></body></html>`,
}

const listen = (server: Server): Promise<string> =>
  new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolve(`http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`)
    })
  })

const ref = (id: string): TemplateRef =>
  ({ id, group: 'kit', dir: '', kind: 'vite', scripts: {}, directDeps: [] }) as unknown as TemplateRef

test('checkRender classifies real pages in a headless browser', { timeout: 60_000 }, async (t) => {
  const server = createServer((request, response) => {
    const body = PAGES[request.url ?? '']
    response.writeHead(body ? 200 : 404, { 'content-type': body ? 'text/html' : 'text/plain' })
    response.end(body ?? 'not found')
  })
  const base = await listen(server)
  const outDir = mkdtempSync(join(tmpdir(), 'health-qa-test-'))
  const opts = { outDir, navigationTimeoutMs: 10_000, settleMs: 200 }
  try {
    const clean = await checkRender(`${base}/clean`, ref('fixture/clean'), opts)
    if (!clean.available) {
      t.skip(`no headless browser here: ${clean.note}`)
      return
    }
    assert.equal(clean.status, 'pass', JSON.stringify(clean))
    assert.equal(clean.screenshot, 'screenshots/fixture__clean.png')
    assert.ok(existsSync(join(outDir, 'screenshots', 'fixture__clean.png')), 'screenshot written')

    const throws = await checkRender(`${base}/throws`, ref('fixture/throws'), opts)
    assert.equal(throws.status, 'fail', JSON.stringify(throws))
    assert.match(throws.pageErrors.join(), /boom/)

    const blank = await checkRender(`${base}/blank`, ref('fixture/blank'), opts)
    assert.equal(blank.status, 'fail', JSON.stringify(blank))
    assert.equal(blank.blank, true)

    const hidden = await checkRender(`${base}/hidden-graphic`, ref('fixture/hidden-graphic'), opts)
    assert.equal(hidden.status, 'fail', JSON.stringify(hidden))
    assert.equal(hidden.blank, true, 'hidden sprite and display:none img must not count as graphics')

    const hiddenText = await checkRender(`${base}/hidden-text`, ref('fixture/hidden-text'), opts)
    assert.equal(hiddenText.status, 'fail', JSON.stringify(hiddenText))
    assert.equal(hiddenText.blank, true, 'hidden text and inline scripts must not count as rendered content')

    const overlay = await checkRender(`${base}/overlay`, ref('fixture/overlay'), opts)
    assert.equal(overlay.status, 'fail', JSON.stringify(overlay))
    assert.equal(overlay.overlay, 'vite: vite-error-overlay')

    const noisy = await checkRender(`${base}/noisy`, ref('fixture/noisy'), opts)
    assert.equal(noisy.status, 'warn', JSON.stringify(noisy))
    assert.match(noisy.consoleErrors.join(), /something odd/)
    assert.match(noisy.consoleErrors.join(), /Error: boom from an Error object/)
    assert.doesNotMatch(noisy.consoleErrors.join(), /JSHandle@/)
    assert.match(noisy.failedRequests.join(), /404 \/missing\.json/)

    const badge = await checkRender(`${base}/next-badge`, ref('fixture/next-badge'), opts)
    assert.equal(badge.overlay, undefined, JSON.stringify(badge))
    assert.equal(badge.status, 'warn', JSON.stringify(badge))
    assert.match(badge.consoleErrors.join(), /WalletContext/)

    const dialog = await checkRender(`${base}/next-dialog`, ref('fixture/next-dialog'), opts)
    assert.equal(dialog.status, 'fail', JSON.stringify(dialog))
    assert.equal(dialog.overlay, 'nextjs: Unhandled Runtime Error')
    assert.equal(dialog.overlayText, 'Unhandled Runtime Error\nError: boom')

    const dialogConfig = await checkRender(`${base}/next-dialog-config`, ref('fixture/next-dialog-config'), opts)
    assert.equal(dialogConfig.status, 'fail', JSON.stringify(dialogConfig))
    assert.equal(dialogConfig.overlayText, 'Unhandled Runtime Error\nMissing NEXT_PUBLIC_PHANTOM_APP_ID')
    assert.deepEqual(explainByConfig(dialogConfig, [PHANTOM_KEY]), {
      cause: { key: PHANTOM_KEY, source: 'overlay', message: 'Missing NEXT_PUBLIC_PHANTOM_APP_ID' },
      unexplained: [],
    })

    const twoLine = await checkRender(`${base}/two-line`, ref('fixture/two-line'), opts)
    assert.equal(twoLine.status, 'fail', JSON.stringify(twoLine))
    assert.equal(twoLine.pageErrors[0], 'Missing wallet provider\nappId is configured')
    assert.equal(missingConfigCause(twoLine, [PHANTOM_KEY]), null)

    const many = await checkRender(`${base}/many-errors`, ref('fixture/many-errors'), opts)
    assert.equal(many.status, 'fail', JSON.stringify(many))
    assert.equal(many.pageErrors.length, 20)
    assert.equal(many.pageErrorsTotal, 25)
    assert.deepEqual(explainByConfig(many, [PHANTOM_KEY])?.unexplained, [
      'evidence truncated (25 page errors, 20 kept)',
    ])

    const vite = await checkRender(`${base}/vite-config`, ref('fixture/vite-config'), opts)
    assert.equal(vite.status, 'fail', JSON.stringify(vite))
    assert.equal(vite.overlay, 'vite: vite-error-overlay')
    assert.equal(vite.overlayText, 'Missing VITE_APP_ID\n/src/main.ts:1:2')
    assert.equal(overlayMessage(vite.overlayText ?? ''), 'Missing VITE_APP_ID')
    assert.equal(missingConfigCause(vite, ['VITE_APP_ID'])?.key, 'VITE_APP_ID')
  } finally {
    server.close()
    rmSync(outDir, { recursive: true, force: true })
  }
})

test('a navigation that never finishes still yields a screenshot', { timeout: 60_000 }, async (t) => {
  const pending: Array<() => void> = []
  const server = createServer((request, response) => {
    if (request.url === '/never') {
      // Hold the response open until the test tears the server down.
      pending.push(() => response.destroy())
      return
    }
    response.writeHead(200, { 'content-type': 'text/html' })
    response.end(PAGES['/hang'])
  })
  const base = await listen(server)
  const outDir = mkdtempSync(join(tmpdir(), 'health-qa-test-'))
  try {
    const result = await checkRender(`${base}/hang`, ref('fixture/hang'), {
      outDir,
      navigationTimeoutMs: 1_500,
      settleMs: 100,
    })
    if (!result.available) {
      t.skip(`no headless browser here: ${result.note}`)
      return
    }
    assert.equal(result.status, 'fail', JSON.stringify(result))
    assert.match(result.harnessError ?? '', /timeout/i)
    assert.equal(result.screenshot, 'screenshots/fixture__hang.png')
    assert.ok(existsSync(join(outDir, 'screenshots', 'fixture__hang.png')), 'screenshot written on failure')
    assert.match(result.note ?? '', /screenshot captured after the failed navigation/)
  } finally {
    for (const close of pending) close()
    server.close()
    rmSync(outDir, { recursive: true, force: true })
  }
})

test('checkRender never throws when the server is unreachable', { timeout: 60_000 }, async (t) => {
  const outDir = mkdtempSync(join(tmpdir(), 'health-qa-test-'))
  try {
    const result = await checkRender('http://127.0.0.1:9/', ref('fixture/down'), { outDir, navigationTimeoutMs: 5_000 })
    if (!result.available) {
      t.skip(`no headless browser here: ${result.note}`)
      return
    }
    assert.equal(result.status, 'fail')
    assert.match(result.note ?? '', /did not load cleanly/)
  } finally {
    rmSync(outDir, { recursive: true, force: true })
  }
})

test('a shortened stem never claims an error that names a different declared key in full', () => {
  const signals = {
    pageErrors: ['NEXT_PUBLIC_SUPABASE_URL is required'],
    consoleErrors: [],
    failedRequests: [],
    blank: false,
  }
  const declared = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  assert.equal(missingConfigCause(signals, ['NEXT_PUBLIC_SUPABASE_ANON_KEY'], declared), null)
  const verdict = explainByConfig(signals, ['NEXT_PUBLIC_SUPABASE_ANON_KEY'], declared)
  assert.equal(verdict, null, 'the URL error is not explained by the unsupplied anon key')
  const own = missingConfigCause(signals, ['NEXT_PUBLIC_SUPABASE_URL'], declared)
  assert.equal(own?.key, 'NEXT_PUBLIC_SUPABASE_URL')
})

test('a shortened stem loses to a supplied key that matches more strongly', () => {
  const declared = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  const urlError = { pageErrors: ['Supabase URL is required'], consoleErrors: [], failedRequests: [], blank: false }
  assert.equal(missingConfigCause(urlError, ['NEXT_PUBLIC_SUPABASE_ANON_KEY'], declared), null)
  assert.equal(explainByConfig(urlError, ['NEXT_PUBLIC_SUPABASE_ANON_KEY'], declared), null)
  const anonError = {
    pageErrors: ['Supabase anon key is required'],
    consoleErrors: [],
    failedRequests: [],
    blank: false,
  }
  assert.equal(
    missingConfigCause(anonError, ['NEXT_PUBLIC_SUPABASE_ANON_KEY'], declared)?.key,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  )
  const bothMissing = missingConfigCause(urlError, declared, declared)
  assert.equal(bothMissing?.key, 'NEXT_PUBLIC_SUPABASE_URL', 'when both are unsupplied the stronger match wins')
})

test('the most specific unsupplied key is named regardless of declaration order', () => {
  const declared = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  const anonError = {
    pageErrors: ['Supabase anon key is required'],
    consoleErrors: [],
    failedRequests: [],
    blank: false,
  }
  assert.equal(missingConfigCause(anonError, declared, declared)?.key, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  assert.equal(missingConfigCause(anonError, [...declared].reverse(), declared)?.key, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const exact = {
    pageErrors: ['NEXT_PUBLIC_SUPABASE_URL is required'],
    consoleErrors: [],
    failedRequests: [],
    blank: false,
  }
  assert.equal(missingConfigCause(exact, [...declared].reverse(), declared)?.key, 'NEXT_PUBLIC_SUPABASE_URL')
})

test('a full key name only matches as a whole identifier', () => {
  const key = 'NEXT_PUBLIC_PHANTOM_APP_ID'
  const longer = {
    pageErrors: ['ReferenceError: NEXT_PUBLIC_PHANTOM_APP_ID_SUFFIX is not defined'],
    consoleErrors: [],
    failedRequests: [],
    blank: false,
  }
  assert.equal(missingConfigCause(longer, [key], [key]), null)
  assert.equal(explainByConfig(longer, [key], [key]), null)
  const own = {
    pageErrors: ['NEXT_PUBLIC_PHANTOM_APP_ID is not defined'],
    consoleErrors: [],
    failedRequests: [],
    blank: false,
  }
  assert.equal(missingConfigCause(own, [key], [key])?.key, key)
  const spaced = { pageErrors: ['Missing phantom-app-id in env'], consoleErrors: [], failedRequests: [], blank: false }
  assert.equal(missingConfigCause(spaced, [key], [key])?.key, key)
})

test('a shortened form never claims a message that names an undeclared identifier', () => {
  const key = 'NEXT_PUBLIC_PHANTOM_APP_ID'
  for (const text of [
    'NEXT_PUBLIC_PHANTOM_APP_ID_SUFFIX is required',
    'Missing PHANTOM_APP_ID_V2',
    'ReferenceError: NEXT_PUBLIC_PHANTOM_APP_ID_SUFFIX is not defined',
    'next_public_phantom_app_id_suffix is required',
    'phantom_app_id2 is missing',
  ]) {
    const qa = { pageErrors: [text], consoleErrors: [], failedRequests: [], blank: false }
    assert.equal(missingConfigCause(qa, [key], [key]), null, text)
  }
  const plain = {
    pageErrors: ['appId is required when using embedded providers'],
    consoleErrors: [],
    failedRequests: [],
    blank: false,
  }
  assert.equal(missingConfigCause(plain, [key], [key])?.key, key)
})
