/**
 * Discover every template from the repo's repokit.groups and classify each one
 * so the runner knows which checks apply (a Next.js app and a Rust program need
 * very different "is it healthy" commands).
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { dirname, join } from 'path'
import type { TemplateKind, TemplateRef } from './types.js'

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

const readPkg = (dir: string): AnyPkg | null => {
  const p = join(dir, 'package.json')
  if (!existsSync(p)) return null
  try {
    return JSON.parse(readFileSync(p, 'utf-8')) as AnyPkg
  } catch {
    return null
  }
}

const allDeps = (pkg: AnyPkg): Record<string, string> => ({
  ...(pkg.dependencies ?? {}),
  ...(pkg.devDependencies ?? {}),
})

const classify = (dir: string, pkg: AnyPkg | null): TemplateKind => {
  if (existsSync(join(dir, 'Cargo.toml')) || existsSync(join(dir, 'program', 'Cargo.toml'))) {
    return 'rust'
  }
  if (!pkg) return 'unknown'
  const deps = allDeps(pkg)
  const scripts = Object.values(pkg.scripts ?? {}).join(' ')
  if ('expo' in deps || scripts.includes('expo')) return 'expo'
  if ('next' in deps || scripts.includes('next ')) return 'next'
  if ('vite' in deps || scripts.includes('vite')) return 'vite'
  if (pkg.scripts?.build || pkg.scripts?.start) return 'node'
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
  ].find((f) => existsSync(f))
  if (!manifest) return { cargoManifestDir: null, isProgram: false }
  const cargoManifestDir = dirname(manifest)

  // Scan the chosen manifest plus any member program crates for on-chain markers.
  const blob = [manifest, ...memberManifests(cargoManifestDir)]
    .filter((f) => existsSync(f))
    .map((f) => readFileSync(f, 'utf-8').toLowerCase())
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
 * Hints that a template needs real credentials/services to run. Kept reasonably specific:
 * we avoid generic words like "token" that legitimately appear in non-credential .env keys
 * (e.g. a token mint address), because a false positive here would wrongly turn a real
 * build failure into a "skip".
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

const detectSecrets = (dir: string, pkg: AnyPkg | null): { needs: boolean; reason?: string } => {
  // An .env.example with real-looking keys is the strongest signal.
  const envExample = join(dir, '.env.example')
  if (existsSync(envExample)) {
    const body = readFileSync(envExample, 'utf-8').toLowerCase()
    if (SECRET_HINTS.some((h) => body.includes(h.replace(' ', '_')) || body.includes(h))) {
      return { needs: true, reason: '.env.example requires real credentials' }
    }
  }
  const rawInstr = pkg?.['create-solana-dapp']?.instructions
  const instructions = (
    Array.isArray(rawInstr) ? rawInstr.join(' ') : typeof rawInstr === 'string' ? rawInstr : ''
  ).toLowerCase()
  const hit = SECRET_HINTS.find((h) => instructions.includes(h))
  if (hit) return { needs: true, reason: `setup instructions mention "${hit}"` }
  return { needs: false }
}

const readGroups = (root: string): { path: string }[] => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8')) as {
    repokit?: { groups?: { path: string }[] }
  }
  return pkg.repokit?.groups ?? []
}

/** List immediate subdirectories that contain a package.json or a Cargo.toml. */
const templateDirsIn = (groupDir: string): string[] => {
  if (!existsSync(groupDir)) return []
  return readdirSync(groupDir)
    .map((name) => join(groupDir, name))
    .filter((p) => {
      try {
        return statSync(p).isDirectory() && (existsSync(join(p, 'package.json')) || existsSync(join(p, 'Cargo.toml')))
      } catch {
        return false
      }
    })
}

export const enumerateTemplates = (root: string): TemplateRef[] => {
  const groups = readGroups(root)
  const refs: TemplateRef[] = []

  for (const group of groups) {
    const groupDir = join(root, group.path)
    for (const dir of templateDirsIn(groupDir)) {
      const pkg = readPkg(dir)
      const name = dir.slice(groupDir.length + 1)
      const { needs, reason } = detectSecrets(dir, pkg)
      const cargo = detectCargo(dir)
      refs.push({
        id: `${group.path}/${name}`,
        group: group.path,
        dir,
        kind: classify(dir, pkg),
        scripts: pkg?.scripts ?? {},
        directDeps: pkg ? Object.keys(allDeps(pkg)) : [],
        cargoManifestDir: cargo.cargoManifestDir,
        isProgram: cargo.isProgram,
        packageManager: resolvePackageManager(pkg),
        needsSecrets: needs,
        secretsReason: reason,
      })
    }
  }

  return refs.sort((a, b) => a.id.localeCompare(b.id))
}
