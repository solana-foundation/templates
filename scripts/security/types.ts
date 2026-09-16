export type FindingSeverity = 'high' | 'medium' | 'low'

export type FindingCategory =
  | 'dependency-build'
  | 'dependency-source'
  | 'dependency-version'
  | 'lifecycle-script'
  | 'pnpm-policy'
  | 'scan-coverage'
  | 'source-pattern'

export type SecurityFinding = {
  readonly category: FindingCategory
  readonly evidence: string
  readonly fingerprintEvidence?: string
  readonly location: string
  readonly message: string
  readonly recommendation: string
  readonly ruleId: string
  readonly severity: FindingSeverity
  readonly subject: string
}

export type BaselineAcknowledgement = {
  readonly fingerprint: string
  readonly location: string
  readonly rationale: string
  readonly ruleId: string
  readonly subject: string
}

export type SecurityBaseline = {
  readonly acknowledgements: readonly BaselineAcknowledgement[]
  readonly schemaVersion: 1
}

export type TriagedFinding = Omit<SecurityFinding, 'fingerprintEvidence'> & {
  readonly disposition: 'acknowledged' | 'new'
  readonly rationale?: string
}

export type SecuritySummary = {
  readonly acknowledged: number
  readonly high: number
  readonly low: number
  readonly medium: number
  readonly new: number
  readonly staleAcknowledgements: number
  readonly total: number
}

export type SecurityReport = {
  readonly findings: readonly TriagedFinding[]
  readonly generatedAt: string
  readonly scannedDependencyPackages: number
  readonly scannedTemplates: number
  readonly schemaVersion: 1
  readonly staleAcknowledgements: readonly BaselineAcknowledgement[]
  readonly summary: SecuritySummary
}

export type ScanResult = {
  readonly findings: readonly SecurityFinding[]
  readonly scannedDependencyPackages: number
  readonly scannedTemplates: number
}

export type TriageResult = {
  readonly findings: readonly TriagedFinding[]
  readonly staleAcknowledgements: readonly BaselineAcknowledgement[]
}
