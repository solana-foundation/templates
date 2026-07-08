# nextjs-keychain

Next.js starter with Tailwind CSS and server-side signing via [`@solana/keychain`](https://github.com/solana-foundation/solana-keychain) — one `SolanaSigner` interface with pluggable key-management backends: local keypair, cloud KMS (AWS, GCP), MPC custody (Para, Utila, Fireblocks), or wallet APIs (Privy, Turnkey, Dfns, CDP, Crossmint, Openfort, Vault). The key never reaches the browser; swap backends by changing environment variables — no code changes.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs-keychain
```

```shell
npm install
npm run dev
```

With no configuration, the app starts with the `memory` backend and an ephemeral keypair — no credentials or signup required. Open [http://localhost:3000](http://localhost:3000) to see the signer address, sign messages, and co-sign transactions from the demo UI.

## API routes

The signer is instantiated once, server-side, in `app/lib/signer.ts` and exposed through route handlers:

| Method | Path                    | Description                                                                                           |
| ------ | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| GET    | `/api/health`           | Backend availability check (`isAvailable()`), backend name, signer address                            |
| GET    | `/api/address`          | The signer's Solana address                                                                           |
| POST   | `/api/sign/message`     | Signs a UTF-8 message; returns a base58 signature                                                     |
| POST   | `/api/sign/transaction` | Adds this signer's signature to a wire transaction; returns the signed wire transaction and signature |

The routes only sign — they never submit transactions to the network. Broadcasting stays with the caller.

## Switching backends

Copy `.env.example` to `.env.local` (or export the variables) and set `KEYCHAIN_BACKEND`. Each backend's required variables are documented in `.env.example`. All backends implement the same `SolanaSigner` interface from `@solana/keychain`, which extends `@solana/kit`'s `TransactionPartialSigner` and `MessagePartialSigner` — so the signer also plugs directly into kit transaction pipelines.

| Backend                                                                 | Type                | Address source                                  |
| ----------------------------------------------------------------------- | ------------------- | ----------------------------------------------- |
| `memory`                                                                | Local keypair       | Derived from the key                            |
| `vault`, `aws-kms`, `gcp-kms`, `turnkey`, `cdp`                         | KMS / API           | Provided in config (no network call at startup) |
| `privy`, `fireblocks`, `dfns`, `para`, `crossmint`, `openfort`, `utila` | Custodial / MPC API | Fetched from the provider at startup            |

Backend quirks: `crossmint` does not support message signing; `cdp` only signs UTF-8 message payloads.

## Security

- **The signing routes ship with no authentication.** As-is, anyone who can reach the app can obtain signatures from the configured key. Add authentication and authorization in front of `/api/sign/*` before deploying anywhere non-local.
- The routes can sign arbitrary messages and transactions with the configured key, which means they can authorize fund movements if that key holds assets. They never submit transactions themselves.
- Credentials are read from environment variables only; nothing is written to disk and the key never reaches the browser. Keep `.env.local` out of version control.
- To revoke access: stop the app and rotate or disable the key at the backend provider (KMS key policy, Vault token, provider API key, etc.).
- The default `memory` backend with an ephemeral key is safe for local experimentation — the key is discarded on restart.
