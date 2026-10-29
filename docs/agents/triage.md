# Templates Triage

The health check (`pnpm health`) tells you which templates are broken. Triage tells you why, in a form a human can act on, and proposes the few fixes that are safe to automate. It implements stage 1 of issue #454 (structured findings from the health report) and the skeleton of stage 2 (classifying issues people open).

Everything in this layer is deterministic: regexes on the build output and rules on the structured fields. No LLM, no network beyond the optional `gh` calls in stage 2, and nothing is filed, committed or pushed by the tool. A human opens the draft PR.

---

## Pipeline

```
pnpm health  ->  health-reports/<stamp>.json
                        |
pnpm triage  ->  classify every non-pass template into findings
                        |
                 triage-reports/<stamp>.json + .md   (summary, regressions first, draft issues)
                        |
pnpm triage --patch  ->  triage-reports/patches/<id>.<class>.diff + .md   (only auto-patchable classes)
                        |
pnpm triage --apply <patch>  ->  git apply --check, then git apply to the working tree
                        |
human: review, run the template ci, commit on a branch, `gh pr create --draft`
```

### Commands

```bash
pnpm triage                                        # classify the newest health-reports/*.json
pnpm triage --report health-reports/2026-10-09T08-00-00.json
pnpm triage --baseline health-reports/2026-10-02T08-00-00.json   # mark pass -> fail as regressions
pnpm triage --only kit/nextjs,kit/react-vite       # keep a subset
pnpm triage --patch                                # also write patch proposals (runs installs in temp dirs)
pnpm triage --apply triage-reports/patches/kit__docs-demo.doc-drift.diff
pnpm triage --issue 454                            # stage 2: classify a GitHub issue (needs gh)
pnpm triage --out triage-reports --keep 10         # rotation like the health check
pnpm triage:test                                   # unit tests, no network, no installs
```

Output lands in `triage-reports/` (gitignored). The JSON is the source of truth; the Markdown is rendered from it. The exit code is always 0 when the tool ran: triage is advisory and a person decides what becomes an issue.

### What a finding contains

| Field               | Meaning                                                                                                                                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `templateId`        | group-relative id, e.g. `kit/nextjs`                                                                                                                                                                                                                                       |
| `class`             | one of the classes below                                                                                                                                                                                                                                                   |
| `severity`          | `fail` = functionally broken, `warn` = works but needs attention                                                                                                                                                                                                           |
| `confidence`        | `high`, `medium`, `low`: how sure the rule is, a single regex hit is not proof                                                                                                                                                                                             |
| `evidence`          | the matched output lines, at most five                                                                                                                                                                                                                                     |
| `reproduce`         | `pnpm health --only <id>` with the flags the phase needs (`--boot`, `--boot --qa` as a pair for qa runs so a health CLI without `--qa` still boots, `--cargo-test`, `--pm` from the report options), plus the failing phase command when the report records a runnable one |
| `recommendedAction` | one sentence; when a recipe exists but cannot run here, the reason is appended in parentheses                                                                                                                                                                              |
| `autoPatchable`     | true when `scripts/triage/patcher.ts` has a recipe for the class and its precondition holds (the lockfile and audit recipes need a git-tracked lockfile; audit is npm-only)                                                                                                |
| `regression`        | true when the template passed or warned in the `--baseline` report and fails now                                                                                                                                                                                           |
| `dedupeKey`         | `<id>#<class>#<hash>`; stable across runs so the same break is recognisable in a tracker                                                                                                                                                                                   |

A template gets one primary finding for its functional failure (build, rust, boot, qa) plus zero or more advisory findings from the structured fields. A template that passed gets nothing.

---

## Classes

| Class                       | What it means                                                                                  | Severity  | Auto-patch                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| `lockfile-out-of-date`      | `ERR_PNPM_OUTDATED_LOCKFILE`, `npm ci` lock mismatch, frozen lockfile errors                   | fail      | yes: lockfile-only install in a temp copy, diff                                         |
| `peer-dependency-conflict`  | `ERESOLVE`, unresolvable peer ranges                                                           | fail      | no                                                                                      |
| `missing-module`            | `Cannot find module`, `Module not found`, `ERR_MODULE_NOT_FOUND`                               | fail      | no                                                                                      |
| `typescript-error`          | `error TSxxxx`, `Type error:`                                                                  | fail      | no                                                                                      |
| `framework-breaking-change` | invalid `next.config` keys, removed experimental options, Node engine mismatch, Expo SDK gates | fail      | no                                                                                      |
| `registry-or-network`       | `ECONNRESET`, `ETIMEDOUT`, 429/503 from the registry, pnpm fetch errors (flaky)                | fail      | no: re-run before believing it                                                          |
| `temp-dir-or-process`       | `ENOTEMPTY`, `EADDRINUSE`, out of memory, timeouts (flaky infra)                               | fail      | no: re-run alone before believing it                                                    |
| `needs-credentials`         | build output names a required env var or API key; also the health check's credential `skip`    | fail/warn | no: verify with a sandbox key or leave as skipped                                       |
| `rust-compile`              | `cargo check`/`cargo build` failed                                                             | fail      | no                                                                                      |
| `boot-failure`              | build passed but the dev server exited or never answered                                       | fail      | no                                                                                      |
| `qa-render-failure`         | the `--qa` render check (issue #452) saw an error overlay or blank page                        | fail      | no                                                                                      |
| `outdated-major`            | direct deps a major version behind                                                             | warn      | no: plan bumps one at a time                                                            |
| `vulnerable-deps`           | audit reports critical/high/moderate advisories                                                | warn      | npm with a tracked lockfile only: `npm audit fix --package-lock-only`; pnpm/yarn manual |
| `deprecated-direct-dep`     | the registry flagged a direct dependency as deprecated                                         | warn      | no                                                                                      |
| `doc-drift`                 | README or csd instructions reference a script that does not exist                              | warn      | yes: rename to the closest existing script, else TODO                                   |
| `unknown-failure`           | nothing matched; read the output and add a rule to `scripts/triage/classify.ts`                | fail      | no                                                                                      |

Rules are ordered from most specific to least. Credential and infra signals win over generic ones: a tail that contains both `ENOTEMPTY` and `error TS2307` is classified as `temp-dir-or-process`, because the infra noise has to be ruled out first.

Most templates in this repo do not track their own lockfile (only the root `pnpm-lock.yaml` and the `mobile/*` lockfiles are committed), so the lockfile and audit recipes will usually report "manual" with the reason. They check `git ls-files`, not just the disk: a gitignored lockfile left behind by a local install is never patched. They are there for the templates that do carry one. The report already reflects this: `pnpm triage` runs one `git ls-files` at the root and marks a `lockfile-out-of-date` or `vulnerable-deps` finding `autoPatchable: no` with the reason when the template has no tracked lockfile, instead of promising a patch that `--patch` would then refuse.

---

## The skeptical rule

Never file from one run. A finding from a single health run is a hypothesis, not a bug report:

1. Run `pnpm health --only <id>` and confirm it fails again in isolation. Flaky infra (`registry-or-network`, `temp-dir-or-process`) usually goes away.
2. Prefer running triage with `--baseline <last report>`. A regression (passed before, fails now) is the highest-signal finding; something that has failed for weeks is probably already known.
3. Check the `dedupeKey` against what is already open before pasting the draft issue.
4. Several templates failing with the same class in one run almost always means something shared broke (a transitive dependency, a toolchain), not each template individually. File one issue, not ten.

The Markdown report repeats this rule at the top and wraps each draft issue in a collapsed block so it is a deliberate paste, not a click.

---

## Patch proposals

`pnpm triage --patch` runs each recipe on a copy of the template in a temp dir, never on the working tree, and writes a unified diff with repo-relative paths plus a sibling Markdown PR body (title, summary, evidence, repro, checklist). Classes without a recipe, or recipes that cannot produce a diff, print the reason and write nothing.

`pnpm triage --apply <patch>` runs `git apply --check` first and only then `git apply`. It never commits and never pushes. The manual steps after that:

```bash
git diff                                 # read what changed
cd <template> && npm run ci              # prove it
git checkout -b fix/<template>-<class>
git commit -am "<title from the .md>"
gh pr create --draft --title "<title>" --body-file triage-reports/patches/<stem>.md
```

The patcher never opens the PR itself. A human and CI stay in the loop, which is the whole point of the draft.

---

## Stage 2: issue classification (skeleton)

```bash
pnpm triage --issue 454
```

Fetches the issue with `gh issue view --json number,title,body,labels,comments`, the author association with a best-effort `gh api repos/<owner>/<repo>/issues/<n> --jq .author_association` (`gh issue view` has no such JSON field; if this call fails the association is simply absent), and the open issue list with `gh issue list --json number,title --limit 100`. If `gh` is missing or not authenticated it prints what to install and exits 0; any other gh error is printed as is. The output is JSON:

- `kind`: `bug`, `question`, `feature`, `duplicate` or `needs-info`
- `confidence`
- `referencedTemplates`: ids found in the text, matched against the catalog in root `package.json` `repokit.groups`
- `templateHealth`: their status in the newest health report, if one exists
- `signals`: whether the issue has repro steps, versions and real error output
- `duplicateOf`: the most similar open issue when title similarity crosses the threshold
- `commentDraft`: a reply a maintainer can paste after reading the issue

The rules are intentionally simple (labels first, then title shape, then presence of error output). A bug word in explanatory prose is not a bug report on its own: the bug path needs the word in the title, an error block, or repro steps plus versions, and a feature phrasing ("the idea is to", "we could") wins over prose alone. Issues from OWNER, MEMBER or COLLABORATOR authors are never `needs-info`: a maintainer's note is a `feature` (roadmap) or a `bug` by signals. It is a starting point for the "reproduce before accepting" habit in issue #454: a `bug` with a referenced template that the latest health report shows as `pass` deserves a second look before anyone starts fixing. Nothing is posted to GitHub.

---

## Hard rules

- Read-only on the repo unless `--apply` is passed, and `--apply` only touches the working tree.
- Never open issues, never create PRs, never push. Produce material; let a maintainer decide.
- No network in tests. The lockfile and audit recipes refuse to run unless the CLI enables installs.
- When a new failure shape shows up as `unknown-failure`, add a rule with a test in `scripts/triage/classify.test.ts` rather than special-casing the template.
