# Templates Health Check

A repeatable way to answer "are the templates still healthy?".

It has two layers:

1. **The automated script** (`pnpm health`) — does the mechanical, reproducible work: install each template in isolation, run its `ci`/`build`, and report outdated deps, known vulnerabilities, deprecated direct dependencies, and doc/reality drift. Emits JSON + Markdown. No AI required.
2. **This runbook** — the judgment layer on top: the questions a script can't answer (is the dev server actually usable, is the whole stack still the recommended 2026 choice, did a Rust program compile and pass its tests). A human or any coding agent can drive it from the JSON the script produces.

The split matters: the script gives you **facts** anyone can reproduce; the runbook is where **judgment** happens.

---

## Part 1 — Run the automated check

From the repo root:

```bash
pnpm health                       # every template: install + build/ci, all advisory checks
pnpm health --only kit/nextjs     # a single template (comma-separated ids ok)
pnpm health --group community     # one repokit group (kit|web3js|mobile|community)
pnpm health --boot                # also boot web templates and confirm the dev server responds
pnpm health --no-build            # install + deps/audit only (fast inventory pass)
pnpm health --concurrency 4       # how many templates to check in parallel (default 3)
pnpm health --baseline health-reports/2026-06-20.json   # diff against a previous run
```

Output lands in `health-reports/<date>.json` and `health-reports/<date>.md` (gitignored). The JSON is the source of truth; the Markdown is rendered from it. Exit code is non-zero when any template **fails**, so CI can gate on it.

The script is read-only on the repo, copies each template to a temp dir before installing (never mutates the working tree), and never touches mainnet, real funds, or real keys.

### What the script checks (the five dimensions)

| Dimension             | How                                                                        | Gates status?                                                 |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Build health          | install + the template's `ci` script (or `build`)                          | **Yes — build/rust/boot are the only checks that can `fail`** |
| Rust compile          | `cargo check` (programs) / `cargo build` (host); `--cargo-test` adds tests | Yes (templates with a `Cargo.toml`)                           |
| Runtime boot          | `--boot` starts the dev server, polls for an HTTP response                 | Yes (web templates only)                                      |
| Dependency freshness  | `npm outdated`, bucketed into major / minor / patch                        | Advisory → caps at `warn`                                     |
| Known vulnerabilities | `npm audit` severity counts                                                | Advisory → caps at `warn`                                     |
| Deprecation           | registry "deprecated" warnings for **direct** deps only                    | Advisory → caps at `warn`                                     |
| Doc / reality drift   | scripts referenced in README / csd-instructions that don't exist           | Advisory → caps at `warn`                                     |

**`fail` means broken** (doesn't build, compile, or boot). **`warn` means works but needs attention** (outdated, vulnerable, deprecated, drifted). This is deliberate: a template with a transitive advisory still works, and flagging it `fail` would just duplicate dependabot.

**Requirements:** Node + npm for all templates; `cargo` for Rust templates (they're reported as skipped if it's missing); the Solana platform tools (`cargo-build-sbf`) only for `--cargo-test` on on-chain programs.

---

## Part 2 — The judgment dimensions the script leaves to you

The script intentionally stops where reproducible facts end. These need a person or an agent.

### A. Runtime correctness beyond "boots"

`--boot` proves the dev server answers an HTTP request. It does **not** prove the app works. For a real runtime pass on a web template:

- Connect a wallet, trigger the template's core action, and confirm it lands **on devnet**.
- Use a throwaway devnet keypair funded by an airdrop. **Never** a real wallet, mainnet, or real funds.
- If the template needs a paid API key or external service to do anything (the script marks these `needsSecrets`), don't fake it — verify only if you have a sandbox/test key, otherwise record it as "skipped — requires credentials."

### B. Whole-stack relevance and deprecation

The script flags a _single deprecated package_. It cannot judge whether an entire stack is still the right recommendation. Use this rubric — a template is **stale** (not broken) if any apply:

- A core library's GitHub repo is **archived** or unmaintained.
- A core dependency hasn't published in **> 12 months** and has open security issues.
- There's an **official successor** the ecosystem has moved to (e.g. a `@solana/web3.js`-only template when the modern path is `@solana/kit`, an abandoned wallet adapter, a deprecated RPC method).
- The template demonstrates a pattern the docs no longer recommend.

Stale templates are a roadmap signal, not a CI failure. Note them; don't auto-rewrite.

### C. Rust / pinocchio templates

The script **does** check these automatically when `cargo` is on PATH:

- **On-chain programs** (pinocchio, anchor, anything with a `cdylib` crate) → `cargo check` on the program crate. Fast, host-target, no Solana platform tools required — it just proves the program compiles. This matches the templates' own `check` recipe.
- **Host binaries** (e.g. an axum server) → `cargo build`.
- Templates with both Rust and a TS client (pinocchio) get the Rust check **and** the npm `ci` for the client.

With `--cargo-test` it also runs the suite: host crates via `cargo test`; programs via `cargo-build-sbf` then `cargo test` (this needs the Solana platform tools — if `cargo-build-sbf` is missing, the script keeps the passing `cargo check` and notes that tests were skipped). Program integration tests `include_bytes!` the built `.so`, which is why the workspace-wide check is deferred to this flag.

What's still **manual**: deploying the program to devnet and exercising it through a client end to end. The script proves it compiles and its tests pass; it does not prove on-chain behavior.

### D. Mobile / Expo templates

Realistic automated ceiling is install + `tsc --noEmit` + lint (their `ci` scripts already do this). A true runtime pass needs an emulator/device and is manual QA, out of scope for an autonomous run.

### E. Community templates

They have no enforced CI contract, so the README is the spec. The script still installs and runs whatever scripts exist; when there's no `ci`/`build`, fall back to following the README's quickstart and confirm its commands match the real `package.json` scripts (the doc-drift check catches the obvious mismatches).

---

## Part 3 — Turn results into action

1. **Read regressions first.** Run with `--baseline <last report>`; anything that went `pass → fail` is the highest-signal finding (a dependency update broke something that worked).
2. **Triage failures.** For each `fail`, the Markdown includes the failing phase, command, output tail, and a repro command. Reproduce before assuming the template is at fault — an upstream break can fail many templates at once.
3. **Decide what becomes an issue.** Don't auto-file. A human picks which failures and stale-stack findings become GitHub issues or fixes.
4. **Escalate systemic breakage.** More than a handful of failures in one run usually means something shared broke (a transitive dep, a toolchain), not each template individually.

---

## Hard rules

- Devnet only. Never real funds, real wallets, mainnet, or real API keys.
- Read-only on the repo unless explicitly asked to fix something. The script never writes to template dirs.
- Don't open issues or push branches automatically — produce the report, let a maintainer decide.
- Isolate every install (the script uses a temp dir per template; do the same for manual checks).
- Time-box slow templates rather than blocking the whole run on one.

## Cadence

Run on demand, or schedule it (a weekly cron / GitHub Action calling `pnpm health`). This file is plain Markdown — any contributor reads it directly, and any coding agent can be pointed at it plus the latest `health-reports/*.json` to drive the judgment layer.
