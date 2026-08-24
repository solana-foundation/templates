import { existsSync, readFileSync } from 'fs'
import { createHash } from 'node:crypto'
import type {
  BaselineAcknowledgement,
  SecurityBaseline,
  SecurityFinding,
  TriageResult,
  TriagedFinding,
} from './types.js'

export const EMPTY_SECURITY_BASELINE: SecurityBaseline = { acknowledgements: [], schemaVersion: 1 }

export function readSecurityBaseline(path: string): SecurityBaseline {
  if (!existsSync(path)) return EMPTY_SECURITY_BASELINE
  return parseSecurityBaseline(JSON.parse(readFileSync(path, 'utf8')) as unknown)
}

export function parseSecurityBaseline(value: unknown): SecurityBaseline {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.acknowledgements)) {
    throw new Error('Security baseline must have schemaVersion 1 and an acknowledgements array')
  }

  const acknowledgements = value.acknowledgements.map(parseAcknowledgement)
  const identities = new Set<string>()
  for (const acknowledgement of acknowledgements) {
    if (identities.has(acknowledgement.fingerprint)) {
      throw new Error(`Security baseline contains a duplicate acknowledgement for ${acknowledgement.location}`)
    }
    identities.add(acknowledgement.fingerprint)
  }

  return { acknowledgements, schemaVersion: 1 }
}

export function triageFindings(findings: readonly SecurityFinding[], baseline: SecurityBaseline): TriageResult {
  const acknowledgements = new Map(
    baseline.acknowledgements.map((acknowledgement) => [acknowledgement.fingerprint, acknowledgement]),
  )
  const findingIdentities = new Set<string>()
  const triagedFindings: TriagedFinding[] = []

  for (const finding of findings) {
    const identity = findingFingerprint(finding)
    if (findingIdentities.has(identity)) {
      throw new Error(`Scanner produced a duplicate finding for ${finding.location}`)
    }
    findingIdentities.add(identity)
    const acknowledgement = acknowledgements.get(identity)
    if (acknowledgement && !acknowledgementMatchesFinding(acknowledgement, finding)) {
      throw new Error(`Security baseline metadata does not match the finding for ${finding.location}`)
    }
    const { fingerprintEvidence: _fingerprintEvidence, ...reportFinding } = finding
    triagedFindings.push(
      acknowledgement
        ? { ...reportFinding, disposition: 'acknowledged', rationale: acknowledgement.rationale }
        : { ...reportFinding, disposition: 'new' },
    )
  }

  return {
    findings: triagedFindings,
    staleAcknowledgements: baseline.acknowledgements.filter(
      (acknowledgement) => !findingIdentities.has(acknowledgement.fingerprint),
    ),
  }
}

function acknowledgementMatchesFinding(acknowledgement: BaselineAcknowledgement, finding: SecurityFinding): boolean {
  return (
    acknowledgement.location === finding.location &&
    acknowledgement.ruleId === finding.ruleId &&
    acknowledgement.subject === finding.subject
  )
}

function parseAcknowledgement(value: unknown, index: number): BaselineAcknowledgement {
  if (!isRecord(value)) throw new Error(`Security baseline acknowledgement ${index + 1} must be an object`)

  const fingerprint = readString(value, 'fingerprint', index)
  if (!/^[a-f0-9]{64}$/.test(fingerprint)) {
    throw new Error(`Security baseline acknowledgement ${index + 1} has an invalid fingerprint`)
  }

  return {
    fingerprint,
    location: readString(value, 'location', index),
    rationale: readString(value, 'rationale', index),
    ruleId: readString(value, 'ruleId', index),
    subject: readString(value, 'subject', index),
  }
}

function readString(value: Record<string, unknown>, key: string, index: number): string {
  const field = value[key]
  if (typeof field !== 'string' || field.trim() === '') {
    throw new Error(`Security baseline acknowledgement ${index + 1} requires a non-empty ${key}`)
  }
  return field
}

export function findingFingerprint(finding: SecurityFinding): string {
  const identity = JSON.stringify([
    finding.category,
    finding.fingerprintEvidence ?? finding.evidence,
    finding.location,
    finding.ruleId,
    finding.severity,
    finding.subject,
  ])
  return createHash('sha256').update(identity).digest('hex')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
