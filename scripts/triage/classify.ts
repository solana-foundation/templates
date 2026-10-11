/**
 * Deterministic rules that turn a template's health result into findings.
 *
 * One PRIMARY finding describes the functional failure (build, rust, boot, qa) and is
 * chosen by the first matching rule in RULES, ordered from most specific to least. Zero
 * or more ADVISORY findings come from the structured fields (outdated majors, audit
 * counts, deprecated direct deps, doc drift). Everything is regex or field based so the
 * same report always produces the same findings.
 */

import { createHash } from 'crypto'
import type { Status } from '../health/types.js'
import type { Confidence, Finding, FindingClass, Severity, TriagedTemplateReport } from './types.js'

const MAX_EVIDENCE = 5

type Rule = {
  readonly class: FindingClass
  readonly confidence: Confidence
  readonly patterns: readonly RegExp[]
  readonly action: string
  readonly autoPatchable: boolean
}

/** Which classes patcher.ts has a recipe for. Kept here so classify and patcher agree. */
export const AUTO_PATCHABLE: ReadonlySet<FindingClass> = new Set<FindingClass>([
  'doc-drift',
  'lockfile-out-of-date',
  'vulnerable-deps',
])

/** Most specific first. A credentials hit beats a module hit, infra noise beats everything generic. */
export const RULES: readonly Rule[] = [
  {
    class: 'needs-credentials',
    confidence: 'high',
    patterns: [
      /missing required env/i,
      /environment variables? .*?\b(is |are )?(required|missing|not set|undefined)\b/i,
      /\b[A-Z0-9_]*(API_?KEY|SECRET|PRIVATE_?KEY|SUPABASE_URL|PRIVY_APP)[A-Z0-9_]*\b.*\b(required|missing|not (set|defined|found)|undefined|is empty)\b/i,
      /invalid api key/i,
      /\bprocess\.env\.[A-Z0-9_]+ is (undefined|not (set|defined))/i,
    ],
    action: 'Provide a sandbox credential or mark the template as needing setup; this is not a code break.',
    autoPatchable: false,
  },
  {
    class: 'temp-dir-or-process',
    confidence: 'medium',
    patterns: [
      /\b(ENOTEMPTY|EADDRINUSE|EBUSY|EMFILE|ENFILE|ENOSPC|ENOMEM|EPERM|EACCES)\b/,
      /JavaScript heap out of memory/i,
      /\bSIGKILL\b|\bKilled\b/,
      /^TIMED OUT( after \d+s)?$/m,
      /address already in use/i,
    ],
    action: 'Re-run the template alone (pnpm health --only <id>) before treating this as a template bug.',
    autoPatchable: false,
  },
  {
    class: 'registry-or-network',
    confidence: 'medium',
    patterns: [
      /\b(ETIMEDOUT|ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|ERR_SOCKET_TIMEOUT|E429|E503)\b/,
      /\b(429|503) (Too Many Requests|Service Unavailable)\b/i,
      /ERR_PNPM_(META_)?FETCH(_FAIL)?/,
      /\bFetchError\b|socket hang up|getaddrinfo|network (request|error)|request to https?:\/\/\S+ failed/i,
      /registry\.(npmjs|yarnpkg)\.org.*(fail|timed? ?out|unavailable)/i,
      /failed to download from|couldn't resolve host|spurious network error/i,
    ],
    action: 'Retry; a registry or network blip is not a template bug unless it reproduces on a second run.',
    autoPatchable: false,
  },
  {
    class: 'lockfile-out-of-date',
    confidence: 'high',
    patterns: [
      /ERR_PNPM_OUTDATED_LOCKFILE/,
      /lockfile (is )?(out of date|not up to date|needs (to be )?updated?)/i,
      /npm ci can only install packages when your package\.json and package-lock\.json/i,
      /Missing: \S+ from lock file/i,
      /Your lockfile needs to be updated/i,
      /frozen-lockfile/i,
    ],
    action: 'Regenerate the lockfile with the template package manager and commit it.',
    autoPatchable: true,
  },
  {
    class: 'peer-dependency-conflict',
    confidence: 'high',
    patterns: [
      /\bERESOLVE\b/,
      /unable to resolve dependency tree/i,
      /Conflicting peer dependency/i,
      /ERR_PNPM_PEER_DEP_ISSUES/,
      /peer dep(endency|endencies)? .*?(conflict|unmet|missing)/i,
    ],
    action: 'Align the conflicting peer ranges in package.json (check the ERESOLVE block for the two packages).',
    autoPatchable: false,
  },
  {
    class: 'missing-module',
    confidence: 'high',
    patterns: [
      /Cannot find (module|package) ['"]/,
      /Module not found: (Can't|Cannot) resolve/i,
      /\bERR_MODULE_NOT_FOUND\b|\bMODULE_NOT_FOUND\b/,
      /Failed to resolve (import|entry|module)/i,
      /Could not resolve ["'].+?["'] from/i,
    ],
    action: 'Add the missing dependency or fix the import path; check whether a package renamed its entry point.',
    autoPatchable: false,
  },
  {
    class: 'framework-breaking-change',
    confidence: 'medium',
    patterns: [
      /Invalid next\.config|Unrecognized key\(s\) in object/i,
      /has been (removed|renamed|moved) in (Next|React|Vite|Expo|Tailwind)/i,
      /is no longer supported in Next\.js/i,
      /experimental\.\w+ (has been|is|was) (moved|removed|deprecated)/i,
      /\[vite\].*(deprecated|removed|no longer)/i,
      /Expo SDK \d+ .*?(no longer|unsupported|requires)/i,
      /\bEBADENGINE\b|Unsupported engine|engine "node" is incompatible/i,
      /Node\.js version .*? is required|requires Node\.js \d+/i,
    ],
    action: 'Read the framework migration guide for the version in evidence and update config or the Node engine.',
    autoPatchable: false,
  },
  {
    class: 'typescript-error',
    confidence: 'high',
    patterns: [/\berror TS\d{4}\b/, /\bTS\d{4}:/, /^Type error:/m, /Type '.+?' is not assignable to type/],
    action: 'Fix the type error in the template source (often a dependency changed its exported types).',
    autoPatchable: false,
  },
  {
    class: 'rust-compile',
    confidence: 'high',
    patterns: [
      /error\[E\d{4}\]/,
      /error: could not compile/i,
      /unresolved import|cannot find (crate|macro|function|type)/i,
      /failed to select a version for/i,
      /linker .*? not found/i,
    ],
    action:
      'Fix the Rust compile error; check whether a pinned crate (pinocchio, anchor-lang) published a breaking release.',
    autoPatchable: false,
  },
]

const stripNoise = (line: string): string =>
  line
    .replace(/\/(private\/)?(var|tmp)\/[^\s'"`]+/g, '<tmp>')
    .replace(/sf-templates-health-\d+-[^\s/'"`]+/g, '<tmp>')
    .replace(/\b\d+(\.\d+)?(ms|s|m)\b/g, '<t>')
    .replace(/\s+/g, ' ')
    .trim()

/** sha1 of the normalized first evidence line: stable across runs, specific to the message. */
const dedupeKeyFor = (templateId: string, cls: FindingClass, evidence: readonly string[]): string => {
  const sample = stripNoise(evidence[0] ?? '').toLowerCase()
  const digest = createHash('sha1').update(`${templateId}|${cls}|${sample}`).digest('hex').slice(0, 10)
  return `${templateId}#${cls}#${digest}`
}

const matchLines = (text: string, patterns: readonly RegExp[]): string[] => {
  const lines = text.split('\n')
  const hits: string[] = []
  for (const line of lines) {
    if (patterns.some((pattern) => pattern.test(line))) hits.push(line.trim())
    if (hits.length >= MAX_EVIDENCE) break
  }
  return hits
}

const lastLines = (text: string, count = MAX_EVIDENCE): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-count)

type FailingPhase = {
  readonly what: 'rust' | 'boot' | 'qa' | 'build'
  readonly command: string
  readonly tail: string
  /** structured timeout flag from the health check; beats any text match */
  readonly timedOut: boolean
}

/**
 * Run options the health check recorded. `boot` and `cargoTest` and `pm` are being added
 * to HealthReport.options on the health-check branch; read them when present and fall
 * back to what the finding class implies otherwise.
 */
export type ReproOptions = {
  readonly boot?: boolean
  readonly cargoTest?: boolean
  readonly pm?: string | null
}

/** `pnpm health --only <id>` plus the flags needed to reach the failing phase again. */
const healthCommand = (template: TriagedTemplateReport, phase: FailingPhase | null, options: ReproOptions): string => {
  const flags = [`--only ${template.id}`]
  const boot = options.boot ?? (phase?.what === 'boot' || phase?.what === 'qa')
  if (boot) flags.push('--boot')
  const cargoTest = options.cargoTest ?? Boolean(phase?.what === 'rust' && template.rust?.tested)
  if (cargoTest) flags.push('--cargo-test')
  if (typeof options.pm === 'string' && options.pm.length > 0) flags.push(`--pm ${options.pm}`)
  return `pnpm health ${flags.join(' ')}`
}

/**
 * The health check labels Rust results with human text ("cargo check (program)",
 * "cargo check && cargo-build-sbf && cargo test"). Map that back to the single cargo
 * command that failed. The manifest dir is only known when the report records it.
 */
const rustManualCommand = (template: TriagedTemplateReport): string | null => {
  const rust = template.rust as (TriagedTemplateReport['rust'] & { manifestDir?: string }) | undefined
  if (!rust?.manifestDir) return null
  const label = rust.command
  const verb = label.includes('cargo test')
    ? 'cargo test'
    : label.includes('cargo-build-sbf')
      ? 'cargo-build-sbf'
      : label.startsWith('cargo build')
        ? 'cargo build'
        : 'cargo check'
  const dir = rust.manifestDir === '.' ? template.id : `${template.id}/${rust.manifestDir}`
  return `cd ${dir} && ${verb}`
}

/** Mirror of report.ts failureBlock: rust beats boot beats build, so the repro points at the real break. */
const failingPhase = (template: TriagedTemplateReport): FailingPhase | null => {
  if (template.rust?.status === 'fail')
    return {
      what: 'rust',
      command: rustManualCommand(template) ?? '',
      tail: template.rust.tail,
      timedOut: template.rust.timedOut,
    }
  if (template.boot?.status === 'fail')
    return {
      what: 'boot',
      command: `cd ${template.id} && ${template.packageManager} run dev`,
      tail: template.boot.note ?? '',
      timedOut: false,
    }
  if (template.qa?.status === 'fail') return { what: 'qa', command: '', tail: template.qa.note ?? '', timedOut: false }
  if (template.build.status === 'fail')
    return {
      what: 'build',
      command: template.build.command.startsWith('(') ? '' : `cd ${template.id} && ${template.build.command}`,
      tail: template.build.tail,
      timedOut: template.build.timedOut,
    }
  return null
}

const reproFor = (template: TriagedTemplateReport, phase: FailingPhase | null, options: ReproOptions): string => {
  const parts = [healthCommand(template, phase, options)]
  if (phase?.command) parts.push(phase.command)
  return parts.join('\n')
}

const finding = (
  template: TriagedTemplateReport,
  cls: FindingClass,
  severity: Severity,
  confidence: Confidence,
  evidence: readonly string[],
  reproduce: string,
  recommendedAction: string,
  regression: boolean,
): Finding => ({
  templateId: template.id,
  class: cls,
  severity,
  confidence,
  evidence: evidence.slice(0, MAX_EVIDENCE),
  reproduce,
  recommendedAction,
  autoPatchable: AUTO_PATCHABLE.has(cls),
  regression,
  dedupeKey: dedupeKeyFor(template.id, cls, evidence),
})

/** The one finding that explains why a template is `fail` (or `skip` for credentials). */
export const classifyPrimary = (
  template: TriagedTemplateReport,
  regression: boolean,
  options: ReproOptions = {},
): Finding | null => {
  // The health check turns a credential-caused build failure into `skip` while leaving the
  // build result as `fail`. Surface it as a warn so the human knows the template was not
  // verified, without calling it broken. Any other skip is "could not verify": no finding.
  if (template.status === 'skip') {
    if (!template.needsSecrets) return null
    return finding(
      template,
      'needs-credentials',
      'warn',
      'high',
      lastLines(template.build.tail),
      reproFor(template, null, options),
      'Verify with a sandbox credential, or leave as "skipped: requires credentials"; not a code break.',
      false,
    )
  }

  const phase = failingPhase(template)
  if (!phase) return null

  const repro = reproFor(template, phase, options)

  // The structured flag is authoritative: a timed out cargo or npm run is infra noise to
  // retry alone, whatever the output text says.
  if (phase.timedOut) {
    const timeoutRule = RULES.find((rule) => rule.class === 'temp-dir-or-process')!
    const hits = matchLines(phase.tail, timeoutRule.patterns)
    return finding(
      template,
      'temp-dir-or-process',
      'fail',
      'medium',
      hits.length ? hits : [`timed out (${phase.what})`, ...lastLines(phase.tail, 4)],
      repro,
      timeoutRule.action,
      regression,
    )
  }

  for (const rule of RULES) {
    const hits = matchLines(phase.tail, rule.patterns)
    if (hits.length === 0) continue
    // A rust tail that matches a generic rule (network, temp dir) keeps that class: the
    // generic cause is still the right first thing to rule out.
    return finding(template, rule.class, 'fail', rule.confidence, hits, repro, rule.action, regression)
  }

  if (phase.what === 'rust')
    return finding(
      template,
      'rust-compile',
      'fail',
      'medium',
      lastLines(phase.tail),
      repro,
      'cargo failed without a recognised error line; read the full output and reproduce locally.',
      regression,
    )
  if (phase.what === 'boot')
    return finding(
      template,
      'boot-failure',
      'fail',
      'medium',
      lastLines(phase.tail),
      repro,
      'The build passed but the dev server did not answer; run it by hand and check the first error it prints.',
      regression,
    )
  if (phase.what === 'qa')
    return finding(
      template,
      'qa-render-failure',
      'fail',
      'medium',
      lastLines(phase.tail),
      repro,
      'The page rendered an error state; open the template in a browser and check the console.',
      regression,
    )
  return finding(
    template,
    'unknown-failure',
    'fail',
    'low',
    lastLines(phase.tail),
    repro,
    'No rule matched; reproduce by hand and add a rule to scripts/triage/classify.ts once the cause is known.',
    regression,
  )
}

const auditCount = (template: TriagedTemplateReport): number =>
  template.audit.critical + template.audit.high + template.audit.moderate

/** Advisory findings from the structured fields. These never carry `fail`. */
export const classifyAdvisory = (template: TriagedTemplateReport, options: ReproOptions = {}): Finding[] => {
  const out: Finding[] = []
  const repro = reproFor(template, null, options)

  if (template.deps.available && template.deps.major > 0) {
    const majors = template.deps.outdated.filter((dep) => dep.bump === 'major')
    out.push(
      finding(
        template,
        'outdated-major',
        'warn',
        'high',
        majors.map((dep) => `${dep.name} ${dep.current} -> ${dep.latest}`),
        repro,
        `Plan the ${majors.length} major bump(s) one at a time; each may carry breaking changes.`,
        false,
      ),
    )
  }

  if (template.audit.available && auditCount(template) > 0) {
    const { critical, high, moderate } = template.audit
    out.push(
      finding(
        template,
        'vulnerable-deps',
        'warn',
        'high',
        [`${critical} critical, ${high} high, ${moderate} moderate (${template.packageManager} audit)`],
        repro,
        critical + high > 0
          ? 'Bump the vulnerable dependency ranges now; critical or high advisories overlap dependabot but should not wait.'
          : 'Bump the vulnerable dependency ranges in the next maintenance pass.',
        false,
      ),
    )
  }

  if (template.deprecation.packages.length > 0) {
    out.push(
      finding(
        template,
        'deprecated-direct-dep',
        'warn',
        'high',
        template.deprecation.packages.map((spec) => `deprecated ${spec}`),
        repro,
        'Replace the deprecated direct dependency with its documented successor.',
        false,
      ),
    )
  }

  if (template.docDrift.missingScripts.length > 0) {
    out.push(
      finding(
        template,
        'doc-drift',
        'warn',
        'high',
        template.docDrift.missingScripts.map((script) => `README references missing script: ${script}`),
        repro,
        'Point the README at a script that exists, or add the script the README promises.',
        false,
      ),
    )
  }

  return out
}

export const classifyTemplate = (
  template: TriagedTemplateReport,
  regression: boolean,
  options: ReproOptions = {},
): Finding[] => {
  if (template.status === 'pass') return []
  const primary = classifyPrimary(template, regression, options)
  return [...(primary ? [primary] : []), ...classifyAdvisory(template, options)]
}

const severityRank: Record<Severity, number> = { fail: 0, warn: 1 }

/** Regressions first, then fails, then warns; ties keep template order then class order. */
export const sortFindings = (findings: readonly Finding[]): Finding[] =>
  [...findings].sort((left, right) => {
    if (left.regression !== right.regression) return left.regression ? -1 : 1
    if (left.severity !== right.severity) return severityRank[left.severity] - severityRank[right.severity]
    if (left.templateId !== right.templateId) return left.templateId.localeCompare(right.templateId)
    return left.class.localeCompare(right.class)
  })

export const classifyReport = (
  templates: readonly TriagedTemplateReport[],
  regressions: ReadonlySet<string>,
  options: ReproOptions = {},
): Finding[] =>
  sortFindings(templates.flatMap((template) => classifyTemplate(template, regressions.has(template.id), options)))

/** Pull the repro-relevant run options out of a report; missing fields stay undefined. */
export const reproOptionsOf = (report: { readonly options: object }): ReproOptions => {
  const raw = report.options as { boot?: unknown; cargoTest?: unknown; pm?: unknown }
  return {
    boot: typeof raw.boot === 'boolean' ? raw.boot : undefined,
    cargoTest: typeof raw.cargoTest === 'boolean' ? raw.cargoTest : undefined,
    pm: typeof raw.pm === 'string' ? raw.pm : undefined,
  }
}

/** For the issue classifier: a template's health status from the latest report. */
export const statusOf = (templates: readonly TriagedTemplateReport[], id: string): Status | 'unknown' =>
  templates.find((template) => template.id === id)?.status ?? 'unknown'
