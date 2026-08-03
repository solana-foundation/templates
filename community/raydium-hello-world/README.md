# Raydium Hello World

A Next.js + Tailwind + TypeScript template that introduces Raydium on Solana. Connect a wallet, inspect a CPMM pool, quote a swap with real curve math, and execute it on devnet.

> **Status: scaffold.** The app shell, wallet connection, and component structure are in place. The Raydium SDK integration is marked with `TODO(raydium)` comments — see [Integration checklist](#integration-checklist).

## What You'll Learn

- How to initialize the Raydium SDK (`@raydium-io/raydium-sdk-v2`) in a browser dApp
- How CPMM pools store reserves and how price is derived from them
- How to quote a swap with `CurveCalculator` before sending it
- How to build, sign, and confirm a swap transaction on devnet

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000, connect a devnet wallet, and swap. Need devnet SOL? Use [faucet.solana.com](https://faucet.solana.com) (the CLI airdrop is heavily rate-limited).

## Devnet Notes (read this first)

Raydium's devnet environment is real but under-documented:

- The SDK needs explicit devnet API hosts (`DEV_API_URLS` + `BASE_HOST: https://api-v3-devnet.raydium.io` — see `src/lib/raydium.ts`).
- Mainnet pool IDs do not exist on devnet. Find live devnet pools via:
  ```bash
  curl "https://api-v3-devnet.raydium.io/pools/info/list?poolType=standard&poolSortField=default&sortType=desc&pageSize=3&page=1"
  ```
- Set your chosen pool in `src/lib/raydium.ts` (`POOL_ID`).

## Project Structure

```
src/
  app/                       Next.js app shell
  components/
    solana/solana-provider   Wallet adapter + connection (devnet by default)
    swap/pool-info-card      Pool pair, reserves, price
    swap/swap-card           Amount in → quote → execute
  hooks/use-pool.ts          Pool data fetching (TODO: SDK wiring)
  lib/raydium.ts             SDK init, quoting, swap building (TODO: SDK wiring)
```

## Integration Checklist

- [ ] `npm install @raydium-io/raydium-sdk-v2 bn.js`
- [ ] SDK init with devnet URL config (`src/lib/raydium.ts`)
- [ ] Pool fetch via `raydium.cpmm.getPoolInfoFromRpc` (`src/hooks/use-pool.ts`)
- [ ] Quote via `CurveCalculator.swapBaseInput` (`src/lib/raydium.ts`)
- [ ] Build + sign + send the swap (`swap-card.tsx`)
- [ ] Replace `og-image.png` with a Raydium-branded image

## Roadmap

v1 is deliberately swap-only. Natural follow-ups: LP deposit/withdraw, CLMM positions, LaunchLab integration.

## Links

- [Raydium docs](https://docs.raydium.io/) · [SDK V2 demo repo](https://github.com/raydium-io/raydium-sdk-V2-demo)
- [create-solana-dapp](https://github.com/solana-foundation/templates)
