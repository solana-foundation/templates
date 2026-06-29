/**
 * Discover every template from the repo's repokit.groups and classify each one
 * so the runner knows which checks apply (a Next.js app and a Rust program need
 * very different "is it healthy" commands).
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
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
 * A scaffolder like x402-solana-rust (only a Cargo.toml.template) has no manifest at
 * rest and correctly gets no cargo check.
 */
const detectCargo = (dir: string): { cargoManifestDir: string | null; isProgram: boolean } => {
  const rootManifest = join(dir, 'Cargo.toml')
  const programManifest = join(dir, 'program', 'Cargo.toml')
  const cargoManifestDir = existsSync(rootManifest) ? dir : existsSync(programManifest) ? join(dir, 'program') : null
  if (!cargoManifestDir) return { cargoManifestDir: null, isProgram: false }

  const blob = [rootManifest, programManifest]
    .filter((f) => existsSync(f))
    .map((f) => readFileSync(f, 'utf-8').toLowerCase())
    .join('\n')
  // cdylib / pinocchio / anchor / solana-program / a `program` workspace member all mean SBF.
  const isProgram =
    /\bcdylib\b|\bpinocchio\b|\banchor-lang\b|\bsolana-program\b|build-sbf/.test(blob) ||
    /members\s*=\s*\[[^\]]*["']program/.test(blob)
  return { cargoManifestDir, isProgram }
}

/** Templates that obviously can't run end-to-end without a key/service. */
const SECRET_HINTS = ['supabase', 'privy', 'credential', 'api key', 'api_key', 'apikey', 'secret', 'token', 'rpc url']

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
