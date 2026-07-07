# Keychain Express API

A minimal Express signing service built on [`@solana/keychain`](https://github.com/solana-foundation/solana-keychain) — one `SolanaSigner` interface with 13 pluggable key-management backends. Swap between a local keypair, cloud KMS (AWS, GCP), MPC custody (Para, Utila, Fireblocks), or wallet APIs (Privy, Turnkey, Dfns, CDP, Crossmint, Openfort, Vault) by changing environment variables — no code changes.

## Quick start

```shell
npm install
npm run dev
```

With no configuration, the service starts with the `memory` backend and an ephemeral keypair — no credentials or signup required.

```shell
# Signer health and address
curl http://localhost:3000/health

# Sign an arbitrary message
curl -X POST http://localhost:3000/sign/message \
  -H 'Content-Type: application/json' \
  -d '{"message":"hello solana"}'

# Co-sign a base64-encoded wire transaction
curl -X POST http://localhost:3000/sign/transaction \
  -H 'Content-Type: application/json' \
  -d '{"transaction":"<base64 wire transaction>"}'
```

## Endpoints

| Method | Path                | Description                                                                                           |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------- |
| GET    | `/health`           | Backend availability check (`isAvailable()`), backend name, signer address                            |
| GET    | `/address`          | The signer's Solana address                                                                           |
| POST   | `/sign/message`     | Signs a UTF-8 message; returns a base58 signature                                                     |
| POST   | `/sign/transaction` | Adds this signer's signature to a wire transaction; returns the signed wire transaction and signature |

The service only signs — it never submits transactions to the network. Broadcasting stays with the caller.

## Switching backends

Copy `.env.example` to `.env` (or export the variables) and set `KEYCHAIN_BACKEND`. Each backend's required variables are documented in `.env.example`. All backends implement the same `SolanaSigner` interface from `@solana/keychain`, which extends `@solana/kit`'s `TransactionPartialSigner` and `MessagePartialSigner` — so the signer also plugs directly into kit transaction pipelines.

| Backend                                                                 | Type                | Address source                                  |
| ----------------------------------------------------------------------- | ------------------- | ----------------------------------------------- |
| `memory`                                                                | Local keypair       | Derived from the key                            |
| `vault`, `aws-kms`, `gcp-kms`, `turnkey`, `cdp`                         | KMS / API           | Provided in config (no network call at startup) |
| `privy`, `fireblocks`, `dfns`, `para`, `crossmint`, `openfort`, `utila` | Custodial / MPC API | Fetched from the provider at startup            |

Backend quirks: `crossmint` does not support message signing; `cdp` only signs UTF-8 message payloads.

## Security

- **This template ships with no authentication.** As-is, anyone who can reach the port can obtain signatures from the configured key. Add authentication and authorization in front of the signing routes before deploying anywhere non-local.
- The service can sign arbitrary messages and transactions with the configured key, which means it can authorize fund movements if that key holds assets. It never submits transactions itself.
- Credentials are read from environment variables only; nothing is written to disk. Keep `.env` out of version control.
- To revoke access: stop the service and rotate or disable the key at the backend provider (KMS key policy, Vault token, provider API key, etc.).
- The default `memory` backend with an ephemeral key is safe for local experimentation — the key is discarded on restart.

## Scripts

| Script          | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| `npm run dev`   | Start with live reload                                                            |
| `npm run build` | Compile to `dist/`                                                                |
| `npm start`     | Run the compiled server                                                           |
| `npm run smoke` | Offline self-check: signs and verifies with the memory backend, no network needed |
| `npm run ci`    | Build, lint, format check, and smoke test                                         |
