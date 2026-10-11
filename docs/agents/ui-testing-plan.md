# UI Testing Plan (future work)

This is the agreed direction for testing that templates **actually work in the browser**, not just that they build. Rungs 0 and 1 are implemented in the health check (`pnpm health --boot` and `pnpm health --qa`); the rest is still a plan. This doc records the decisions so the future work has a clear path.

## The fidelity ladder

Each rung catches more and costs more. Rung 0 exists today (`pnpm health --boot`), and rung 1 shipped as `pnpm health --qa` (issue #452): `scripts/health/qa.ts` holds the browser step and the pure `classifyRender` verdict, `checkBoot` in `scripts/health/boot.ts` runs it through its `onReady` hook while the dev server is up, and the Markdown report ends with a screenshot gallery. Details in `docs/agents/health-check.md`, section "Render QA".

| Rung     | Checks                                                                           | Catches                                       | Wallet            | Generic? |
| -------- | -------------------------------------------------------------------------------- | --------------------------------------------- | ----------------- | -------- |
| 0 (done) | dev server returns HTTP 200                                                      | server boots                                  | no                | yes      |
| 1 (done) | page renders, **no console errors**, no error overlay, not blank, screenshot     | white screen, hydration crash, missing assets | no                | yes      |
| 2        | screenshot each route, diff vs baseline                                          | CSS / layout / theme regressions              | no                | yes      |
| 3        | click flows, modals, "Connect Wallet" shows the list, connected-state UI renders | broken buttons, dead wallet wiring            | **mock**          | partly   |
| 4        | connect → run the core action → assert tx lands on devnet + UI updates           | the product actually working                  | **headless real** | no       |
| 5        | axe-core a11y, Lighthouse budgets                                                | a11y / perf regressions                       | no                | yes      |

We want to reach **rungs 3-4** eventually. Rungs 1-2-5 are generic and cheap and would land first as a CI gate.

## Key decisions (locked)

1. **Two runners, mirroring the health check.**
   - **A scripted headless browser** is the deterministic, CI-runnable layer — same philosophy as `pnpm health` (a script anyone runs). Rungs 1-2-5 live here and gate CI. Rung 1 uses puppeteer because it was already a devDependency (zero new packages); Playwright remains the likely choice once rungs 3-4 need init scripts and richer tooling, and the swap is confined to `checkRender` in `scripts/health/qa.ts`.
   - **An agent driving Claude-in-Chrome** is the exploratory / judgment layer (rungs 3-4 nightly, not gating). Non-deterministic by nature.

2. **Wallet approach: headless wallet-standard wallet.** Register a `window` wallet object wrapping a throwaway `Keypair` that auto-signs, injected via a Playwright init script. The repo is **wallet-standard-first** (ConnectorKit, `@solana/kit`), so this matches the templates' real architecture and unlocks rungs 3 and 4 with one mechanism. (Not a mocked `wallet-adapter`, not a real Phantom/Backpack extension — those are narrower or too flaky for CI.)

3. **Devnet only, throwaway funded keypair.** Rung 4 airdrops to a fresh devnet keypair and asserts the tx confirms. Never mainnet, never real funds, never a real seed phrase.

4. **The architectural seam already exists.** `pnpm health --boot` starts each web template's dev server and hands the live URL to an `onReady(url)` hook on `checkBoot` before the server is killed. Rung 1 attaches there today; a future headless-wallet layer attaches at the same hook rather than reinventing the boot machinery.

## Open questions for when we start

- **Per-template flow knowledge (rungs 3-4).** How does the tester know each template's "core action"? Options: a small per-template manifest (`ui-test.json` with routes + primary-action selector — deterministic, must be maintained), vs. agent-driven discovery from the README (zero config, non-deterministic). Likely hybrid: Playwright does generic 1-2-5 as a gate; the agent does 3-4 exploratory.
- **Visual baselines.** Where do rung-2 screenshots live, and what tolerance? (committed PNGs vs. a hosted service like Chromatic/Percy.)
- **Mobile (Expo).** Out of scope for Playwright. Needs an emulator + Maestro/Detox — a separate, later track. Current ceiling for the 6 Expo templates stays at typecheck + lint (already covered by `pnpm health`).

## Next step

Rung 1 is done (`pnpm health --qa`). The next generic rung is 2 (screenshot diffing): the screenshots already exist under `health-reports/screenshots/`, so the open question is only where baselines live and what tolerance to use. Rung 5 (axe-core) can reuse the same page session in `checkRender`.
