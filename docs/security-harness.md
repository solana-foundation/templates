# Template security harness

The template security harness provides an advisory supply-chain review for every template contribution and a repeatable scan of the existing catalog.

Run it from the repository root:

```shell
pnpm security:test
pnpm security:check
```

The scan writes `security-reports/report.json` for automation and `security-reports/report.md` for reviewers. CI also adds the Markdown report to the job summary and uploads both files as an artifact.

The checked-in `.github/template-security-baseline.json` records findings that have already received human review. The report separates new findings from acknowledged findings instead of repeating every known item as new on each pull request.

## What it reviews

- install and publish lifecycle scripts in template `package.json` files
- direct dependencies sourced from Git, HTTP, local paths, or the workspace
- unusually loose or mutable direct dependency versions
- explicit shell, downloader, and inline-code commands in package scripts
- dynamic evaluation, encoded payloads, child processes, and network calls in setup, config, and script files
- install-time scripts shipped by installed dependencies, including whether pnpm allows them to run
- templates missing from the workspace lockfile, where transitive dependency coverage is incomplete
- the workspace pnpm build-script allowlist
- pnpm's minimum package release-age policy

## Triage model

Findings are review prompts, not automatic vulnerabilities. The scanner exits successfully when it finds review items so legitimate packages such as native build tools do not block contributors. Reviewers should inspect new evidence and either remove the behavior, document why it is needed, or keep an intentionally reviewed dependency in `onlyBuiltDependencies`.

Each baseline acknowledgement contains an exact fingerprint of the rule, severity, subject, location, category, and evidence that was reviewed, plus a rationale. Scanner message and recommendation wording are not part of the fingerprint. If the underlying command, dependency script, source pattern, severity, or location changes, the finding is reported as new and the previous acknowledgement becomes stale. This makes behavior changes visible without hiding the reviewed catalog state.

Baseline changes require the same human review as source changes. Add an acknowledgement only after inspecting the referenced code or dependency script, and remove stale acknowledgements once the old behavior no longer exists. Acknowledged and stale items remain in both report formats for auditability.

Pull request scans use the baseline from the exact target-branch commit, not the version proposed by the pull request. A contributor therefore cannot make new behavior appear previously acknowledged by adding its fingerprint in the same change. After an approved baseline update lands, push and scheduled scans use the updated baseline normally.

When the target branch has no baseline yet, as during the initial rollout, the workflow uses an empty baseline and reports every discovered item as new for one-time review.

The workflow intentionally runs on every pull request. Template roots are discovered from `repokit.groups`, so a static path filter could silently miss a root added after the workflow was written.

To compare against a different baseline without editing the repository default:

```shell
pnpm security:check -- --baseline path/to/baseline.json
```

The workflow installs with `--ignore-scripts` and `--ignore-pnpmfile`, so dependency lifecycle code and repository-controlled pnpm hooks are not executed before inspection. An execution error, malformed configuration, or missing report is still a workflow failure because the repository was not actually scanned.

## Deliberate limits

The harness is deterministic and does not query package registries. It verifies that pnpm's existing minimum release-age policy remains enabled, but it does not score individual package publication dates or package-name similarity. Those checks can be added later as a separately cached advisory data source without making the required review path depend on mutable external data.
