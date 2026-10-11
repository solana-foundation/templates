import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer, type Server } from 'node:http'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkRender, classifyRender, isReportableRequest, screenshotName, type RenderSignals } from './qa.js'
import { diffReports } from './report.js'
import { overallStatus } from './status.js'
import type { HealthReport, Status, TemplateRef } from './types.js'

const signals = (partial: Partial<RenderSignals> = {}): RenderSignals => ({
  consoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  overlay: null,
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

// ---------- real browser (skipped when no Chrome can launch here) ----------

const PAGES: Record<string, string> = {
  '/clean': '<!doctype html><html><body><h1>Hello from the health check QA fixture page</h1></body></html>',
  '/throws':
    '<!doctype html><html><body><h1>This page has enough text to not be blank</h1><script>throw new Error("boom")</script></body></html>',
  '/blank': '<!doctype html><html><body></body></html>',
  '/overlay':
    '<!doctype html><html><body><h1>Rendered, but the dev overlay is open</h1><vite-error-overlay></vite-error-overlay></body></html>',
  '/hidden-graphic':
    '<!doctype html><html><body><svg style="display:none" width="0" height="0"><symbol id="icon"><rect width="10" height="10"/></symbol></svg><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" style="display:none"></body></html>',
  '/hang':
    '<!doctype html><html><body><h1>Document arrived, but one resource never finishes</h1><img src="/never"></body></html>',
  '/noisy':
    '<!doctype html><html><body><h1>Rendered with a console error and a broken asset</h1><script>console.error("something odd"); console.error(new Error("boom from an Error object")); fetch("/missing.json")</script></body></html>',
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

    const overlay = await checkRender(`${base}/overlay`, ref('fixture/overlay'), opts)
    assert.equal(overlay.status, 'fail', JSON.stringify(overlay))
    assert.equal(overlay.overlay, 'vite: vite-error-overlay')

    const noisy = await checkRender(`${base}/noisy`, ref('fixture/noisy'), opts)
    assert.equal(noisy.status, 'warn', JSON.stringify(noisy))
    assert.match(noisy.consoleErrors.join(), /something odd/)
    assert.match(noisy.consoleErrors.join(), /Error: boom from an Error object/)
    assert.doesNotMatch(noisy.consoleErrors.join(), /JSHandle@/)
    assert.match(noisy.failedRequests.join(), /404 \/missing\.json/)
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
