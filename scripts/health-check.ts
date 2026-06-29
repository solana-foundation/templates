#!/usr/bin/env tsx
/**
 * Templates health check.
 *
 * Scaffold-free by default: copies each template into an isolated temp dir, installs,
 * runs its `ci`/`build` script, and reports across five dimensions — build health,
 * dependency freshness, known vulnerabilities, registry-deprecated packages, and
 * doc/reality drift. Optionally boots web templates to confirm the dev server responds.
 *
 * Outputs a machine-readable JSON artifact and a human Markdown report. Pass a previous
 * JSON as --baseline to surface regressions.
 *
 * Usage:
 *   pnpm health                          # all templates, install + build
 *   pnpm health --only kit/nextjs        # one template (csv ok)
 *   pnpm health --group community        # one group
 *   pnpm health --boot                   # also boot web dev servers
 *   pnpm health --no-build               # install + deps/audit only (fast)
 *   pnpm health --baseline health-reports/2026-06-20T09-00-00.json
 *   pnpm health --out health-reports --concurrency 4
 *
 * Read-only on the repo. Never touches mainnet, real funds, or real keys.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { enumerateTemplates } from './health/enumerate.js'
import { checkTemplate, cleanupActiveTempDirs, sweepOrphanTempDirs, type RunOptions } from './health/checks.js'
import { diffReports, diffToMarkdown, toMarkdown } from './health/report.js'
import { overallStatus } from './health/status.js'
import type { HealthReport, Status, TemplateRef, TemplateReport } from './health/types.js'
import { writeFile, writeJsonFile } from './shared/fs-utils.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

type Cli = {
  only: string[] | null
  group: string | null
  build: boolean
  boot: boolean
  cargoTest: boolean
  pm: string | null
  out: string
  concurrency: number
  baseline: string | null
  keep: number
}

const parseArgs = (argv: string[]): Cli => {
  const cli: Cli = {
    only: null,
    group: null,
    build: true,
    boot: false,
    cargoTest: false,
    pm: null,
    out: join(ROOT, 'health-reports'),
    concurrency: 3,
    baseline: null,
    keep: 10,
  }
  // Keep the default when a numeric flag is missing its value or gets a non-number
  // (e.g. another flag). A NaN concurrency would otherwise spin up zero workers and
  // produce an empty, falsely-successful report.
  const numArg = (raw: string | undefined, fallback: number, min: number): number => {
    const n = Number(raw)
    return Number.isFinite(n) && n >= min ? Math.floor(n) : fallback
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => argv[++i]
    if (a === '--only')
      cli.only = next()
        .split(',')
        .map((s) => s.trim())
    else if (a === '--group') cli.group = next()
    else if (a === '--no-build') cli.build = false
    else if (a === '--boot') cli.boot = true
    else if (a === '--cargo-test') cli.cargoTest = true
    else if (a === '--pm') cli.pm = next()
    else if (a === '--out') cli.out = next()
    else if (a === '--concurrency') cli.concurrency = numArg(next(), 3, 1)
    else if (a === '--baseline') cli.baseline = next()
    else if (a === '--keep') cli.keep = numArg(next(), 10, 0)
    else if (a === '--help' || a === '-h') {
      printHelp()
      process.exit(0)
    }
  }
  return cli
}

const printHelp = () => {
  console.log(`templates health check

  --only <ids>        comma-separated template ids (e.g. kit/nextjs,web3js/...)
  --group <name>      limit to a repokit group (kit|web3js|mobile|community)
  --no-build          install + deps/audit only, skip the build/ci script
  --boot              boot web templates and confirm the dev server responds
  --cargo-test        also run cargo test for Rust templates (needs solana platform tools for programs)
  --pm <manager>      force a package manager (default: each template's pinned one, else npm)
  --out <dir>         output directory (default: health-reports/)
  --concurrency <n>   templates to check in parallel (default: 3)
  --baseline <file>   previous report JSON to diff against
  --keep <n>          keep only the n most recent reports in --out (default: 10, 0 = keep all)
`)
}

const toTemplateReport = (ref: TemplateRef, r: Awaited<ReturnType<typeof checkTemplate>>): TemplateReport => {
  const functional: Status[] = [r.build.status]
  if (r.boot) functional.push(r.boot.status)
  if (r.rust) functional.push(r.rust.status)
  const advisory: Status[] = [r.deps.status, r.audit.status, r.deprecation.status, r.docDrift.status]
  // needs-setup dominates: we couldn't actually validate the template, so it's "skip",
  // not pass/warn from incidental advisory checks.
  const status: Status = r.needsSetupSkip ? 'skip' : overallStatus(functional, advisory)
  return {
    id: ref.id,
    group: ref.group,
    kind: ref.kind,
    status,
    needsSecrets: ref.needsSecrets,
    packageManager: r.packageManager,
    build: r.build,
    deps: r.deps,
    audit: r.audit,
    deprecation: r.deprecation,
    docDrift: r.docDrift,
    boot: r.boot,
    rust: r.rust,
  }
}

/** Run an async mapper over items with a bounded number in flight. */
const pool = async <T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> => {
  const results: R[] = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++
      results[i] = await fn(items[i], i)
    }
  })
  await Promise.all(workers)
  return results
}

/** Keep only the n most recent timestamped reports (json + md pairs) in the output dir. */
const pruneReports = (outDir: string, keep: number): number => {
  if (keep <= 0 || !existsSync(outDir)) return 0
  const stampRe = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})\.(json|md)$/
  const stamps = [
    ...new Set(
      readdirSync(outDir)
        .map((f) => f.match(stampRe)?.[1])
        .filter((s): s is string => Boolean(s)),
    ),
  ]
    .sort()
    .reverse()
  let removed = 0
  for (const stamp of stamps.slice(keep)) {
    for (const ext of ['json', 'md']) {
      const p = join(outDir, `${stamp}.${ext}`)
      if (existsSync(p)) {
        rmSync(p, { force: true })
        removed++
      }
    }
  }
  return removed
}

const main = async () => {
  const cli = parseArgs(process.argv.slice(2))

  // Clean up first: a previous run that was Ctrl-C'd can leave install/build artifacts
  // behind in tmpdir. Sweep them, and make sure our own get wiped on interrupt too.
  const swept = sweepOrphanTempDirs()
  if (swept > 0) console.error(`Swept ${swept} leftover temp dir(s) from a previous run.`)
  for (const sig of ['SIGINT', 'SIGTERM'] as const) {
    process.on(sig, () => {
      console.error(`\n${sig} - cleaning up temp dirs...`)
      cleanupActiveTempDirs()
      process.exit(130)
    })
  }

  let templates = enumerateTemplates(ROOT)
  if (cli.group) templates = templates.filter((t) => t.group === cli.group)
  if (cli.only) templates = templates.filter((t) => cli.only!.includes(t.id))

  if (templates.length === 0) {
    console.error('No templates matched the given filters.')
    process.exit(1)
  }

  const opts: RunOptions = {
    packageManager: cli.pm,
    build: cli.build,
    boot: cli.boot,
    cargoTest: cli.cargoTest,
    installTimeoutMs: 8 * 60_000,
    buildTimeoutMs: 12 * 60_000,
  }

  const runTemplate = async (ref: TemplateRef, label: string): Promise<TemplateReport> => {
    const t0 = Date.now()
    try {
      const r = await checkTemplate(ref, opts)
      if (r.pmNote) console.error(`    ↳ ${ref.id}: ${r.pmNote}`)
      const report = toTemplateReport(ref, r)
      const secs = Math.round((Date.now() - t0) / 1000)
      console.error(`${label} ${statusIcon(report.status)} ${ref.id} (${secs}s) [${report.packageManager}]`)
      return report
    } catch (e) {
      console.error(`${label} 💥 ${ref.id} — ${String(e)}`)
      return errorReport(ref, String(e))
    }
  }

  console.error(`Checking ${templates.length} template(s) with concurrency ${cli.concurrency}...\n`)
  const reports = await pool(templates, cli.concurrency, (ref, i) => runTemplate(ref, `[${i + 1}/${templates.length}]`))

  // Stability: re-run each functional failure once, alone (concurrency 1). A template that
  // only fails under load (e.g. 4 concurrent Next builds exhausting memory) passes here and
  // is marked flaky; one that fails again is a real break. This keeps the fail list honest.
  const failed = reports.map((r, i) => ({ r, i })).filter((x) => x.r.status === 'fail')
  if (failed.length) {
    console.error(`\nRetrying ${failed.length} failure(s) in isolation to separate flaky from real...`)
    for (const { i } of failed) {
      const retry = await runTemplate(templates[i], '[retry]')
      reports[i] = retry.status === 'fail' ? retry : { ...retry, flaky: true }
      if (retry.status !== 'fail') console.error(`    ↳ ${templates[i].id} was flaky (passed alone)`)
    }
  }

  const summary = {
    total: reports.length,
    pass: reports.filter((r) => r.status === 'pass').length,
    warn: reports.filter((r) => r.status === 'warn').length,
    fail: reports.filter((r) => r.status === 'fail').length,
    skip: reports.filter((r) => r.status === 'skip').length,
  }

  const report: HealthReport = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    packageManager: cli.pm ?? 'auto (per-template)',
    options: { build: cli.build, boot: cli.boot, source: 'local' },
    summary,
    templates: reports,
  }

  // Read the baseline BEFORE writing anything, so a baseline that points at today's report
  // is not overwritten by the current run and then diffed against itself.
  let diffMd = ''
  if (cli.baseline) {
    if (existsSync(cli.baseline)) {
      const baseline = JSON.parse(readFileSync(cli.baseline, 'utf-8')) as HealthReport
      diffMd = '\n' + diffToMarkdown(diffReports(report, baseline))
    } else {
      console.error(`Baseline not found, skipping diff: ${cli.baseline}`)
    }
  }

  if (!existsSync(cli.out)) mkdirSync(cli.out, { recursive: true })
  // Full timestamp (not just the date) so multiple runs on the same day don't overwrite.
  const stamp = report.generatedAt.slice(0, 19).replace(/:/g, '-')
  const jsonPath = join(cli.out, `${stamp}.json`)
  const mdPath = join(cli.out, `${stamp}.md`)

  const jsonWrite = writeJsonFile(jsonPath, report)
  const mdWrite = writeFile(mdPath, toMarkdown(report) + diffMd)
  if (!jsonWrite.ok || !mdWrite.ok) {
    console.error(`Failed to write report to ${cli.out}: ${!jsonWrite.ok ? jsonWrite.error : mdWrite.error}`)
    process.exit(1)
  }

  // Temp build artifacts are already gone (each template's copy is removed as it finishes);
  // here we just trim the report history so dated files don't accumulate forever.
  const pruned = pruneReports(cli.out, cli.keep)

  console.error(`\n${summary.pass} pass · ${summary.warn} warn · ${summary.fail} fail · ${summary.skip} skip`)
  console.error(`Wrote ${jsonPath}`)
  console.error(`Wrote ${mdPath}`)
  if (pruned > 0) console.error(`Pruned ${pruned} old report file(s) (keeping ${cli.keep} most recent).`)

  // Non-zero exit when something is broken, so CI can gate on it.
  process.exit(summary.fail > 0 ? 1 : 0)
}

const statusIcon = (s: Status) => ({ pass: '✅', warn: '⚠️', fail: '❌', skip: '⏭️' })[s]

const errorReport = (ref: TemplateRef, message: string): TemplateReport => ({
  id: ref.id,
  group: ref.group,
  kind: ref.kind,
  status: 'fail',
  needsSecrets: ref.needsSecrets,
  packageManager: ref.packageManager,
  build: {
    status: 'fail',
    phase: 'none',
    command: '(harness error)',
    exitCode: null,
    timedOut: false,
    durationMs: 0,
    tail: message,
  },
  deps: {
    status: 'skip',
    available: false,
    total: 0,
    major: 0,
    minor: 0,
    patch: 0,
    outdated: [],
    note: 'harness error',
  },
  audit: {
    status: 'skip',
    available: false,
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    info: 0,
    note: 'harness error',
  },
  deprecation: { status: 'skip', packages: [] },
  docDrift: { status: 'skip', missingScripts: [] },
})

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
