# moneygram-onramp

Next.js app that embeds the [MoneyGram Ramps](https://xramps.moneygram.com/solana) widget so users move between physical cash and on-chain USDC on Solana. Built on `@solana/kit` v7 with the kit plugin client — the cash-out signing callback is a single `transferToATA` call instead of hand-rolled ATA, blockhash, and compute-budget plumbing.

Based on the [Solana Foundation Next.js kit template](https://github.com/solana-foundation/templates/tree/main/kit/nextjs).

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/community/moneygram-onramp
```

Add your MoneyGram sandbox credentials, then run the dev server:

```shell
cp .env.example .env.local   # add your sandbox secret key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), switch the network selector to **devnet**, and connect a wallet holding devnet USDC plus a little SOL for fees.

Get devnet funds: [faucet.solana.com](https://faucet.solana.com) (SOL) and [faucet.circle.com](https://faucet.circle.com) (USDC).

You need MoneyGram Ramps sandbox credentials to run this — request them through [MoneyGram developer onboarding](https://xramps.moneygram.com/ops/partner/register). Without `MONEYGRAM_SK` set, the session route returns a 500 with a setup hint.

## What's Included

- **Cash out** — sell USDC for cash. The widget requests a transfer; your app signs it.
- **Cash in** — buy USDC with cash. No signing; MoneyGram delivers to the connected wallet.
- **View transaction** — reopen an existing ramp transaction by ID to check its status.
- **Server-side session creation** — the MoneyGram secret key stays on the server.
- **Wallet connection** via [`@solana/kit-plugin-wallet`](https://www.npmjs.com/package/@solana/kit-plugin-wallet), network switcher, live balance, toasts with explorer links, Tailwind CSS v4 light/dark.

## Wallet and Signing Boundaries

This template signs and submits real transactions. What it can and cannot do:

- **The only transaction it ever builds is a USDC transfer** out of the connected wallet, and only during the cash-out flow — see [`app/lib/moneygram/send-usdc.ts`](app/lib/moneygram/send-usdc.ts).
- **Nothing signs without a deliberate user action.** The user clicks **Cash out**, completes MoneyGram's flow, and their wallet shows its own approval prompt for the transfer.
- **Amount and recipient come from the widget**, not from your app. Verify them in your wallet's approval prompt before signing.
- **No key material is held by the app.** Signing goes through the connected wallet-standard wallet; the app never sees a private key.
- **Revoking access** means disconnecting the wallet (in the app, or from the wallet's connected-sites list). MoneyGram sessions are short-lived and server-created, so no long-lived grant persists.
- The MoneyGram secret key is server-only and read from `MONEYGRAM_SK` in [`app/api/moneygram-session/route.ts`](app/api/moneygram-session/route.ts). It is never sent to the browser.

## Where to Look

| File                                                                                       | What it shows                                                                                     |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [`app/lib/moneygram/send-usdc.ts`](app/lib/moneygram/send-usdc.ts)                         | The whole USDC transfer as one `transferToATA(...).sendTransaction()` call.                       |
| [`app/components/moneygram/cash-out-card.tsx`](app/components/moneygram/cash-out-card.tsx) | Loading the SDK, fetching a session, opening the widget, wiring `onSignTransaction`.              |
| [`app/components/moneygram/cash-in-card.tsx`](app/components/moneygram/cash-in-card.tsx)   | The on-ramp flow — same widget, `mode=on-ramp`, no signing callback.                              |
| [`app/api/moneygram-session/route.ts`](app/api/moneygram-session/route.ts)                 | Server-side session creation — the secret key never reaches the browser.                          |
| [`app/lib/solana-client.ts`](app/lib/solana-client.ts)                                     | The kit plugin client: `createClient().use(walletSigner()).use(solanaRpc()).use(tokenProgram())`. |

## How the Cash-Out Signing Works

MoneyGram's widget hands your app an unsigned intent — mint, recipient, and a decimal amount string — through the `onSignTransaction` callback, and expects a confirmed transaction signature back. With the kit plugin client that's one call:

```ts
const { context } = await client.token.instructions
  .transferToATA({ mint, authority: signer, recipient, amount, decimals })
  .sendTransaction();
return context.signature;
```

The plugin client handles what you would otherwise hand-roll:

- **ATA derivation and idempotent creation** for the recipient
- **Compute budget** — the priority fee is configured once on the client
- **Blockhash lifetime** fetch and refresh
- **Wallet signing** via `@solana/kit-plugin-wallet`
- **Send and confirm** with proper expiry handling

Amounts arrive as decimal strings (`"12.50"`). `toBaseUnits` converts them with `BigInt` math — never round a token amount through a `Number`.

## Configuration

| Variable                   | Required | Purpose                                                          |
| -------------------------- | -------- | ---------------------------------------------------------------- |
| `MONEYGRAM_SK`             | yes      | Sandbox secret key. Server-only; used to create widget sessions. |
| `MONEYGRAM_SESSIONS_URL`   | no       | Sessions endpoint. Defaults to the MoneyGram playground host.    |
| `NEXT_PUBLIC_RAMPS_ORIGIN` | no       | Widget/SDK origin. Client-safe. Defaults to the playground host. |

Sandbox credentials run against devnet, so the cash-in and cash-out cards are gated to the devnet network selection. Going to production means swapping in production credentials and endpoints from MoneyGram, and pointing the client at mainnet.
