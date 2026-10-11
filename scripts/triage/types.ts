/**
 * Domain types for the triage layer that sits on top of the health check.
 *
 * Stage 1 reads a HealthReport (scripts/health/types.ts), turns every non-pass template
 * into one or more Findings with a deterministic class, and renders a report plus optional
 * patch proposals. Stage 2 (issue.ts) classifies a GitHub issue with the same rule-based
 * spirit. Nothing here calls an LLM, files an issue, or opens a PR: the output is material
 * for a human to act on.
 */

import type { Status, TemplateReport } from '../health/types.js'

export type FindingClass =
  | 'lockfile-out-of-date'
  | 'peer-dependency-conflict'
  | 'missing-module'
  | 'typescript-error'
  | 'framework-breaking-change'
  | 'registry-or-network'
  | 'temp-dir-or-process'
  | 'needs-credentials'
  | 'rust-compile'
  | 'boot-failure'
  | 'qa-render-failure'
  | 'outdated-major'
  | 'vulnerable-deps'
  | 'deprecated-direct-dep'
  | 'doc-drift'
  | 'unknown-failure'

export const FINDING_CLASSES: readonly FindingClass[] = [
  'lockfile-out-of-date',
  'peer-dependency-conflict',
  'missing-module',
  'typescript-error',
  'framework-breaking-change',
  'registry-or-network',
  'temp-dir-or-process',
  'needs-credentials',
  'rust-compile',
  'boot-failure',
  'qa-render-failure',
  'outdated-major',
  'vulnerable-deps',
  'deprecated-direct-dep',
  'doc-drift',
  'unknown-failure',
]

export type Severity = 'fail' | 'warn'
export type Confidence = 'high' | 'medium' | 'low'

export type Finding = {
  readonly templateId: string
  readonly class: FindingClass
  /** fail = the template is functionally broken; warn = works but needs attention */
  readonly severity: Severity
  /** how sure the rule is that the class is right (a regex hit on one line is not proof) */
  readonly confidence: Confidence
  /** the matched output lines, at most 5 */
  readonly evidence: readonly string[]
  /** exact commands a human runs to see it again */
  readonly reproduce: string
  /** one sentence: what to do about it */
  readonly recommendedAction: string
  /** true when patcher.ts has a recipe for this class */
  readonly autoPatchable: boolean
  /** true when the template passed (or warned) in the baseline and fails now */
  readonly regression: boolean
  /** stable across runs for the same template + class + normalized evidence */
  readonly dedupeKey: string
}

/**
 * The health check does not emit a `qa` field yet (issue #452). When it does, the triage
 * layer is ready for it: a failed render becomes a qa-render-failure finding.
 */
export type QaResult = {
  readonly status: Status
  readonly note?: string
  readonly screenshot?: string
}

export type TriagedTemplateReport = TemplateReport & { readonly qa?: QaResult }

export type TriageSummary = {
  readonly templates: number
  readonly findings: number
  readonly regressions: number
  readonly fails: number
  readonly warns: number
  readonly autoPatchable: number
  readonly byClass: Readonly<Record<FindingClass, number>>
}

export type TriageReport = {
  readonly schemaVersion: 1
  readonly generatedAt: string
  readonly source: {
    readonly report: string
    readonly reportGeneratedAt: string
    readonly baseline: string | null
  }
  readonly summary: TriageSummary
  /** regressions first, then fails, then warns; stable order within each bucket */
  readonly findings: readonly Finding[]
}

export type DraftIssue = {
  readonly title: string
  readonly body: string
}

// ---------- patcher ----------

export type PatchProposal =
  | {
      readonly patchable: true
      readonly finding: Finding
      /** unified diff with repo-relative a/ b/ paths, ready for `git apply` from the repo root */
      readonly diff: string
      readonly title: string
      readonly body: string
    }
  | {
      readonly patchable: false
      readonly finding: Finding
      readonly reason: string
    }

// ---------- stage 2: issue classifier ----------

export type IssueKind = 'bug' | 'question' | 'feature' | 'duplicate' | 'needs-info'

export type IssueInput = {
  readonly number: number
  readonly title: string
  readonly body: string
  readonly labels: readonly string[]
  readonly comments: readonly string[]
}

export type OpenIssueRef = {
  readonly number: number
  readonly title: string
}

export type IssueTriage = {
  readonly number: number
  readonly kind: IssueKind
  readonly confidence: Confidence
  readonly referencedTemplates: readonly string[]
  /** latest health status per referenced template, when a report was available */
  readonly templateHealth: Readonly<Record<string, Status | 'unknown'>>
  readonly signals: {
    readonly hasReproSteps: boolean
    readonly hasVersions: boolean
    readonly hasErrorOutput: boolean
  }
  /** the most similar open issue, when one crosses the duplicate threshold */
  readonly duplicateOf: OpenIssueRef | null
  readonly commentDraft: string
}
