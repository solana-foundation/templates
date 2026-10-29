/**
 * Discover every template from the repo's repokit.groups and classify each one
 * so the runner knows which checks apply (a Next.js app and a Rust program need
 * very different "is it healthy" commands).
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { dirname, join } from 'path'
import type { TemplateKind, TemplateRef, UnrecognizedEntry } from './types.js'

type AnyPkg = {
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  packageManager?: string
  'create-solana-dapp'?: { instructions?: string[] }
}

/** "pnpm@10.20.0" -> "pnpm"; missing -> "npm". */
const resolvePackageManager = (pkg: AnyPkg | null): string => {
  const field = pkg?.packageManager
  if (typeof field === 'string') {
    const name = field.split('@')[0].trim()
    if (name === 'pnpm' || name === 'yarn' || name === 'npm') return name
  }
  return 'npm'
}

/**
 * Read a template's package.json. A manifest that exists but does not parse is reported as
 * such (`parseError`), never silently treated as "no package.json": the two mean different
 * things for the report (unrecognised template vs Rust-only template).
 */
const readPkg = (dir: string): { pkg: AnyPkg | null; parseError?: string } => {
  const pkgPath = join(dir, 'package.json')
  if (!existsSync(pkgPath)) return { pkg: null }
  try {
    return { pkg: JSON.parse(readFileSync(pkgPath, 'utf-8')) as AnyPkg }
  } catch (error) {
    return { pkg: null, parseError: error instanceof Error ? error.message : String(error) }
  }
}

const allDeps = (pkg: AnyPkg): Record<string, string> => ({
  ...(pkg.dependencies ?? {}),
  ...(pkg.devDependencies ?? {}),
})

/**
 * The only scripts the build check runs. A framework-less package with just `dev` or `start`
 * can't be verified (no build to run, nothing to boot), so it doesn't make a template.
 */
const hasBuildScript = (scripts: Record<string, string>): boolean =>
  ['ci', 'build'].some((name) => typeof scripts[name] === 'string' && scripts[name].trim() !== '')

/**
 * Web/mobile capability is decided from package.json deps and scripts first, independently
 * of any Cargo manifest: a template that ships a Rust backend AND a Next.js app (its dev
 * script starts both) is `next` so it gets the boot check, while cargoManifestDir (detected
 * separately) still gives it the Rust check. Only a template with no web signal is `rust`.
 */
export const classify = (dir: string, pkg: AnyPkg | null): TemplateKind => {
  const hasCargo = existsSync(join(dir, 'Cargo.toml')) || existsSync(join(dir, 'program', 'Cargo.toml'))
  if (!pkg) return hasCargo ? 'rust' : 'unknown'
  const deps = allDeps(pkg)
  const scripts = Object.values(pkg.scripts ?? {}).join(' ')
  if ('expo' in deps || scripts.includes('expo')) return 'expo'
  if ('next' in deps || scripts.includes('next ')) return 'next'
  if ('vite' in deps || /\bvite\b/.test(scripts)) return 'vite'
  if (hasCargo) return 'rust'
  // Plain node: only when the build check has something to run (start alone can't be verified).
  if (hasBuildScript(pkg.scripts ?? {})) return 'node'
  return 'unknown'
}

/**
 * Locate the buildable Cargo manifest and decide whether it's an on-chain program.
 * Covers the common layouts: a root Cargo.toml, a pinocchio-style `program/`, and an
 * Anchor-style `anchor/` workspace. A scaffolder like x402-solana-rust (only a
 * Cargo.toml.template) has no manifest at rest and correctly gets no cargo check.
 */
const detectCargo = (dir: string): { cargoManifestDir: string | null; isProgram: boolean } => {
  const manifest = [
    join(dir, 'Cargo.toml'),
    join(dir, 'program', 'Cargo.toml'),
    join(dir, 'anchor', 'Cargo.toml'),
  ].find((file) => existsSync(file))
  if (!manifest) return { cargoManifestDir: null, isProgram: false }
  const cargoManifestDir = dirname(manifest)

  // Scan the chosen manifest plus any member program crates for on-chain markers.
  const blob = [manifest, ...memberManifests(cargoManifestDir)]
    .filter((file) => existsSync(file))
    .map((file) => readFileSync(file, 'utf-8').toLowerCase())
    .join('\n')
  // A manifest under anchor/ or program/, or any program marker, means an SBF program.
  const isProgram =
    /[/\\](anchor|program)$/.test(cargoManifestDir) ||
    /\bcdylib\b|\bpinocchio\b|\banchor-lang\b|\bsolana-program\b|build-sbf/.test(blob) ||
    /members\s*=\s*\[[^\]]*["'](program|programs)/.test(blob)
  return { cargoManifestDir, isProgram }
}

/** Cargo.toml of immediate `program/` and `programs/<name>/` members under a workspace dir. */
const memberManifests = (workspaceDir: string): string[] => {
  const out: string[] = [join(workspaceDir, 'program', 'Cargo.toml')]
  const programsDir = join(workspaceDir, 'programs')
  if (existsSync(programsDir)) {
    try {
      for (const name of readdirSync(programsDir)) out.push(join(programsDir, name, 'Cargo.toml'))
    } catch {
      /* not readable */
    }
  }
  return out
}

/**
 * Hints that a template's SETUP INSTRUCTIONS point at real credentials/services.
 * Only matched against create-solana-dapp instruction prose, never against
 * .env.example content — env files are matched by variable NAME below, so a word
 * like "secret" in an env comment can't turn a real build failure into a "skip".
 */
const SECRET_HINTS = [
  'supabase',
  'privy',
  'credential',
  'api key',
  'api_key',
  'apikey',
  'secret',
  'private key',
  'private_key',
]

/** Env variable names that mean "you need a real credential to run this". */
const CREDENTIAL_KEY_PATTERN = /(API_?KEY|SECRET|PASSWORD|CREDENTIAL|PRIVATE_?KEY|SUPABASE|PRIVY)/i
/** Names that look credential-ish but are public config (mint addresses, RPC endpoints,
 *  provider app/client IDs like EXPO_PUBLIC_PRIVY_APP_ID, ...). Real secrets keep matching
 *  because they carry KEY/SECRET/etc. in the name, e.g. NEXT_PUBLIC_SUPABASE_ANON_KEY. */
const NON_CREDENTIAL_KEY_PATTERN = /(MINT|PROGRAM|ADDRESS|RPC|URL|PUBKEY|PUBLIC_KEY|APP_ID|CLIENT_ID|PROJECT_ID)/i

/** Every variable name declared in an env template file (names only; comments and values never count). */
export const envKeysDeclared = (envBody: string): string[] =>
  envBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map(
      (line) =>
        line
          .replace(/^export\s+/, '')
          .split('=')[0]
          ?.trim() ?? '',
    )
    .filter((key) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(key))

/**
 * Extract the variable names in an .env.example that require real credentials.
 * Parses line by line and matches names only, so comments and values never count.
 */
export const envKeysRequiringCredentials = (envBody: string): string[] =>
  envKeysDeclared(envBody).filter((key) => CREDENTIAL_KEY_PATTERN.test(key) && !NON_CREDENTIAL_KEY_PATTERN.test(key))

/** The env template files a template may ship; the only `.env*` files the health check reads. */
const ENV_TEMPLATE_FILES = ['.env.example', '.env.sample', '.env.template']

/** All env var names a template declares across its env template files (deduplicated, in order). */
const declaredEnvKeys = (dir: string): string[] => {
  const keys: string[] = []
  for (const name of ENV_TEMPLATE_FILES) {
    const file = join(dir, name)
    if (!existsSync(file)) continue
    for (const key of envKeysDeclared(readFileSync(file, 'utf-8'))) if (!keys.includes(key)) keys.push(key)
  }
  return keys
}

const detectSecrets = (dir: string, pkg: AnyPkg | null): { needs: boolean; reason?: string; keys: string[] } => {
  // An .env.example with credential-looking variable names is the strongest signal.
  const envExample = join(dir, '.env.example')
  if (existsSync(envExample)) {
    const credentialKeys = envKeysRequiringCredentials(readFileSync(envExample, 'utf-8'))
    if (credentialKeys.length > 0) {
      return {
        needs: true,
        reason: `.env.example requires credentials (${credentialKeys.slice(0, 3).join(', ')})`,
        keys: credentialKeys,
      }
    }
  }
  const rawInstructions = pkg?.['create-solana-dapp']?.instructions
  const instructions = (
    Array.isArray(rawInstructions)
      ? rawInstructions.join(' ')
      : typeof rawInstructions === 'string'
        ? rawInstructions
        : ''
  ).toLowerCase()
  const hit = SECRET_HINTS.find((hint) => instructions.includes(hint))
  if (hit) return { needs: true, reason: `setup instructions mention "${hit}"`, keys: [] }
  return { needs: false, keys: [] }
}

const readGroups = (root: string): { path: string }[] => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8')) as {
    repokit?: { groups?: { path: string }[] }
  }
  return pkg.repokit?.groups ?? []
}

/** Directory names under a group that are never templates. */
const isIgnoredDirName = (name: string): boolean => name.startsWith('.') || name === 'node_modules'

/** Every immediate, non-hidden subdirectory of a group dir (template candidates, recognised or not). */
const candidateDirsIn = (groupDir: string): string[] =>
  readdirSync(groupDir)
    .filter((name) => !isIgnoredDirName(name))
    .sort()
    .map((name) => join(groupDir, name))
    .filter((candidate) => {
      try {
        return statSync(candidate).isDirectory()
      } catch {
        return false
      }
    })

const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error))

export type Enumeration = {
  /** templates the health check understands, sorted by id */
  readonly templates: TemplateRef[]
  /** directories (or configured groups) it could not classify, sorted by id; never counted as pass or fail */
  readonly unrecognized: UnrecognizedEntry[]
}

/**
 * Classify one candidate directory: a template ref when the health check understands it, or
 * the reason it does not. Never throws: an unreadable or malformed directory becomes an
 * unrecognised entry so one bad template cannot take the whole run down.
 */
const inspectCandidate = (dir: string, groupPath: string, groupDir: string): TemplateRef | UnrecognizedEntry => {
  const name = dir.slice(groupDir.length + 1)
  const id = `${groupPath}/${name}`
  try {
    const hasPkg = existsSync(join(dir, 'package.json'))
    const hasCargo = existsSync(join(dir, 'Cargo.toml'))
    if (!hasPkg && !hasCargo) return { id, path: dir, reason: 'no package.json or Cargo.toml' }
    const { pkg, parseError } = readPkg(dir)
    if (parseError !== undefined) return { id, path: dir, reason: `package.json is not valid JSON: ${parseError}` }
    const { needs, reason, keys } = detectSecrets(dir, pkg)
    const cargo = detectCargo(dir)
    const kind = classify(dir, pkg)
    const scripts = pkg?.scripts ?? {}
    // Nothing we know how to run: no framework, no cargo manifest, no ci/build script. A
    // template like that would otherwise read as "warn: no ci/build script", which sounds
    // like "works but needs attention" when the truth is "we cannot verify this at all".
    if (kind === 'unknown' && !cargo.cargoManifestDir && !hasBuildScript(scripts))
      return { id, path: dir, reason: 'no recognised framework and no ci/build script' }
    return {
      id,
      group: groupPath,
      dir,
      kind,
      scripts,
      directDeps: pkg ? Object.keys(allDeps(pkg)) : [],
      cargoManifestDir: cargo.cargoManifestDir,
      isProgram: cargo.isProgram,
      packageManager: resolvePackageManager(pkg),
      needsSecrets: needs,
      secretsReason: reason,
      credentialKeys: keys,
      declaredEnvKeys: declaredEnvKeys(dir),
    }
  } catch (error) {
    return { id, path: dir, reason: `could not inspect directory: ${errorMessage(error)}` }
  }
}

const isTemplateRef = (entry: TemplateRef | UnrecognizedEntry): entry is TemplateRef => 'group' in entry

/**
 * Discover every template under repokit.groups, plus everything under those groups that the
 * health check does NOT understand. Unrecognised entries get their own report section instead
 * of vanishing (the old behaviour: a directory without package.json/Cargo.toml was simply not
 * listed) or masquerading as a warn.
 */
export const enumerateRepo = (root: string): Enumeration => {
  const groups = readGroups(root)
  const groupPaths = new Set(groups.map((group) => group.path))
  const templates: TemplateRef[] = []
  const unrecognized: UnrecognizedEntry[] = []

  for (const group of groups) {
    const groupDir = join(root, group.path)
    if (!existsSync(groupDir)) {
      unrecognized.push({ id: group.path, path: groupDir, reason: 'group directory missing' })
      continue
    }
    let candidates: string[]
    try {
      candidates = candidateDirsIn(groupDir)
    } catch (error) {
      unrecognized.push({
        id: group.path,
        path: groupDir,
        reason: `group directory not readable: ${errorMessage(error)}`,
      })
      continue
    }
    for (const dir of candidates) {
      // A nested group (web3js/legacy inside web3js) is enumerated as its own group, not as a template.
      if (groupPaths.has(`${group.path}/${dir.slice(groupDir.length + 1)}`)) continue
      const entry = inspectCandidate(dir, group.path, groupDir)
      if (isTemplateRef(entry)) templates.push(entry)
      else unrecognized.push(entry)
    }
  }

  const byId = <T extends { id: string }>(left: T, right: T) => left.id.localeCompare(right.id)
  return { templates: templates.sort(byId), unrecognized: unrecognized.sort(byId) }
}

/** The recognised templates only; see enumerateRepo for the full picture. */
export const enumerateTemplates = (root: string): TemplateRef[] => enumerateRepo(root).templates
