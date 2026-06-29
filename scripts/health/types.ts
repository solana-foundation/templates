/**
 * Domain types for the templates health check.
 *
 * The health check answers five questions per template:
 *   1. Build health      - does it install + build (or pass its `ci` script)?
 *   2. Dependency health  - which deps are outdated, and are any vulnerable?
 *   3. Runtime health     - does the dev server actually boot? (web templates, opt-in)
 *   4. Deprecation         - are any installed packages flagged deprecated by the registry?
 *   5. Doc/reality drift   - do README / create-solana-dapp instructions match real scripts?
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

export type AuditResult = {
  readonly status: Status
  readonly available: boolean
  readonly critical: number
  readonly high: number
  readonly moderate: number
  readonly low: number
  readonly info: number
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
}

export type HealthReport = {
  readonly schemaVersion: 1
  readonly generatedAt: string
  readonly packageManager: string
  readonly options: {
    readonly build: boolean
    readonly boot: boolean
    readonly source: 'local' | 'scaffold'
  }
  readonly summary: {
    readonly total: number
    readonly pass: number
    readonly warn: number
    readonly fail: number
    readonly skip: number
  }
  readonly templates: readonly TemplateReport[]
}
