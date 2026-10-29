/**
 * Dimension 5: doc / reality drift. The scripts a README or the create-solana-dapp
 * instructions tell people to run must exist in package.json (or a nested one).
 */

import { existsSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { DocDriftResult, TemplateRef } from './types.js'
import { EXCLUDED_DIRS } from './isolation.js'

/** Package-manager built-ins that can follow `pnpm`/`yarn` but are never user scripts. */
const PM_BUILTINS = new Set([
  'install',
  'i',
  'add',
  'remove',
  'rm',
  'update',
  'up',
  'create',
  'dlx',
  'exec',
  'init',
  'link',
  'why',
  'list',
  'ls',
  'outdated',
  'audit',
  'login',
  'publish',
  'pack',
  'run',
])

/**
 * Pure: the command contexts of a Markdown document — fenced code blocks and inline code
 * spans. Prose like "pnpm is the package manager" is not a command and never counts.
 */
export const commandContexts = (markdown: string): string[] => {
  const contexts: string[] = []
  const withoutFences = markdown.replace(/```[^\n]*\n([\s\S]*?)```/g, (_match, body: string) => {
    contexts.push(body)
    return '\n'
  })
  for (const match of withoutFences.matchAll(/`([^`\n]+)`/g)) contexts.push(match[1])
  return contexts
}

/**
 * Pure: script names invoked in command text — `pnpm run <x>`, `pnpm <x>`, `npm run <x>`,
 * `yarn <x>`, `bun run <x>` and the `{pm} <x>` placeholder create-solana-dapp uses. Package
 * manager built-ins (`pnpm install`, `pnpm add`, ...) are not scripts and are ignored;
 * `npm <x>` without `run` only reaches a script through npm's own `start`/`test` aliases;
 * a bare `pnpm <x>` naming a direct dependency runs that package's binary, not a script.
 * Command lines that `cd` somewhere first target another package.json and are not checked.
 */
export const scriptsInCommands = (commands: string, directDeps: readonly string[] = []): string[] => {
  const referenced = new Set<string>()
  const binaries = new Set(directDeps.map((dep) => dep.replace(/^@[^/]+\//, '')))
  // Leading `+` is create-solana-dapp's "this line is a command" marker in instructions.
  const pattern = /(?:^|[\s;&|(+])(npm|pnpm|yarn|bun|\{pm\})(?:[ \t]+(run))?[ \t]+([a-z][a-z0-9:_-]*)(?=$|[\s;&|)])/gi
  for (const line of commands.split('\n')) {
    if (/^[\s+$>]*cd\s/.test(line)) continue
    for (const match of line.matchAll(pattern)) {
      const [, manager, runVerb, script] = match
      const name = script.toLowerCase()
      if (PM_BUILTINS.has(name)) continue
      if (manager.toLowerCase() === 'npm' && !runVerb && name !== 'start' && name !== 'test') continue
      if (!runVerb && binaries.has(name)) continue
      referenced.add(name)
    }
  }
  return [...referenced]
}

/** Script names from the package.json of each immediate subdirectory (never node_modules). */
const nestedScripts = (dir: string): string[] => {
  const names: string[] = []
  let entries: string[] = []
  try {
    entries = readdirSync(dir)
  } catch {
    return names
  }
  for (const entry of entries) {
    if (EXCLUDED_DIRS.includes(entry)) continue
    const pkgPath = join(dir, entry, 'package.json')
    if (!existsSync(pkgPath)) continue
    try {
      const scripts = JSON.parse(readFileSync(pkgPath, 'utf-8')).scripts
      if (scripts && typeof scripts === 'object') names.push(...Object.keys(scripts))
    } catch {
      /* unreadable nested manifest: nothing to add */
    }
  }
  return names
}

export const checkDocDrift = (ref: TemplateRef): DocDriftResult => {
  const commands: string[] = []
  const readme = join(ref.dir, 'README.md')
  if (existsSync(readme)) commands.push(...commandContexts(readFileSync(readme, 'utf-8')))
  const pkgPath = join(ref.dir, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      // Instruction strings are command lines already (`+{pm} dev`), not prose to filter.
      const instr = JSON.parse(readFileSync(pkgPath, 'utf-8'))['create-solana-dapp']?.instructions
      if (Array.isArray(instr)) commands.push(...instr.filter((line): line is string => typeof line === 'string'))
      else if (typeof instr === 'string') commands.push(instr)
    } catch {
      /* ignore */
    }
  }
  const referenced = scriptsInCommands(commands.join('\n'), ref.directDeps)
  // Multi-package templates (a Rust backend with a `frontend/` app, ...) document scripts that
  // live in a nested package.json, so those count as existing too.
  const scripts = new Set([...Object.keys(ref.scripts), ...nestedScripts(ref.dir)])
  const missing = [...referenced].filter((script) => !scripts.has(script)).sort()
  return {
    status: missing.length === 0 ? 'pass' : 'warn',
    missingScripts: missing,
    note: missing.length ? 'README/instructions reference scripts not in package.json' : undefined,
  }
}
