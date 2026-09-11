import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'fs'
import { basename, extname, isAbsolute, join, relative, resolve } from 'path'
import { parse } from 'yaml'
import type { FindingSeverity, ScanResult, SecurityFinding } from './types.js'

type JsonRecord = Record<string, unknown>

type TemplatePackage = {
  readonly dependencies?: Record<string, string>
  readonly devDependencies?: Record<string, string>
  readonly name?: string
  readonly optionalDependencies?: Record<string, string>
  readonly peerDependencies?: Record<string, string>
  readonly scripts?: Record<string, string>
  readonly version?: string
}

type RootPackage = {
  readonly repokit?: {
    readonly groups?: readonly { readonly path?: string }[]
  }
}

type PnpmPolicy = {
  readonly dangerouslyAllowAllBuilds: boolean
  readonly onlyBuiltDependencies: ReadonlySet<string>
}

const INSTALL_LIFECYCLE_SCRIPTS = new Set(['preinstall', 'install', 'postinstall'])
const PUBLISH_LIFECYCLE_SCRIPTS = new Set(['prepare', 'prepack', 'prepublish', 'prepublishOnly'])
const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'] as const
const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.next',
  'build',
  'coverage',
  'dist',
  'generated',
  'node_modules',
  'out',
  'target',
])
const REVIEWABLE_EXTENSIONS = new Set(['.cjs', '.js', '.mjs', '.ps1', '.sh', '.ts'])

const SOURCE_PATTERNS: readonly {
  readonly evidence: string
  readonly message: string
  readonly recommendation: string
  readonly regex: RegExp
  readonly ruleId: string
  readonly source: 'code' | 'uncommented'
  readonly severity: FindingSeverity
}[] = [
  {
    evidence: 'dynamic code evaluation',
    message: 'Setup or configuration code dynamically evaluates source text.',
    recommendation: 'Replace dynamic evaluation with explicit, reviewable code or document why it is required.',
    regex: /\beval\s*\(|\b(?:new\s+)?Function\s*\(/,
    ruleId: 'source-dynamic-evaluation',
    source: 'code',
    severity: 'high',
  },
  {
    evidence: 'encoded payload',
    message: 'Setup or configuration code contains a long encoded payload.',
    recommendation: 'Store readable source or generated data separately and document how it is produced.',
    regex: /["'`][A-Za-z0-9+/_-]{160,}={0,2}["'`]/,
    ruleId: 'source-encoded-payload',
    source: 'uncommented',
    severity: 'high',
  },
  {
    evidence: 'child process execution',
    message: 'Setup or configuration code launches a child process.',
    recommendation: 'Review the command, arguments, input handling, and necessity of process execution.',
    regex: /(?:from\s+|require\s*\()["'](?:node:)?child_process["']/,
    ruleId: 'source-child-process',
    source: 'uncommented',
    severity: 'medium',
  },
  {
    evidence: 'child process execution',
    message: 'Setup or configuration code launches a child process.',
    recommendation: 'Review the command, arguments, input handling, and necessity of process execution.',
    regex: /\b(?:exec|execFile|execFileSync|execSync|fork|spawn|spawnSync)\s*\(/,
    ruleId: 'source-child-process',
    source: 'code',
    severity: 'medium',
  },
  {
    evidence: 'network access',
    message: 'Setup or configuration code performs a network request.',
    recommendation: 'Confirm the destination is expected and that untrusted responses cannot become executable code.',
    regex: /\b(?:fetch|axios|got)\s*\(|\baxios\.(?:get|post|put|request)\s*\(|\bhttps?\.(?:get|request)\s*\(/,
    ruleId: 'source-network-access',
    source: 'code',
    severity: 'low',
  },
  {
    evidence: 'network download command',
    message: 'Setup or configuration code invokes a network-capable download command.',
    recommendation: 'Pin and verify downloaded artifacts, and avoid piping remote content into an interpreter.',
    regex: /\b(?:curl|wget|Invoke-WebRequest|iwr|Invoke-RestMethod|irm)\b/i,
    ruleId: 'source-network-download',
    source: 'uncommented',
    severity: 'high',
  },
  {
    evidence: 'explicit command shell',
    message: 'Setup or configuration code invokes a command shell explicitly.',
    recommendation: 'Review shell quoting and ensure no untrusted values can alter the command.',
    regex: /\b(?:bash|sh)\s+-c\b|\bcmd(?:\.exe)?\s+\/c\b|\bpowershell(?:\.exe)?\s+-command\b/i,
    ruleId: 'source-shell-execution',
    source: 'uncommented',
    severity: 'medium',
  },
]

const SCRIPT_PATTERNS: readonly {
  readonly message: string
  readonly recommendation: string
  readonly regex: RegExp
  readonly ruleId: string
  readonly severity: FindingSeverity
}[] = [
  {
    message: 'Package script downloads content or invokes a network-capable shell command.',
    recommendation: 'Pin and verify downloaded artifacts, or move the behavior into readable source code.',
    regex: /\b(?:curl|wget|Invoke-WebRequest|iwr|Invoke-RestMethod|irm)\b/i,
    ruleId: 'script-network-download',
    severity: 'high',
  },
  {
    message: 'Package script executes inline code or an encoded PowerShell command.',
    recommendation: 'Move inline logic into a reviewed source file and avoid encoded commands.',
    regex: /\bnode\s+(?:--eval|-e)\b|\bpowershell(?:\.exe)?\b.*\b-enc(?:odedcommand)?\b/i,
    ruleId: 'script-inline-execution',
    severity: 'medium',
  },
  {
    message: 'Package script invokes a command shell explicitly.',
    recommendation: 'Review shell quoting and ensure no untrusted values can alter the command.',
    regex: /\b(?:bash|sh)\s+-c\b|\bcmd(?:\.exe)?\s+\/c\b|\bpowershell(?:\.exe)?\s+-command\b/i,
    ruleId: 'script-shell-execution',
    severity: 'medium',
  },
]

export function scanRepository(rootDir: string): ScanResult {
  const repositoryRoot = realpathSync(rootDir)
  const findings: SecurityFinding[] = []
  const policy = readPnpmPolicy(repositoryRoot, findings)
  const templateDirs = enumerateTemplateDirs(repositoryRoot)
  const lockedTemplates = readLockedTemplates(repositoryRoot, findings)

  for (const templateDir of templateDirs) {
    const manifestPath = join(templateDir, 'package.json')
    const manifest = readJson<TemplatePackage>(manifestPath)
    const template = toRepoPath(repositoryRoot, templateDir)
    scanManifest(manifest, template, findings)
    scanDependencyCoverage(manifest, template, lockedTemplates, findings)
    scanReviewableSource(repositoryRoot, templateDir, template, collectScriptEntrypoints(manifest), findings)
  }

  const scannedDependencyPackages = scanInstalledDependencyBuilds(repositoryRoot, policy, findings)

  return {
    findings: findings.sort(compareFindings),
    scannedDependencyPackages,
    scannedTemplates: templateDirs.length,
  }
}

function readLockedTemplates(rootDir: string, findings: SecurityFinding[]): ReadonlySet<string> {
  const lockfilePath = join(rootDir, 'pnpm-lock.yaml')
  if (!existsSync(lockfilePath)) {
    findings.push({
      category: 'scan-coverage',
      evidence: 'pnpm-lock.yaml is missing',
      location: 'pnpm-lock.yaml',
      message: 'Installed dependency versions cannot be tied to a committed workspace lockfile.',
      recommendation: 'Restore and update pnpm-lock.yaml before reviewing transitive dependency behavior.',
      ruleId: 'workspace-lockfile-missing',
      severity: 'high',
      subject: 'workspace',
    })
    return new Set()
  }
  const parsed = parse(readFileSync(lockfilePath, 'utf8')) as JsonRecord
  if (!parsed.importers || typeof parsed.importers !== 'object' || Array.isArray(parsed.importers)) {
    findings.push({
      category: 'scan-coverage',
      evidence: 'pnpm-lock.yaml has no importer map',
      location: 'pnpm-lock.yaml',
      message: 'The workspace lockfile does not identify which templates its resolutions cover.',
      recommendation: 'Regenerate pnpm-lock.yaml with the repository pnpm version.',
      ruleId: 'workspace-lockfile-importers-missing',
      severity: 'high',
      subject: 'workspace',
    })
    return new Set()
  }
  return new Set(Object.keys(parsed.importers as JsonRecord).map((path) => path.replaceAll('\\', '/')))
}

function scanDependencyCoverage(
  manifest: TemplatePackage,
  template: string,
  lockedTemplates: ReadonlySet<string>,
  findings: SecurityFinding[],
): void {
  if (lockedTemplates.has(template)) return
  const dependencyCount = DEPENDENCY_SECTIONS.reduce(
    (count, section) => count + Object.keys(manifest[section] ?? {}).length,
    0,
  )
  if (dependencyCount === 0) return

  findings.push({
    category: 'scan-coverage',
    evidence: `${dependencyCount} direct dependencies; no ${template} importer in pnpm-lock.yaml`,
    location: `${template}/package.json`,
    message:
      'The template is not represented in the workspace lockfile, so installed transitive dependency scripts are not covered.',
    recommendation:
      'Review how this template is locked or add a separate dependency-resolution scan before treating transitive coverage as complete.',
    ruleId: 'template-lockfile-coverage-missing',
    severity: 'low',
    subject: manifest.name ?? template,
  })
}

function enumerateTemplateDirs(rootDir: string): readonly string[] {
  const rootPackage = readJson<RootPackage>(join(rootDir, 'package.json'))
  const groupPaths = rootPackage.repokit?.groups?.flatMap((group) => (group.path ? [group.path] : [])) ?? []
  if (groupPaths.length === 0) throw new Error('No template group paths are configured in package.json')
  const templateDirs: string[] = []
  const repositoryRoot = realpathSync(rootDir)

  for (const groupPath of groupPaths) {
    const absoluteGroupPath = resolve(repositoryRoot, groupPath)
    assertPathWithinRepository(repositoryRoot, absoluteGroupPath, groupPath)
    if (!existsSync(absoluteGroupPath)) throw new Error(`Configured template group does not exist: ${groupPath}`)
    const realGroupPath = realpathSync(absoluteGroupPath)
    assertPathWithinRepository(repositoryRoot, realGroupPath, groupPath)

    for (const entry of readdirSync(realGroupPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const templateDir = join(realGroupPath, entry.name)
      if (existsSync(join(templateDir, 'package.json'))) templateDirs.push(templateDir)
    }
  }

  if (templateDirs.length === 0) throw new Error('No template manifests were discovered in configured groups')
  return templateDirs.sort()
}

function assertPathWithinRepository(rootDir: string, path: string, configuredPath: string): void {
  const relativePath = relative(rootDir, path).replaceAll('\\', '/')
  if (relativePath === '' || (!isAbsolute(relativePath) && relativePath !== '..' && !relativePath.startsWith('../'))) {
    return
  }
  throw new Error(`Template group path escapes the repository: ${configuredPath}`)
}

function readPnpmPolicy(rootDir: string, findings: SecurityFinding[]): PnpmPolicy {
  const policyPath = join(rootDir, 'pnpm-workspace.yaml')
  const location = toRepoPath(rootDir, policyPath)
  const parsed = parse(readFileSync(policyPath, 'utf8')) as JsonRecord
  const onlyBuiltDependencies = Array.isArray(parsed.onlyBuiltDependencies)
    ? parsed.onlyBuiltDependencies.filter((value): value is string => typeof value === 'string')
    : []
  const dangerouslyAllowAllBuilds = parsed.dangerouslyAllowAllBuilds === true
  const minimumReleaseAge = parsed.minimumReleaseAge
  const minimumReleaseAgeExclude = Array.isArray(parsed.minimumReleaseAgeExclude)
    ? parsed.minimumReleaseAgeExclude.filter((value): value is string => typeof value === 'string')
    : []

  if (dangerouslyAllowAllBuilds) {
    findings.push({
      category: 'pnpm-policy',
      evidence: 'dangerouslyAllowAllBuilds: true',
      location,
      message: 'pnpm is configured to run every dependency build script.',
      recommendation: 'Use onlyBuiltDependencies to allow reviewed packages explicitly.',
      ruleId: 'pnpm-all-builds-allowed',
      severity: 'high',
      subject: 'workspace',
    })
  }

  if (typeof minimumReleaseAge !== 'number' || !Number.isFinite(minimumReleaseAge) || minimumReleaseAge <= 0) {
    findings.push({
      category: 'pnpm-policy',
      evidence: `minimumReleaseAge: ${String(minimumReleaseAge ?? 'not configured')}`,
      location,
      message: 'pnpm is not configured to delay newly published dependency versions.',
      recommendation: 'Set a positive minimumReleaseAge and keep its exclusion list narrowly reviewed.',
      ruleId: 'pnpm-minimum-release-age-disabled',
      severity: 'medium',
      subject: 'workspace',
    })
  } else if (minimumReleaseAge < 1440) {
    findings.push({
      category: 'pnpm-policy',
      evidence: `minimumReleaseAge: ${minimumReleaseAge}`,
      location,
      message: 'pnpm permits package versions published less than one day ago.',
      recommendation: 'Use a minimumReleaseAge of at least 1440 minutes unless a narrower policy is justified.',
      ruleId: 'pnpm-minimum-release-age-too-low',
      severity: 'medium',
      subject: 'workspace',
    })
  }

  if (minimumReleaseAgeExclude.some((value) => value === '*' || value === '**')) {
    findings.push({
      category: 'pnpm-policy',
      evidence: `minimumReleaseAgeExclude: ${minimumReleaseAgeExclude.join(', ')}`,
      location,
      message: 'pnpm excludes every package from its minimum release-age policy.',
      recommendation: 'Replace the global wildcard with a narrow list of reviewed package names or scopes.',
      ruleId: 'pnpm-minimum-release-age-globally-excluded',
      severity: 'high',
      subject: 'workspace',
    })
  }

  return { dangerouslyAllowAllBuilds, onlyBuiltDependencies: new Set(onlyBuiltDependencies) }
}

function scanManifest(manifest: TemplatePackage, template: string, findings: SecurityFinding[]): void {
  const location = `${template}/package.json`
  const subject = manifest.name ?? template

  for (const [scriptName, command] of Object.entries(manifest.scripts ?? {})) {
    if (INSTALL_LIFECYCLE_SCRIPTS.has(scriptName) || PUBLISH_LIFECYCLE_SCRIPTS.has(scriptName)) {
      const isInstallHook = INSTALL_LIFECYCLE_SCRIPTS.has(scriptName)
      findings.push({
        category: 'lifecycle-script',
        evidence: `${scriptName}: ${trimEvidence(command)}`,
        fingerprintEvidence: `${scriptName}: ${command}`,
        location,
        message: `Template declares the ${scriptName} lifecycle script, which can execute automatically.`,
        recommendation:
          'Remove automatic execution when possible; otherwise document and closely review the invoked code.',
        ruleId: 'manifest-lifecycle-script',
        severity: isInstallHook ? 'high' : 'medium',
        subject,
      })
    }

    for (const pattern of SCRIPT_PATTERNS) {
      if (!pattern.regex.test(command)) continue
      findings.push({
        category: 'lifecycle-script',
        evidence: `${scriptName}: ${trimEvidence(command)}`,
        fingerprintEvidence: `${scriptName}: ${command}`,
        location,
        message: pattern.message,
        recommendation: pattern.recommendation,
        ruleId: pattern.ruleId,
        severity: pattern.severity,
        subject,
      })
    }
  }

  for (const section of DEPENDENCY_SECTIONS) {
    for (const [dependencyName, specifier] of Object.entries(manifest[section] ?? {})) {
      const sourceRisk = classifyDependencySource(specifier)
      if (sourceRisk) {
        findings.push({
          category: 'dependency-source',
          evidence: `${section}.${dependencyName}: ${trimEvidence(specifier)}`,
          fingerprintEvidence: `${section}.${dependencyName}: ${specifier}`,
          location,
          message: sourceRisk.message,
          recommendation: sourceRisk.recommendation,
          ruleId: sourceRisk.ruleId,
          severity: sourceRisk.severity,
          subject,
        })
      } else if (isLooseVersion(specifier)) {
        findings.push({
          category: 'dependency-version',
          evidence: `${section}.${dependencyName}: ${trimEvidence(specifier)}`,
          fingerprintEvidence: `${section}.${dependencyName}: ${specifier}`,
          location,
          message: 'Dependency uses an unusually loose or mutable version range.',
          recommendation:
            'Use an exact, caret, or tilde semver range and let the lockfile record the resolved version.',
          ruleId: 'dependency-loose-version',
          severity: 'low',
          subject,
        })
      }
    }
  }
}

function classifyDependencySource(specifier: string): {
  readonly message: string
  readonly recommendation: string
  readonly ruleId: string
  readonly severity: FindingSeverity
} | null {
  if (
    /^(?:git(?:\+[^:]+)?|git@|github:|gitlab:|bitbucket:|https?:|ssh:)/i.test(specifier) ||
    /^[^:/@\s]+\/[^/\s]+(?:#.*)?$/.test(specifier)
  ) {
    return {
      message: 'Dependency is installed directly from a remote URL or source repository.',
      recommendation: 'Prefer a reviewed registry release with lockfile integrity metadata.',
      ruleId: 'dependency-remote-source',
      severity: 'high',
    }
  }
  if (/^(?:file:|link:)/i.test(specifier)) {
    return {
      message: 'Dependency resolves from a local filesystem path.',
      recommendation:
        'Confirm the dependency is included when the template is scaffolded, or publish it to the registry.',
      ruleId: 'dependency-local-source',
      severity: 'medium',
    }
  }
  if (/^workspace:/i.test(specifier)) {
    return {
      message: 'Template dependency resolves through the repository workspace.',
      recommendation: 'Confirm scaffolding rewrites or includes this dependency outside the monorepo.',
      ruleId: 'dependency-workspace-source',
      severity: 'medium',
    }
  }
  return null
}

function isLooseVersion(specifier: string): boolean {
  const value = specifier.trim()
  if (value === '' || value === '*' || /^(?:latest|next|beta|canary|dev)$/i.test(value)) return true
  return (
    /(?:^|\s)[<>]=?\s*\d|\|\|/.test(value) ||
    /^(?:v?\d+|v?\d+\.\d+)$/.test(value) ||
    /(?:^|\.)[xX*](?:\.|$)/.test(value)
  )
}

function scanReviewableSource(
  rootDir: string,
  templateDir: string,
  template: string,
  scriptEntrypoints: ReadonlySet<string>,
  findings: SecurityFinding[],
): void {
  for (const filePath of collectFiles(templateDir)) {
    const templateRelativePath = toRepoPath(templateDir, filePath)
    if (!isReviewableSource(templateRelativePath, scriptEntrypoints)) continue
    if (statSync(filePath).size > 256_000) continue

    const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)
    const lexicalState: LexicalState = { blockComment: false, quote: null }
    const usesHashComments = ['.ps1', '.sh'].includes(extname(filePath).toLowerCase())
    for (const [index, line] of lines.entries()) {
      const sources = usesHashComments
        ? { code: stripHashComment(line), uncommented: stripHashComment(line) }
        : splitSourceLine(line, lexicalState)
      const matchedRules = new Set<string>()
      for (const pattern of SOURCE_PATTERNS) {
        if (matchedRules.has(pattern.ruleId) || !pattern.regex.test(sources[pattern.source])) continue
        matchedRules.add(pattern.ruleId)
        findings.push({
          category: 'source-pattern',
          evidence: `${pattern.evidence}: ${trimEvidence(line.trim())}`,
          fingerprintEvidence: `${pattern.evidence}: ${line.trim()}`,
          location: `${toRepoPath(rootDir, filePath)}:${index + 1}`,
          message: pattern.message,
          recommendation: pattern.recommendation,
          ruleId: pattern.ruleId,
          severity: pattern.severity,
          subject: template,
        })
      }
    }
  }
}

function stripHashComment(line: string): string {
  let escaped = false
  let quote: '"' | "'" | null = null

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (quote) {
      if (escaped) escaped = false
      else if (character === '\\' || character === '`') escaped = true
      else if (character === quote) quote = null
      continue
    }
    if (character === '"' || character === "'") quote = character
    else if (character === '#') return line.slice(0, index)
  }

  return line
}

type LexicalState = {
  blockComment: boolean
  quote: '"' | "'" | '`' | null
}

function splitSourceLine(line: string, state: LexicalState): { readonly code: string; readonly uncommented: string } {
  let code = ''
  let uncommented = ''
  let escaped = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const nextCharacter = line[index + 1]

    if (state.blockComment) {
      code += ' '
      uncommented += ' '
      if (character === '*' && nextCharacter === '/') {
        code += ' '
        uncommented += ' '
        state.blockComment = false
        index += 1
      }
      continue
    }

    if (state.quote) {
      code += ' '
      uncommented += character
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === state.quote) state.quote = null
      continue
    }

    if (character === '/' && nextCharacter === '/') {
      code += ' '.repeat(line.length - index)
      uncommented += ' '.repeat(line.length - index)
      break
    }
    if (character === '/' && nextCharacter === '*') {
      code += '  '
      uncommented += '  '
      state.blockComment = true
      index += 1
      continue
    }
    if (character === '"' || character === "'" || character === '`') {
      state.quote = character
      code += ' '
      uncommented += character
      continue
    }

    code += character
    uncommented += character
  }

  return { code, uncommented }
}

function isReviewableSource(templateRelativePath: string, scriptEntrypoints: ReadonlySet<string>): boolean {
  const normalizedPath = templateRelativePath.toLowerCase()
  const fileName = basename(normalizedPath)
  const extension = extname(fileName)
  if (!REVIEWABLE_EXTENSIONS.has(extension)) return false
  if (scriptEntrypoints.has(normalizedPath)) return true
  if (normalizedPath.split('/').includes('scripts')) return true
  if (/\.(?:config|setup)\.(?:cjs|js|mjs|ts)$/.test(fileName)) return true
  return (
    /^(?:bootstrap|install|postinstall|preinstall|prepare)[.-]/.test(fileName) ||
    extension === '.sh' ||
    extension === '.ps1'
  )
}

function collectScriptEntrypoints(manifest: TemplatePackage): ReadonlySet<string> {
  const entrypoints = new Set<string>()
  const sourcePathPattern = /(?:^|[\s"'=])((?:\.\.?[\\/])?[\w@./\\-]+\.(?:cjs|js|mjs|ps1|sh|ts))(?=$|[\s"';&|])/g

  for (const command of Object.values(manifest.scripts ?? {})) {
    for (const match of command.matchAll(sourcePathPattern)) {
      const normalizedPath = match[1].replaceAll('\\', '/').replace(/^\.\//, '').toLowerCase()
      if (!normalizedPath.startsWith('../') && !normalizedPath.startsWith('/')) entrypoints.add(normalizedPath)
    }
  }
  return entrypoints
}

function collectFiles(directory: string): readonly string[] {
  const files: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectFiles(path))
    else if (entry.isFile()) files.push(path)
  }
  return files
}

function scanInstalledDependencyBuilds(rootDir: string, policy: PnpmPolicy, findings: SecurityFinding[]): number {
  const pnpmStoreDir = join(rootDir, 'node_modules', '.pnpm')
  if (!existsSync(pnpmStoreDir)) {
    findings.push({
      category: 'scan-coverage',
      evidence: 'node_modules/.pnpm is missing',
      location: 'node_modules/.pnpm',
      message: 'Installed transitive dependency manifests were not available for lifecycle-script inspection.',
      recommendation: 'Install the frozen workspace dependencies with scripts disabled before running the scan.',
      ruleId: 'installed-dependency-coverage-missing',
      severity: 'high',
      subject: 'workspace',
    })
    return 0
  }

  const manifests = collectInstalledPackageManifests(pnpmStoreDir)
  const seenPackages = new Set<string>()

  for (const manifestPath of manifests) {
    const manifest = readJson<TemplatePackage>(manifestPath)
    if (!manifest.name || !manifest.version) continue
    const packageId = `${manifest.name}@${manifest.version}`
    if (seenPackages.has(packageId)) continue
    seenPackages.add(packageId)

    const lifecycleScripts = Object.entries(manifest.scripts ?? {}).filter(([name]) =>
      INSTALL_LIFECYCLE_SCRIPTS.has(name),
    )
    if (lifecycleScripts.length === 0) continue

    const allowed = policy.dangerouslyAllowAllBuilds || policy.onlyBuiltDependencies.has(manifest.name)
    findings.push({
      category: 'dependency-build',
      evidence: lifecycleScripts.map(([name, command]) => `${name}: ${trimEvidence(command, 80)}`).join('; '),
      fingerprintEvidence: lifecycleScripts.map(([name, command]) => `${name}: ${command}`).join('; '),
      location: toRepoPath(rootDir, manifestPath),
      message: allowed
        ? 'Dependency has install-time scripts and is explicitly allowed to run by pnpm policy.'
        : 'Dependency has install-time scripts that are not present in pnpm onlyBuiltDependencies.',
      recommendation: allowed
        ? 'Keep this package on the allowlist only while its install scripts remain necessary and reviewed.'
        : 'Confirm pnpm blocks these scripts; allow the package only after reviewing the published lifecycle code.',
      ruleId: allowed ? 'dependency-build-script-allowed' : 'dependency-build-script-blocked',
      severity: allowed ? 'medium' : 'low',
      subject: packageId,
    })
  }

  return seenPackages.size
}

function collectInstalledPackageManifests(pnpmStoreDir: string): readonly string[] {
  const manifests: string[] = []
  for (const storeEntry of readdirSync(pnpmStoreDir, { withFileTypes: true })) {
    if (!storeEntry.isDirectory()) continue
    const packageRoot = join(pnpmStoreDir, storeEntry.name, 'node_modules')
    if (!existsSync(packageRoot)) continue

    for (const packageEntry of readdirSync(packageRoot, { withFileTypes: true })) {
      if (!packageEntry.isDirectory()) continue
      if (packageEntry.name.startsWith('@')) {
        const scopeRoot = join(packageRoot, packageEntry.name)
        for (const scopedEntry of readdirSync(scopeRoot, { withFileTypes: true })) {
          if (!scopedEntry.isDirectory()) continue
          const manifestPath = join(scopeRoot, scopedEntry.name, 'package.json')
          if (existsSync(manifestPath)) manifests.push(manifestPath)
        }
      } else {
        const manifestPath = join(packageRoot, packageEntry.name, 'package.json')
        if (existsSync(manifestPath)) manifests.push(manifestPath)
      }
    }
  }
  return manifests
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function toRepoPath(rootDir: string, path: string): string {
  return relative(rootDir, path).replaceAll('\\', '/')
}

function trimEvidence(value: string, maxLength = 160): string {
  const normalized = value
    .replaceAll(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3)}...` : normalized
}

function compareFindings(left: SecurityFinding, right: SecurityFinding): number {
  const severityOrder: Record<FindingSeverity, number> = { high: 0, medium: 1, low: 2 }
  return (
    severityOrder[left.severity] - severityOrder[right.severity] ||
    left.location.localeCompare(right.location) ||
    left.ruleId.localeCompare(right.ruleId) ||
    left.subject.localeCompare(right.subject)
  )
}
