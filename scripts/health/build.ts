/**
 * Dimension 1 + 4: install, build (the template's `ci` or `build` script) and the registry
 * deprecation warnings that surface during install. Also the pure causation rules that
 * turn a build failure into a "needs setup" skip.
 */

import type { BuildResult, DeprecationResult, ResolvedRunOptions, TemplateRef } from './types.js'
import { hasBinary, run, tail, type Exec } from './process.js'
import { scriptsInCommands } from './docdrift.js'

/**
 * True when a build failure's output references one of the template's required
 * credential env var names — the only evidence that missing credentials caused
 * the failure. Prose-detected templates have no key names, so they never match:
 * causation cannot be established and their failures stay failures.
 */
/** The keys (credential or declared config) a template still lacks: those not explicitly supplied for this run. */
export const unsuppliedCredentialKeys = (
  credentialKeys: readonly string[],
  templateEnv: Readonly<Record<string, string>>,
): string[] => credentialKeys.filter((key) => !(key in templateEnv))

export const buildFailureMentionsCredentials = (tail: string, credentialKeys: readonly string[]): boolean => {
  if (credentialKeys.length === 0) return false
  const haystack = tail.toLowerCase()
  return credentialKeys.some((key) => haystack.includes(key.toLowerCase()))
}

// ---------- deprecation extraction (pure, unit-tested) ----------

const pkgNameOf = (spec: string): string => {
  const at = spec.lastIndexOf('@')
  return at > 0 ? spec.slice(0, at) : spec
}

/**
 * Pull `name@version` specs out of install output's "deprecated" warnings, keeping only
 * those that are DIRECT deps — transitive ones (inflight, glob, ...) aren't the template
 * author's to fix and would drown the signal. Works for both npm and pnpm output.
 */
export const extractDeprecations = (installOutput: string, directDeps: readonly string[]): string[] => {
  const direct = new Set(directDeps)
  return Array.from(installOutput.matchAll(/deprecated\s+(\S+@[^\s:]+)/gi))
    .map((match) => match[1])
    .filter((spec) => direct.has(pkgNameOf(spec)))
    .filter((spec, index, all) => all.indexOf(spec) === index)
    .slice(0, 25)
}

// ---------- dimension 1 + 4: install / build / deprecation ----------

export const runBuild = async (
  workDir: string,
  ref: TemplateRef,
  opts: ResolvedRunOptions,
): Promise<{ build: BuildResult; deprecation: DeprecationResult }> => {
  const pm = opts.packageManager
  const install = await run(pm, ['install'], workDir, opts.installTimeoutMs, opts.templateEnv)

  // Registry deprecation warnings surface during install ("npm warn deprecated X@1: ...").
  const deprecated = extractDeprecations(install.output, ref.directDeps)
  const deprecation: DeprecationResult = {
    status: deprecated.length === 0 ? 'pass' : 'warn',
    packages: deprecated,
  }

  if (install.code !== 0) {
    return {
      build: buildResult('install', `${pm} install`, install),
      deprecation,
    }
  }

  if (!opts.build) {
    return { build: { ...buildResult('install', `${pm} install`, install), status: 'pass' }, deprecation }
  }

  // Prefer the template's own `ci` script (the canonical health command); fall back to build.
  const hasCi = Boolean(ref.scripts.ci)
  const hasBuild = Boolean(ref.scripts.build)
  const entry = hasCi ? 'ci' : hasBuild ? 'build' : null
  // A ci/build chain that shells out to cargo cannot run without cargo; that's an
  // unverifiable template on this machine, not a broken one (the Rust check says the same).
  if (entry && scriptChainReferencesCargo(ref.scripts, entry) && !hasBinary('cargo', ['--version'])) {
    return {
      build: {
        status: 'skip',
        phase: entry,
        command: `${pm} run ${entry}`,
        exitCode: null,
        timedOut: false,
        durationMs: install.durationMs,
        tail: `${entry} script requires cargo, which is not installed`,
      },
      deprecation,
    }
  }
  if (!hasCi && !hasBuild) {
    return {
      build: {
        status: 'warn',
        phase: 'none',
        command: '(no ci or build script)',
        exitCode: 0,
        timedOut: false,
        durationMs: 0,
        tail: 'Template has no `ci` or `build` script to verify.',
      },
      deprecation,
    }
  }
  const script = hasCi ? 'ci' : 'build'
  const built = await run(pm, ['run', script], workDir, opts.buildTimeoutMs, opts.templateEnv)
  return { build: buildResult(hasCi ? 'ci' : 'build', `${pm} run ${script}`, built), deprecation }
}

/**
 * Pure: true when the named script, or any script it chains into (`npm run x`, `pnpm x`,
 * `yarn x`, `{pm} run x`), invokes cargo.
 */
export const scriptChainReferencesCargo = (scripts: Readonly<Record<string, string>>, entry: string): boolean => {
  const seen = new Set<string>()
  const queue = [entry]
  while (queue.length) {
    const name = queue.shift()!
    if (seen.has(name)) continue
    seen.add(name)
    const body = scripts[name]
    if (!body) continue
    if (/\bcargo\b/.test(body)) return true
    for (const next of scriptsInCommands(body)) if (next in scripts) queue.push(next)
  }
  return false
}

const buildResult = (phase: BuildResult['phase'], command: string, exec: Exec): BuildResult => ({
  status: exec.timedOut ? 'fail' : exec.code === 0 ? 'pass' : 'fail',
  phase,
  command,
  exitCode: exec.code,
  timedOut: exec.timedOut,
  durationMs: exec.durationMs,
  tail: exec.timedOut
    ? `TIMED OUT after ${Math.round(exec.durationMs / 1000)}s\n${tail(exec.output)}`
    : tail(exec.output),
})
