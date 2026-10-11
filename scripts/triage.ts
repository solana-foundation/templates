#!/usr/bin/env tsx
/**
 * Templates triage: turn a health report into classified findings, a Markdown report
 * with paste-ready draft issues, and (opt-in) patch proposals for the classes that have
 * a recipe. Stage 2 classifies a GitHub issue with the same deterministic rules.
 *
 * Usage:
 *   pnpm triage                                   # latest health-reports/*.json
 *   pnpm triage --report <file> [--baseline <file>]
 *   pnpm triage --patch [--only <ids>]            # also write triage-reports/patches/*.diff + .md
 *   pnpm triage --apply triage-reports/patches/<stem>.diff   # git apply --check, then git apply
 *   pnpm triage --issue <number>                  # stage 2: classify a GitHub issue
 *   pnpm triage --out triage-reports --keep 10
 *
 * Read-only on the repo unless --apply is passed, and even then it only touches the
 * working tree: it never commits, never pushes, never opens issues or PRs.
 */

import { existsSync, mkdirSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { enumerateTemplates } from './health/enumerate.js'
import { writeFile, writeJsonFile } from './shared/fs-utils.js'
import { classifyReport, statusOf } from './triage/classify.js'
import { classifyIssue, fetchIssue, fetchOpenIssues } from './triage/issue.js'
import { latestReportPath, loadHealthReport, regressionIds } from './triage/load.js'
import { applyPatch, patchFileStem, proposePatch, type PatchTarget } from './triage/patcher.js'
import { pruneReports, summarize, toMarkdown } from './triage/report.js'
import type { TriageReport, TriagedTemplateReport } from './triage/types.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = 'solana-foundation/templates'

type Cli = {
  report: string | null
  baseline: string | null
  only: string[] | null
  patch: boolean
  apply: string | null
  issue: number | null
  out: string
  keep: number
}

const parseArgs = (argv: string[]): Cli => {
  const cli: Cli = {
    report: null,
    baseline: null,
    only: null,
    patch: false,
    apply: null,
    issue: null,
    out: join(ROOT, 'triage-reports'),
    keep: 10,
  }
  const numArg = (raw: string | undefined, fallback: number, min: number): number => {
    const parsed = Number(raw)
    return Number.isFinite(parsed) && parsed >= min ? Math.floor(parsed) : fallback
  }
  for (let argIndex = 0; argIndex < argv.length; argIndex++) {
    const arg = argv[argIndex]
    const next = () => argv[++argIndex]
    if (arg === '--') continue
    else if (arg === '--report') cli.report = next()
    else if (arg === '--baseline') cli.baseline = next()
    else if (arg === '--only')
      cli.only = next()
        .split(',')
        .map((id) => id.trim())
    else if (arg === '--patch') cli.patch = true
    else if (arg === '--apply') cli.apply = next()
    else if (arg === '--issue') cli.issue = numArg(next(), 0, 1)
    else if (arg === '--out') cli.out = next()
    else if (arg === '--keep') cli.keep = numArg(next(), 10, 0)
    else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    } else {
      console.error(`Unknown argument: ${arg}`)
      process.exit(1)
    }
  }
  return cli
}

const printHelp = () => {
  console.log(`templates triage

  --report <file>     health report JSON to classify (default: newest in health-reports/)
  --baseline <file>   previous health report JSON; pass -> fail templates are marked regressions
  --only <ids>        comma-separated template ids to keep
  --patch             write diff + PR body proposals for auto-patchable findings (runs installs in temp dirs)
  --apply <patch>     git apply --check then git apply a proposal to the working tree (never commits)
  --issue <number>    stage 2: classify a GitHub issue (needs gh)
  --out <dir>         output directory (default: triage-reports/)
  --keep <n>          keep only the n most recent reports in --out (default: 10, 0 = keep all)
`)
}

const runIssue = (number: number): number => {
  const issue = fetchIssue(number, REPO)
  if (!issue.ok) {
    console.error(`Could not fetch issue #${number}: ${issue.error}`)
    console.error('Install the GitHub CLI (https://cli.github.com) and run `gh auth login`, then retry.')
    return 0
  }
  const open = fetchOpenIssues(REPO)
  if (!open.ok) console.error(`Duplicate check skipped: ${open.error}`)
  const catalog = enumerateTemplates(ROOT).map((template) => template.id)
  const latest = latestReportPath(join(ROOT, 'health-reports'))
  const health = latest ? loadHealthReport(latest) : null
  const templates = health?.ok ? (health.value.templates as readonly TriagedTemplateReport[]) : null
  const triage = classifyIssue(issue.value, {
    catalog,
    openIssues: open.ok ? open.value : [],
    healthStatus: templates ? (id) => statusOf(templates, id) : undefined,
  })
  console.log(JSON.stringify(triage, null, 2))
  console.error(`\nIssue #${number}: ${triage.kind} (${triage.confidence}). Comment draft above; nothing was posted.`)
  return 0
}

const runApply = (patchPath: string): number => {
  const absolute = resolve(ROOT, patchPath)
  if (!existsSync(absolute)) {
    console.error(`Patch not found: ${absolute}`)
    return 1
  }
  const applied = applyPatch(ROOT, absolute)
  if (!applied.ok) {
    console.error(applied.error)
    return 1
  }
  console.error(`Applied ${patchPath} to the working tree (not committed).`)
  console.error('Next: review `git diff`, run the template ci, then `git checkout -b <branch> && git commit` and')
  console.error(
    'open the draft PR yourself: gh pr create --draft --title "<title from the .md>" --body-file <patch>.md',
  )
  return 0
}

const main = (): number => {
  const cli = parseArgs(process.argv.slice(2))
  if (cli.issue !== null) return runIssue(cli.issue)
  if (cli.apply !== null) return runApply(cli.apply)

  const reportPath = cli.report ? resolve(ROOT, cli.report) : latestReportPath(join(ROOT, 'health-reports'))
  if (!reportPath) {
    console.error('No health report found. Run `pnpm health` first or pass --report <file>.')
    return 1
  }
  const loaded = loadHealthReport(reportPath)
  if (!loaded.ok) {
    console.error(loaded.error)
    return 1
  }
  let baseline = null
  if (cli.baseline) {
    const loadedBaseline = loadHealthReport(resolve(ROOT, cli.baseline))
    if (!loadedBaseline.ok) console.error(`Baseline skipped: ${loadedBaseline.error}`)
    else baseline = loadedBaseline.value
  }

  let templates = loaded.value.templates as readonly TriagedTemplateReport[]
  if (cli.only) templates = templates.filter((template) => cli.only!.includes(template.id))
  const findings = classifyReport(templates, regressionIds(loaded.value, baseline))

  const triage: TriageReport = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      report: reportPath.startsWith(ROOT) ? reportPath.slice(ROOT.length + 1) : reportPath,
      reportGeneratedAt: loaded.value.generatedAt,
      baseline: cli.baseline,
    },
    summary: summarize(findings, templates.length),
    findings,
  }

  if (!existsSync(cli.out)) mkdirSync(cli.out, { recursive: true })
  const stamp = triage.generatedAt.slice(0, 19).replace(/:/g, '-')
  const jsonPath = join(cli.out, `${stamp}.json`)
  const mdPath = join(cli.out, `${stamp}.md`)
  const markdown = toMarkdown(triage)
  const jsonWrite = writeJsonFile(jsonPath, triage)
  const mdWrite = writeFile(mdPath, markdown)
  const writeError = !jsonWrite.ok ? jsonWrite.error : !mdWrite.ok ? mdWrite.error : null
  if (writeError !== null) {
    console.error(`Failed to write triage report to ${cli.out}: ${writeError}`)
    return 1
  }
  console.log(markdown)

  if (cli.patch) {
    const refs = new Map(enumerateTemplates(ROOT).map((template) => [template.id, template]))
    const patchDir = join(cli.out, 'patches')
    if (!existsSync(patchDir)) mkdirSync(patchDir, { recursive: true })
    let written = 0
    for (const finding of findings.filter((candidate) => candidate.autoPatchable)) {
      const ref = refs.get(finding.templateId)
      if (!ref) {
        console.error(`  ${finding.templateId}: not in the working tree, skipping patch`)
        continue
      }
      const target: PatchTarget = {
        id: ref.id,
        dir: ref.dir,
        root: ROOT,
        packageManager: ref.packageManager,
        scripts: ref.scripts,
      }
      const proposal = proposePatch(finding, target, { allowInstall: true, timeoutMs: 8 * 60_000 })
      if (!proposal.patchable) {
        console.error(`  ${finding.templateId} ${finding.class}: no patch (${proposal.reason})`)
        continue
      }
      const stem = join(patchDir, patchFileStem(finding))
      writeFile(`${stem}.diff`, proposal.diff)
      writeFile(`${stem}.md`, `# ${proposal.title}\n\n${proposal.body}`)
      console.error(`  ${finding.templateId} ${finding.class}: wrote ${stem}.diff (+ .md)`)
      written++
    }
    console.error(
      `\n${written} patch proposal(s) written to ${patchDir}. Apply one with: pnpm triage --apply <file>.diff`,
    )
  }

  const pruned = pruneReports(cli.out, cli.keep)
  const { summary } = triage
  console.error(`\n${summary.regressions} regression · ${summary.fails} fail · ${summary.warns} warn`)
  console.error(`Wrote ${jsonPath}`)
  console.error(`Wrote ${mdPath}`)
  if (pruned > 0) console.error(`Pruned ${pruned} old report file(s) (keeping ${cli.keep} most recent).`)
  // Advisory by design: a human decides what becomes an issue, so the exit code stays 0.
  return 0
}

process.exit(main())
