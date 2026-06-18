# nextjs-subscriptions

Subscriber-facing "Subscribe with Solana" starter, built with `@solana/kit` and the [Subscriptions program](https://github.com/solana-foundation/subscriptions).

This is the half every app integrating subscriptions has to build itself: let **your users** subscribe to **your** plans and manage their subscriptions. Plan creation and payment collection are merchant/backend concerns (kept out of the UI); a one-click **Create demo plan** button seeds one locally so you can try the flow.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs-subscriptions
```

```shell
npm install
npm run dev
```

There is **no program to build or deploy** — the app talks to the Subscriptions program already on devnet and mainnet via the published [`@solana/subscriptions`](https://www.npmjs.com/package/@solana/subscriptions) SDK.

## Try it

Open [http://localhost:3000](http://localhost:3000), connect a wallet on devnet, and click **Create demo plan** on the Subscribe page. It creates a plan with your wallet as the merchant, mints you test tokens, and sets you as the active merchant — then subscribe. No terminal, no config.

Need devnet SOL for rent/fees? [faucet.solana.com](https://faucet.solana.com/) or `solana airdrop 2`.

## Point it at a real merchant

In production, plans are created by your backend (via `@solana/subscriptions`), not the UI. Point the app at the merchant whose plans it should sell by setting `.env.local`:

```
NEXT_PUBLIC_MERCHANT_ADDRESS=<your merchant address>
```

Restart `npm run dev`. The Subscribe page then lists that merchant's plans instead of the demo flow.

## What's Included

- **Subscribe flow** — browse the merchant's plans, initialize the per-mint Subscription Authority, and subscribe in one click
- **Manage subscriptions** — cancel (grace period until end of the billing period), resume, or close an ended subscription to reclaim rent
- **Wallet connection** via wallet-standard and **cluster switching**
- **Create demo plan** button — one-click local setup (wallet as merchant, mints test tokens)
- **Account queries** via the `@solana/subscriptions` Kit plugin, cached with SWR
- **Toast notifications** with explorer links and human-readable program errors
- **Tailwind CSS v4** with light/dark mode

## How it works

The Subscriptions program uses a **Subscription Authority (SA)** PDA per `(user, mint)`. The SA is the single delegate on the user's token account with `u64::MAX` approval, but can only move tokens when a delegation authorizes it — so one token account safely powers many subscriptions.

The app composes the `subscriptionsProgram()` Kit plugin in [`app/lib/subscriptions-client.ts`](app/lib/subscriptions-client.ts):

```ts
createEmptyClient()
  .use(signer(walletSigner)) // must precede the rpc plugin
  .use(solanaRpc({ rpcUrl }))
  .use(subscriptionsProgram());
```

Subscribe with `client.subscriptions.instructions.subscribe(...).sendTransaction()`; read with `client.subscriptions.queries.*`. The plugin derives PDAs, fills the connected identity/payer, and snapshots live plan terms.

**Program ID:** `De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44`

### Merchant / backend side

Out of scope for this UI — merchants manage plans with the [Subscriptions web UI](https://github.com/solana-foundation/subscriptions) or SDK. Collecting a payment is a backend job (e.g. a cron) calling:

```ts
client.subscriptions.instructions
  .transferSubscription({
    planPda,
    subscriptionPda,
    delegator,
    receiverAta,
    amount,
    tokenMint,
    tokenProgram,
  })
  .sendTransaction();
```

## Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| Frontend      | Next.js 16, React 19, TypeScript                  |
| Styling       | Tailwind CSS v4                                   |
| Solana Client | `@solana/kit`, wallet-standard                    |
| Program SDK   | `@solana/subscriptions` (Kit plugin)              |
| Tokens        | `@solana-program/token`, `@solana-program/system` |

## Project Structure

```
├── app/
│   ├── page.tsx                        # Subscribe (pricing) page
│   ├── subscriptions/page.tsx          # Manage your subscriptions
│   ├── components/subscriptions/
│   │   ├── subscribe-card.tsx          # Init authority + subscribe
│   │   ├── create-demo-plan.tsx        # One-click local setup (wallet as merchant)
│   │   └── subscription-card.tsx       # Cancel / resume / revoke
│   └── lib/
│       ├── subscriptions-client.ts     # subscriptionsProgram() Kit plugin client
│       ├── subscriptions/              # constants (merchant address), formatting, PDA + ATA helpers
│       ├── wallet/                     # wallet-standard connection layer
│       └── hooks/                      # client + SWR query hooks
```

## Learn More

- [Subscriptions program](https://github.com/solana-foundation/subscriptions) — program, SDK, and architecture docs
- [`@solana/subscriptions`](https://www.npmjs.com/package/@solana/subscriptions) — TypeScript SDK and Kit plugin
- [@solana/kit](https://github.com/anza-xyz/kit) — Solana JavaScript SDK
- [Solana Docs](https://solana.com/docs) — core concepts and guides
