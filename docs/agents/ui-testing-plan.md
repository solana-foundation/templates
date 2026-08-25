# UI Testing Plan (future work)

This is the agreed direction for testing that templates **actually work in the browser**, not just that they build. It is a plan, not yet an implementation — the health check (`pnpm health`) stops at "build + dev server boots". This doc records the decisions so the future work has a clear path.

## The fidelity ladder

Each rung catches more and costs more. Rung 0 exists today (`pnpm health --boot`).

| Rung     | Checks                                                                           | Catches                                       | Wallet            | Generic? |
| -------- | -------------------------------------------------------------------------------- | --------------------------------------------- | ----------------- | -------- |
| 0 (done) | dev server returns HTTP 200                                                      | server boots                                  | no                | yes      |
| 1        | page renders, **no console errors**, no error boundary, key selectors present    | white screen, hydration crash, missing assets | no                | yes      |
| 2        | screenshot each route, diff vs baseline                                          | CSS / layout / theme regressions              | no                | yes      |
| 3        | click flows, modals, "Connect Wallet" shows the list, connected-state UI renders | broken buttons, dead wallet wiring            | **mock**          | partly   |
| 4        | connect → run the core action → assert tx lands on devnet + UI updates           | the product actually working                  | **headless real** | no       |
| 5        | axe-core a11y, Lighthouse budgets                                                | a11y / perf regressions                       | no                | yes      |

We want to reach **rungs 3-4** eventually. Rungs 1-2-5 are generic and cheap and would land first as a CI gate.

## Key decisions (locked)

1. **Two runners, mirroring the health check.**
   - **Playwright** is the deterministic, CI-runnable layer — same philosophy as `pnpm health` (a script anyone runs). Rungs 1-2-5 live here and gate CI.
   - **An agent driving Claude-in-Chrome** is the exploratory / judgment layer (rungs 3-4 nightly, not gating). Non-deterministic by nature.

2. **Wallet approach: headless wallet-standard wallet.** Register a `window` wallet object wrapping a throwaway `Keypair` that auto-signs, injected via a Playwright init script. The repo is **wallet-standard-first** (ConnectorKit, `@solana/kit`), so this matches the templates' real architecture and unlocks rungs 3 and 4 with one mechanism. (Not a mocked `wallet-adapter`, not a real Phantom/Backpack extension — those are narrower or too flaky for CI.)

3. **Devnet only, throwaway funded keypair.** Rung 4 airdrops to a fresh devnet keypair and asserts the tx confirms. Never mainnet, never real funds, never a real seed phrase.

4. **The architectural seam already exists.** `pnpm health --boot` starts each web template's dev server and hands back the live URL it responded on. That URL is exactly where a future Playwright + headless-wallet layer attaches — so the UI tester plugs into the boot machinery rather than reinventing it.

## Open questions for when we start

- **Per-template flow knowledge (rungs 3-4).** How does the tester know each template's "core action"? Options: a small per-template manifest (`ui-test.json` with routes + primary-action selector — deterministic, must be maintained), vs. agent-driven discovery from the README (zero config, non-deterministic). Likely hybrid: Playwright does generic 1-2-5 as a gate; the agent does 3-4 exploratory.
- **Visual baselines.** Where do rung-2 screenshots live, and what tolerance? (committed PNGs vs. a hosted service like Chromatic/Percy.)
- **Mobile (Expo).** Out of scope for Playwright. Needs an emulator + Maestro/Detox — a separate, later track. Current ceiling for the 6 Expo templates stays at typecheck + lint (already covered by `pnpm health`).

## Suggested first step (when picked up)

Rung 1 (render smoke with console-error assertion) on top of the existing `--boot` flow — tiny, generic, catches the scariest class (white-screen/hydration), and proves the boot→Playwright seam end to end before investing in the wallet layer.
