# Raydium Hello World

A Next.js + Tailwind + TypeScript template that introduces Raydium on Solana. Connect a wallet, inspect a CPMM pool, quote a swap with real curve math, and execute it on devnet.

> Fully wired: pool info loads from RPC, quotes run locally through the SDK's `CurveCalculator`, and swaps are signed by the connected wallet and confirmed on devnet.

## What You'll Learn

- How to initialize the Raydium SDK (`@raydium-io/raydium-sdk-v2`) in a browser dApp — wallet public key + `signAllTransactions`, never a secret key
- How CPMM pools store reserves and how price is derived from them
- How to quote a swap locally with `CurveCalculator` — the same constant-product math the on-chain program runs
- How to build, sign, and confirm a swap transaction on devnet

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000, connect a devnet wallet, and swap. Need devnet SOL? Use [faucet.solana.com](https://faucet.solana.com) (the CLI airdrop is heavily rate-limited).

No configuration is required — the template runs against a live devnet pool out of the box. Environment variables only upgrade the experience:

| Variable                   | Purpose                             | Default                   |
| -------------------------- | ----------------------------------- | ------------------------- |
| `NEXT_PUBLIC_RPC_ENDPOINT` | Custom devnet RPC                   | `clusterApiUrl("devnet")` |
| `NEXT_PUBLIC_POOL_ID`      | CPMM pool to swap against           | Deepest live devnet pool  |
| `NEXT_PUBLIC_INPUT_MINT`   | Input token mint                    | Wrapped SOL               |
| `NEXT_PUBLIC_AMOUNT_RAW`   | Pre-filled input amount (raw units) | empty                     |

Copy `.env.example` to `.env.local` to set any of these.

## Devnet Notes (read this first)

Raydium's devnet environment is real but under-documented:

- The SDK needs explicit devnet API hosts (`DEV_API_URLS` + `BASE_HOST: https://api-v3-devnet.raydium.io` — see `src/lib/raydium.ts`).
- Mainnet pool IDs do not exist on devnet, and devnet pools can disappear over time. Find live pools via the
  [Raydium API v3](https://docs.raydium.io/sdk-api/rest-api) devnet host:
  ```bash
  curl "https://api-v3-devnet.raydium.io/pools/info/list?poolType=standard&poolSortField=default&sortType=desc&pageSize=3&page=1"
  ```
- Set your chosen pool via `NEXT_PUBLIC_POOL_ID` in `.env.local`. The in-app pool card shows the same recovery steps if the default pool ever dies.

## Project Structure

```
src/
  app/                       Next.js app shell (grid background, hero, fonts)
  components/
    solana/solana-provider   Wallet adapter + connection (devnet by default)
    swap/pool-info-card      Pool pair, reserves, price — with recovery UX
    swap/swap-card           Amount in → live quote → execute → explorer link
    grid-background          Solana-branded decorative grid
    theme-toggle             Light/dark via next-themes
  hooks/
    use-pool.ts              Pool fetch (info + reserves) shared by both cards
    use-swap.ts              Per-keystroke local quoting + swap state machine
  lib/
    raydium.ts               SDK init (devnet hosts), quoting, swap execution
    explorer.ts              Cluster-aware explorer URLs + ellipsify
```

## How the Swap Works

1. `use-pool` fetches pool info and reserves from the RPC via `cpmm.getPoolInfoFromRpc`.
2. As you type, `use-swap` converts the amount to raw units (string math — no float precision loss) and quotes locally with `CurveCalculator.swapBaseInput`. No network calls per keystroke.
3. On Swap, the SDK builds a V0 transaction (including SOL wrapping), your wallet signs it, and the template confirms it and links the signature on the explorer. The quote and its amount travel as an atomic pair, and the quote object is cloned before execution because the SDK applies the slippage discount in place.

## Roadmap

v1 is deliberately swap-only. Natural follow-ups: LP deposit/withdraw, CLMM positions, LaunchLab integration, and moving pool fetching to a query library per the kit-family convention.

## Links

- [Raydium docs](https://docs.raydium.io/) · [SDK V2 demo repo](https://github.com/raydium-io/raydium-sdk-V2-demo)
- [create-solana-dapp](https://github.com/solana-foundation/templates)
