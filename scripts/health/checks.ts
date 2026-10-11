/**
 * Per-template orchestration. Each template is copied into an isolated temp directory,
 * installed once, then probed across the dimensions: build, Rust, dependency freshness,
 * audit, doc drift, boot and render QA. Nothing here mutates the working tree or hits
 * mainnet. The dimensions themselves live in their own modules (process, isolation,
 * build, advisory, docdrift, boot, rust).
 */

import type { QaResult, ResolvedRunOptions, RunOptions, TemplateRef } from './types.js'
import { credentialsForTemplate, parentSecretValues, redactDeep, secretValues } from './env.js'
import { checkRender, explainByConfig, oneLine } from './qa.js'
import { hasBinary } from './process.js'
import { disposeTempDir, isolate } from './isolation.js'
import { buildFailureMentionsCredentials, runBuild, unsuppliedCredentialKeys } from './build.js'
import { checkAudit, checkOutdated, skipAudit, skipDeps } from './advisory.js'
import { checkDocDrift } from './docdrift.js'
import { checkBoot } from './boot.js'
import { checkRust } from './rust.js'

export type { RunOptions } from './types.js'

export const checkTemplate = async (ref: TemplateRef, opts: RunOptions) => {
  let workDir: string | null = null
  try {
    workDir = isolate(ref)

    // Effective PM: explicit --pm override > the template's pinned one > npm. Fall back to
    // npm if the chosen PM isn't installed, so a missing pnpm/yarn never reads as a template
    // failure. (This is what removes the npm-vs-pnpm false ERESOLVE failures.)
    let pm = opts.packageManager ?? ref.packageManager
    let pmNote: string | undefined
    if (pm !== 'npm' && !hasBinary(pm, ['--version'])) {
      pmNote = `${pm} not installed — fell back to npm`
      pm = 'npm'
    }
    const effOpts: ResolvedRunOptions = {
      ...opts,
      packageManager: pm,
      templateEnv: credentialsForTemplate(ref, opts.forwardedEnv),
    }

    let { build, deprecation } = await runBuild(workDir, ref, effOpts)
    const installed = build.phase !== 'install' || build.status === 'pass'

    // Rust check runs alongside the npm side (pinocchio has both a Rust program and TS clients).
    const rust = opts.build ? await checkRust(workDir, ref, effOpts) : undefined

    // A Rust-only template with no npm build/ci script shouldn't be flagged "warn" for that —
    // cargo is its build. Downgrade the "no script" warning to skip when Rust carried the build.
    if (ref.cargoManifestDir && build.phase === 'none' && build.status === 'warn') {
      build = { ...build, status: 'skip', tail: 'No npm build/ci script — Rust template, see cargo result.' }
    }

    // needs-setup: a template that declares env/credentials and can't build without that setup
    // step isn't "broken" — mark it skip so the fail list only holds genuinely broken templates.
    // The skip applies to the build dimension; templateStatus() keeps it from masking an
    // independent rust/boot failure while still not letting advisory checks bubble it to pass.
    // A key the maintainer explicitly supplied (--env-file/--allow-env) was NOT missing, so
    // only the unsupplied keys can explain the failure.
    let needsSetupSkip = false
    if (
      ref.needsSecrets &&
      build.status === 'fail' &&
      buildFailureMentionsCredentials(build.tail, unsuppliedCredentialKeys(ref.credentialKeys, effOpts.templateEnv))
    ) {
      // Only downgrade to skip when the failure output actually references one of the
      // credential var names: needing secrets does not prove the secrets caused THIS
      // failure, and an unrelated type/dep/lint error must stay a fail.
      needsSetupSkip = true
      build = {
        ...build,
        status: 'skip',
        tail: `SKIPPED — needs setup/credentials (${ref.secretsReason ?? 'env required'}). Build without setup:\n${build.tail}`,
      }
    } else if (ref.needsSecrets && build.status === 'fail') {
      build = {
        ...build,
        tail: `${build.tail}\n\nnote: template declares required credentials (${ref.secretsReason ?? 'env required'}) but the failure output does not reference them, treating as a real failure`,
      }
    }

    const deps = installed ? await checkOutdated(workDir, pm) : skipDeps('install failed')
    const audit = installed ? await checkAudit(workDir, pm) : skipAudit('install failed')
    const docDrift = checkDocDrift(ref)
    // Render QA runs inside the boot window (dev server up, boot lock held) and only when
    // boot passed: the hook is invoked after the server answered 2xx/3xx. checkRender never
    // throws, so a QA problem can't take the boot result down with it. The browser gets the
    // URL only: forwarded credentials reach the dev server process, never the QA step.
    const qaHook = opts.qa
      ? (url: string): Promise<QaResult> => checkRender(url, ref, { outDir: opts.outDir })
      : undefined
    const booted =
      opts.boot && installed && build.status === 'pass' ? await checkBoot(workDir, ref, effOpts, qaHook) : undefined
    const boot = booted?.boot
    let qa = booted?.ready
    // requires-configuration: a page that cannot run without a value the user did not supply
    // (phantom-embedded-react throws "appId is required" without NEXT_PUBLIC_PHANTOM_APP_ID)
    // is the QA twin of the build-phase needs-setup skip. Same causation rule: only a page /
    // console error or overlay that references a declared, unsupplied key can explain the
    // failure; any other QA failure stays a failure. Public-prefixed keys count here even
    // though they are not credentials: the page needs the value either way.
    // The downgrade only happens when configuration explains EVERY hard signal: an unrelated
    // page error next to the config error keeps the failure, with the config hint appended.
    const configVerdict =
      qa && qa.status === 'fail'
        ? explainByConfig(qa, unsuppliedCredentialKeys(ref.declaredEnvKeys, effOpts.templateEnv), ref.declaredEnvKeys)
        : null
    if (qa && configVerdict) {
      const { cause, unexplained } = configVerdict
      if (unexplained.length === 0) {
        needsSetupSkip = true
        qa = {
          ...qa,
          status: 'skip',
          note: `requires configuration: ${cause.key} (${cause.source}: ${oneLine(cause.message)})`,
        }
      } else {
        qa = {
          ...qa,
          note: `${qa.note ?? 'render failed'}; also: ${cause.key} appears unset (${cause.source}: ${oneLine(cause.message)}); not explained by it: ${unexplained.map(oneLine).join('; ')}`,
        }
      }
    }
    // Forwarded credential values must never reach a report: scrub every tail/note/command,
    // including qa notes and console samples (a dev server can echo a key into the console).
    return redactDeep(
      { build, deprecation, deps, audit, docDrift, boot, qa, rust, packageManager: pm, pmNote, needsSetupSkip },
      [...secretValues(opts.forwardedEnv), ...parentSecretValues()],
    )
  } finally {
    if (workDir) disposeTempDir(workDir)
  }
}
