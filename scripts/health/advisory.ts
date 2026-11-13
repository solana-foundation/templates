/**
 * Dimension 2: dependency freshness (`outdated`) and known vulnerabilities (`audit`),
 * both parsed from the package manager's JSON output. An operational failure (registry
 * down, timeout, unparseable output) is reported as unavailable, never as zero findings.
 */

import type { Advisory, AdvisorySeverity, AuditResult, DepsResult, OutdatedDep, Status } from './types.js'
import { bumpKind } from './semver.js'
import { run, type Exec } from './process.js'

export const checkOutdated = async (workDir: string, pm: string): Promise<DepsResult> => {
  if (pm !== 'npm' && pm !== 'pnpm') {
    return {
      status: 'skip',
      available: false,
      total: 0,
      major: 0,
      minor: 0,
      patch: 0,
      outdated: [],
      note: `dependency freshness supports npm and pnpm (ran with ${pm})`,
    }
  }
  // Both exit non-zero when something is outdated - that's not an error for us. npm and pnpm
  // emit a package-keyed JSON object with { current, latest }, so one parser handles both.
  const args = pm === 'pnpm' ? ['outdated', '--format', 'json'] : ['outdated', '--json']
  return parseOutdated(pm, await run(pm, args, workDir, 120_000))
}

/**
 * Why a `--json` command's result can't be trusted, or null when it can. Both npm and pnpm
 * print `{ "error": { "code", "summary" } }` to stdout for operational failures (registry
 * unreachable, auth, missing lockfile) and exit non-zero; a timeout or spawn failure leaves
 * stdout empty. None of those may read as "zero findings".
 */
const operationalError = (
  pm: string,
  verb: string,
  exec: Pick<Exec, 'code' | 'stdout' | 'timedOut'>,
): string | null => {
  if (exec.timedOut) return `${pm} ${verb} timed out`
  if (exec.code === -1) return `${pm} ${verb} could not be started`
  if (exec.stdout.trim() === '') {
    // Empty stdout is only legitimate on a clean exit (nothing to report).
    return exec.code === 0 ? null : `${pm} ${verb} exited with code ${exec.code} and produced no output`
  }
  return null
}

type JsonError = { code?: unknown; summary?: unknown; detail?: unknown }

/** Parse stdout only (stderr warnings would corrupt it); null when it isn't a JSON object. */
const parseJsonObject = (stdout: string): Record<string, unknown> | null => {
  if (stdout.trim() === '') return {}
  try {
    const parsed: unknown = JSON.parse(stdout)
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

const describeJsonError = (error: unknown): string | null => {
  if (error === null || typeof error !== 'object') return null
  const { code, summary } = error as JsonError
  const parts = [code, summary].filter((part): part is string => typeof part === 'string' && part.length > 0)
  return parts.length ? parts.join(': ') : 'unknown error'
}

/** Pure: turn `npm outdated --json` / `pnpm outdated --format json` output into a DepsResult. */
export const parseOutdated = (pm: string, exec: Pick<Exec, 'code' | 'stdout' | 'timedOut'>): DepsResult => {
  const failure = operationalError(pm, 'outdated', exec)
  if (failure) return skipDeps(failure)
  const parsed = parseJsonObject(exec.stdout)
  if (!parsed) return skipDeps(`could not parse ${pm} outdated output`)
  const errorNote = describeJsonError(parsed.error)
  if (errorNote) return skipDeps(`${pm} outdated failed: ${errorNote}`)
  const outdated: OutdatedDep[] = Object.entries(parsed)
    .map(([name, dep]) => [name, (dep ?? {}) as { current?: unknown; latest?: unknown }] as const)
    .filter(
      ([, dep]) => typeof dep.current === 'string' && typeof dep.latest === 'string' && dep.current !== dep.latest,
    )
    .map(([name, dep]) => ({
      name,
      current: dep.current as string,
      latest: dep.latest as string,
      bump: bumpKind(dep.current as string, dep.latest as string),
    }))
  const major = outdated.filter((dep) => dep.bump === 'major').length
  const minor = outdated.filter((dep) => dep.bump === 'minor').length
  const patch = outdated.filter((dep) => dep.bump === 'patch').length
  return {
    status: major > 0 ? 'warn' : 'pass',
    available: true,
    total: outdated.length,
    major,
    minor,
    patch,
    outdated: outdated.sort((left, right) => left.name.localeCompare(right.name)),
  }
}

// ---------- dimension 2b: known vulnerabilities (snapshot, overlaps dependabot) ----------

export const checkAudit = async (workDir: string, pm: string): Promise<AuditResult> => {
  if (pm !== 'npm' && pm !== 'pnpm') {
    return {
      status: 'skip',
      available: false,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0,
      advisories: [],
      note: `audit supports npm and pnpm (ran with ${pm})`,
    }
  }
  // npm and pnpm both expose metadata.vulnerabilities in their --json audit output.
  return parseAudit(pm, await run(pm, ['audit', '--json'], workDir, 120_000))
}

/**
 * Pure: turn `npm audit --json` / `pnpm audit --json` output into an AuditResult. The
 * response must carry `metadata.vulnerabilities`; anything else (an error object, empty
 * output, prose) is reported as unavailable, never as a clean pass.
 */
export const parseAudit = (pm: string, exec: Pick<Exec, 'code' | 'stdout' | 'timedOut'>): AuditResult => {
  const failure = operationalError(pm, 'audit', exec)
  if (failure) return skipAudit(failure)
  const parsed = parseJsonObject(exec.stdout)
  if (!parsed) return skipAudit(`could not parse ${pm} audit output`)
  const errorNote = describeJsonError(parsed.error)
  if (errorNote) return skipAudit(`${pm} audit failed: ${errorNote}`)
  const metadata = parsed.metadata as { vulnerabilities?: unknown } | undefined
  const vulnerabilities = metadata?.vulnerabilities
  if (vulnerabilities === null || typeof vulnerabilities !== 'object') {
    return skipAudit(`${pm} audit output has no metadata.vulnerabilities (exit code ${exec.code})`)
  }
  const count = (severity: string): number => {
    const value = (vulnerabilities as Record<string, unknown>)[severity]
    return typeof value === 'number' && Number.isFinite(value) ? value : 0
  }
  const critical = count('critical')
  const high = count('high')
  const moderate = count('moderate')
  const low = count('low')
  const info = count('info')
  const status: Status = critical > 0 || high > 0 ? 'fail' : moderate > 0 ? 'warn' : 'pass'
  const { advisories, truncated } = collectAdvisories(pm, parsed)
  return {
    status,
    available: true,
    critical,
    high,
    moderate,
    low,
    info,
    advisories,
    ...(truncated ? { advisoriesTruncated: true } : {}),
  }
}

const SEVERITY_RANK: Record<AdvisorySeverity, number> = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 }
/** Enough to act on; a template with more than this has a shared root cause, not 26 distinct fixes. */
const MAX_ADVISORIES = 25

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const asSeverity = (value: unknown): AdvisorySeverity | null =>
  typeof value === 'string' && value in SEVERITY_RANK ? (value as AdvisorySeverity) : null

const toAdvisory = (
  name: string,
  severity: AdvisorySeverity,
  direct: boolean,
  fixAvailable: boolean,
  via?: string,
): Advisory =>
  via && !direct ? { name, severity, direct, fixAvailable, via } : { name, severity, direct, fixAvailable }

/**
 * Per-package advisories from whichever shape the audit produced: npm 7+ keys
 * `vulnerabilities` by package, pnpm (npm 6 style) keys `advisories` by id. The counts
 * above come from `metadata` regardless; a missing or malformed list only means the names
 * are unknown, never that the audit failed. Worst severity first, then by name, capped.
 */
const collectAdvisories = (
  pm: string,
  parsed: Record<string, unknown>,
): { advisories: Advisory[]; truncated: boolean } => {
  const all = isRecord(parsed.vulnerabilities)
    ? npmAdvisories(parsed.vulnerabilities)
    : isRecord(parsed.advisories)
      ? pnpmAdvisories(parsed.advisories, pm === 'pnpm')
      : []
  all.sort(
    (left, right) =>
      SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity] || left.name.localeCompare(right.name),
  )
  return { advisories: all.slice(0, MAX_ADVISORIES), truncated: all.length > MAX_ADVISORIES }
}

/**
 * npm 7+: `via` mixes advisory objects (the package's own findings, carrying `url`/`title`)
 * with the names of vulnerable packages it CONSUMES; `effects` names what depends on it.
 * So the parent that pulls a transitive package in is the first name in `effects` (with
 * app -> middle -> leaf, `middle` has via ['leaf'] and effects ['app']); a `via` string
 * points the other way and is never used as the parent.
 */
const npmAdvisories = (vulnerabilities: Record<string, unknown>): Advisory[] => {
  const out: Advisory[] = []
  for (const [key, entry] of Object.entries(vulnerabilities)) {
    if (!isRecord(entry)) continue
    const severity = asSeverity(entry.severity)
    if (!severity) continue
    const name = typeof entry.name === 'string' && entry.name ? entry.name : key
    const direct = entry.isDirect === true
    const fixAvailable = entry.fixAvailable === true || isRecord(entry.fixAvailable)
    const via = direct ? undefined : firstPackageName(entry.effects)
    out.push(toAdvisory(name, severity, direct, fixAvailable, via))
  }
  return out
}

const firstPackageName = (list: unknown): string | undefined => {
  if (!Array.isArray(list)) return undefined
  for (const item of list) {
    if (typeof item === 'string' && item) return item
    if (isRecord(item) && typeof item.name === 'string' && item.name && !('url' in item) && !('source' in item))
      return item.name
  }
  return undefined
}

/**
 * The dependency chain of a finding path. pnpm prefixes every path with the workspace
 * importer (`.` for the root, `packages__app` or `app` for a workspace package), which
 * nothing distinguishes from a package name, so for pnpm the first segment is always
 * dropped: `.>lodash` reads as [lodash], `app>mkdirp>minimist` as [mkdirp, minimist].
 * npm 6 paths carry no importer: `lodash` and `mkdirp>minimist` are used as they are.
 */
const dependencyChain = (path: string, importerPrefixed: boolean): string[] => {
  const chain = path
    .split('>')
    .map((segment) => segment.trim())
    .filter(Boolean)
  return importerPrefixed ? chain.slice(1) : chain
}

/**
 * pnpm / npm 6: one entry per advisory id, so a package with two advisories is folded into
 * one line (worst severity, fixable only when every advisory has a patched version).
 * `findings[].paths` are `parent>child>...` chains (see `dependencyChain`); a chain of one
 * (or none, when a pnpm path is just the importer) means a direct dependency, otherwise its
 * first package is what pulls it in.
 */
const pnpmAdvisories = (advisories: Record<string, unknown>, importerPrefixed: boolean): Advisory[] => {
  const byName = new Map<string, Advisory>()
  for (const entry of Object.values(advisories)) {
    if (!isRecord(entry)) continue
    const severity = asSeverity(entry.severity)
    const name = typeof entry.module_name === 'string' ? entry.module_name : ''
    if (!severity || !name) continue
    const chains = Array.isArray(entry.findings)
      ? entry.findings.flatMap((finding: unknown) =>
          isRecord(finding) && Array.isArray(finding.paths)
            ? finding.paths
                .filter((path: unknown): path is string => typeof path === 'string')
                .map((path) => dependencyChain(path, importerPrefixed))
            : [],
        )
      : []
    const direct = chains.some((chain) => chain.length <= 1 || chain[0] === name)
    const fixAvailable = typeof entry.patched_versions === 'string' && entry.patched_versions !== '<0.0.0'
    const via = direct ? undefined : chains.find((chain) => chain.length > 1)?.[0]
    const previous = byName.get(name)
    byName.set(
      name,
      previous
        ? toAdvisory(
            name,
            SEVERITY_RANK[severity] < SEVERITY_RANK[previous.severity] ? severity : previous.severity,
            previous.direct || direct,
            previous.fixAvailable && fixAvailable,
            previous.via ?? via,
          )
        : toAdvisory(name, severity, direct, fixAvailable, via),
    )
  }
  return [...byName.values()]
}

export const skipDeps = (note: string): DepsResult => ({
  status: 'skip',
  available: false,
  total: 0,
  major: 0,
  minor: 0,
  patch: 0,
  outdated: [],
  note,
})
export const skipAudit = (note: string): AuditResult => ({
  status: 'skip',
  available: false,
  critical: 0,
  high: 0,
  moderate: 0,
  low: 0,
  info: 0,
  advisories: [],
  note,
})
