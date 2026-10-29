/**
 * Domain types for the templates health check.
 *
 * The health check answers five questions per template:
 *   1. Build health      - does it install + build (or pass its `ci` script)?
 *   2. Dependency health  - which deps are outdated, and are any vulnerable?
 *   3. Runtime health     - does the dev server actually boot? (web templates, opt-in)
 *   4. Deprecation         - are any installed packages flagged deprecated by the registry?
 *   5. Doc/reality drift   - do README / create-solana-dapp instructions match real scripts?
 *   6. Render QA           - does the booted page render without errors? (web templates, opt-in)
 *
 * The deeper judgment calls (is a whole stack still the recommended 2026 choice, does a
 * transaction actually land on devnet) are NOT decided here. This script produces the
 * machine-checkable facts; docs/agents/health-check.md drives the human/LLM judgment layer
 * on top of the JSON this emits.
 */

export type TemplateKind = 'next' | 'vite' | 'expo' | 'rust' | 'node' | 'unknown'

export type Status = 'pass' | 'warn' | 'fail' | 'skip'

/** A discovered template plus how we classified it. */
export type TemplateRef = {
  /** group-relative id, e.g. "kit/nextjs" */
  readonly id: string
  /** repokit group path, e.g. "kit" */
  readonly group: string
  /** absolute path to the template directory */
  readonly dir: string
  readonly kind: TemplateKind
  /** scripts present in the template's package.json */
  readonly scripts: Readonly<Record<string, string>>
  /** names of direct dependencies + devDependencies (for actionable deprecation filtering) */
  readonly directDeps: readonly string[]
  /** absolute path to the buildable Cargo.toml dir, or null when there's no Rust to check */
  readonly cargoManifestDir: string | null
  /** true for on-chain programs (SBF) — checked with `cargo check`; false host bins use `cargo build` */
  readonly isProgram: boolean
  /** package manager the template pins via its `packageManager` field (npm if unset) */
  readonly packageManager: string
  /** true when the template needs external services / API keys to run fully */
  readonly needsSecrets: boolean
  /** why we think it needs secrets (env files, known service deps) */
  readonly secretsReason?: string
  /** the exact env var names that require credentials (empty when detection came from prose) */
  readonly credentialKeys: readonly string[]
  /** every env var name the template declares in its .env.example/.env.sample/.env.template (superset of credentialKeys) */
  readonly declaredEnvKeys: readonly string[]
}

/**
 * A directory under a repokit group (or a configured group itself) that the health check could
 * not classify as a template. Reported in its own section with the reason, never counted as
 * pass, warn, fail or skip: "we could not check this" is not a verdict on the template.
 */
export type UnrecognizedEntry = {
  /** group-relative id like a template's, e.g. "community/foo"; the group path alone for a missing group */
  readonly id: string
  /** absolute path to the directory */
  readonly path: string
  /** why it was not recognised, e.g. "no package.json or Cargo.toml" */
  readonly reason: string
}

export type BuildResult = {
  readonly status: Status
  /** which phase ended the run */
  readonly phase: 'install' | 'build' | 'ci' | 'none'
  /** the exact command we ran for the failing/last phase */
  readonly command: string
  readonly exitCode: number | null
  readonly timedOut: boolean
  readonly durationMs: number
  /** last lines of combined output, for the report */
  readonly tail: string
}

export type OutdatedDep = {
  readonly name: string
  readonly current: string
  readonly latest: string
  readonly bump: 'major' | 'minor' | 'patch' | 'unknown'
}

export type DepsResult = {
  readonly status: Status
  readonly available: boolean
  readonly total: number
  readonly major: number
  readonly minor: number
  readonly patch: number
  readonly outdated: readonly OutdatedDep[]
  readonly note?: string
}

export type AdvisorySeverity = 'critical' | 'high' | 'moderate' | 'low' | 'info'

/**
 * One vulnerable package from the audit. Counts alone ("3 critical") can't be acted on;
 * this says which package, whether the template depends on it directly, and whether a
 * patched version exists.
 */
export type Advisory = {
  readonly name: string
  readonly severity: AdvisorySeverity
  /** true when the template's own package.json depends on it (bump it here, not upstream) */
  readonly direct: boolean
  /** a patched version exists (npm `fixAvailable`, pnpm `patched_versions`) */
  readonly fixAvailable: boolean
  /** for transitive packages: the dependency that pulls it in, when the audit says */
  readonly via?: string
}

export type AuditResult = {
  readonly status: Status
  readonly available: boolean
  readonly critical: number
  readonly high: number
  readonly moderate: number
  readonly low: number
  readonly info: number
  /**
   * worst severity first, then by name; capped (see `advisoriesTruncated`); empty when the
   * audit did not run. Absent only in reports written before this field existed.
   */
  readonly advisories?: readonly Advisory[]
  /** true when more advisories existed than the cap kept */
  readonly advisoriesTruncated?: boolean
  readonly note?: string
}

export type DeprecationResult = {
  readonly status: Status
  /** package names the registry flagged deprecated during install */
  readonly packages: readonly string[]
}

export type DocDriftResult = {
  readonly status: Status
  /** script names referenced in README / csd.instructions that don't exist in package.json */
  readonly missingScripts: readonly string[]
  readonly note?: string
}

export type BootResult = {
  readonly status: Status
  readonly available: boolean
  /** url that returned a successful response, if any */
  readonly url?: string
  readonly httpStatus?: number
  readonly durationMs?: number
  readonly note?: string
}

/**
 * Render QA (opt-in via --qa): the booted dev server opened in a headless browser.
 * Signals are kept raw so the report can show evidence; the verdict is derived by
 * the pure `classifyRender` in qa.ts (overlay / page error / blank page -> fail,
 * console errors or failed requests only -> warn).
 */
export type QaResult = {
  readonly status: Status
  /** false when no browser could be launched (environment problem, not a template fault) */
  readonly available: boolean
  readonly url?: string
  /** screenshot path relative to the report output dir, e.g. "screenshots/kit__nextjs.png" */
  readonly screenshot?: string
  /** console messages of type error, plus warnings that mention hydration */
  readonly consoleErrors: readonly string[]
  /** uncaught exceptions thrown by page scripts (first 20; newlines kept) */
  readonly pageErrors: readonly string[]
  /** how many page errors fired in total (absent in reports written before this field existed) */
  readonly pageErrorsTotal?: number
  /** same-origin requests that failed or answered >= 400 (favicon and hot-reload endpoints excluded) */
  readonly failedRequests: readonly string[]
  /** which framework error overlay was found, if any */
  readonly overlay?: string
  /** the overlay's visible text, bounded to ~500 chars, when one was found */
  readonly overlayText?: string
  /** body text under ~20 chars and no img/canvas/svg */
  readonly blank: boolean
  /** set when the harness itself failed (navigation timeout, unreachable server, inspection error): the signals above are partial */
  readonly harnessError?: string
  readonly durationMs: number
  readonly note?: string
}

/** Functional check for Rust templates: `cargo check` (programs) or `cargo build` (host bins). */
export type RustResult = {
  readonly status: Status
  /** false when cargo isn't installed or there's no Cargo.toml */
  readonly available: boolean
  readonly command: string
  readonly exitCode: number | null
  readonly timedOut: boolean
  readonly durationMs: number
  readonly tail: string
  /** whether `cargo test` (or build-sbf + test) actually ran */
  readonly tested: boolean
  readonly note?: string
}

export type TemplateReport = {
  readonly id: string
  readonly group: string
  readonly kind: TemplateKind
  /** worst status across all run dimensions */
  readonly status: Status
  readonly needsSecrets: boolean
  /** package manager actually used to install/build this template */
  readonly packageManager: string
  /** true when it failed on the first pass but passed an isolated retry (concurrency contention) */
  readonly flaky?: boolean
  readonly build: BuildResult
  readonly deps: DepsResult
  readonly audit: AuditResult
  readonly deprecation: DeprecationResult
  readonly docDrift: DocDriftResult
  readonly boot?: BootResult
  readonly rust?: RustResult
  readonly qa?: QaResult
}

export type HealthReport = {
  readonly schemaVersion: 1
  readonly generatedAt: string
  readonly packageManager: string
  readonly options: {
    readonly build: boolean
    readonly boot: boolean
    /** present (true) only on runs that opened templates in a headless browser */
    readonly qa?: boolean
    readonly source: 'local' | 'scaffold'
    /** `--cargo-test` was passed (absent in reports written before this field existed) */
    readonly cargoTest?: boolean
    /** explicit `--pm` override, null/absent when each template's pinned manager was used */
    readonly pm?: string | null
  }
  readonly summary: {
    readonly total: number
    readonly pass: number
    readonly warn: number
    readonly fail: number
    readonly skip: number
  }
  readonly templates: readonly TemplateReport[]
  /**
   * Directories under the groups that could not be checked (always written, `[]` when none).
   * Not part of `summary`. Optional in the type only so reports written before this field
   * existed still load.
   */
  readonly unrecognized?: readonly UnrecognizedEntry[]
}

// ---------- runner options ----------

export type RunOptions = {
  /** force a package manager; null means "use each template's pinned one (npm if unset)" */
  readonly packageManager: string | null
  readonly build: boolean
  readonly boot: boolean
  /** open each booted web template in a headless browser (implies boot) */
  readonly qa: boolean
  /** report output dir; QA screenshots are written under `<outDir>/screenshots/` */
  readonly outDir: string
  /** also run `cargo test` (host) / build-sbf + test (programs) for Rust templates */
  readonly cargoTest: boolean
  readonly installTimeoutMs: number
  readonly buildTimeoutMs: number
  /**
   * Credentials the maintainer chose to forward (`--env-file` / `--allow-env`). Each template
   * only ever receives the keys it declares (see credentialsForTemplate), and the values are
   * redacted from every report field.
   */
  readonly forwardedEnv: Readonly<Record<string, string>>
}

/** RunOptions after checkTemplate has picked the effective package manager and credentials for a template. */
export type ResolvedRunOptions = RunOptions & {
  readonly packageManager: string
  /** the subset of forwardedEnv this template declared, handed to install/build/boot */
  readonly templateEnv: Readonly<Record<string, string>>
}
