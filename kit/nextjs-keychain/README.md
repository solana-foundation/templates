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

Signers are instantiated lazily, server-side, in `app/lib/signer.ts` — one per backend that is configured in the environment — and exposed through route handlers:

| Method | Path                    | Description                                                                                                                               |
| ------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/signers`          | Lists every configured backend with its signer address and availability (`isAvailable()`)                                                 |
| POST   | `/api/sign/message`     | Signs a UTF-8 message with the given backend (`{ message, backend? }`); returns a base58 signature                                        |
| POST   | `/api/sign/transaction` | Adds the given backend's signature to a wire transaction (`{ transaction, backend? }`); returns the signed wire transaction and signature |

The routes only sign — they never submit transactions to the network. Broadcasting stays with the caller.

## Adding backends

Copy `.env.example` to `.env.local` (or export the variables) and fill in the variables for any backend; every fully-configured backend appears in the registry and the demo UI's signer picker — no code changes. The `memory` backend is always available. All backends implement the same `SolanaSigner` interface from `@solana/keychain`, which extends `@solana/kit`'s `TransactionPartialSigner` and `MessagePartialSigner` — so the signers also plug directly into kit transaction pipelines.

| Backend                                                                 | Type                | Address source                                  |
| ----------------------------------------------------------------------- | ------------------- | ----------------------------------------------- |
| `memory`                                                                | Local keypair       | Derived from the key                            |
| `vault`, `aws-kms`, `gcp-kms`, `turnkey`, `cdp`                         | KMS / API           | Provided in config (no network call at startup) |
| `privy`, `fireblocks`, `dfns`, `para`, `crossmint`, `openfort`, `utila` | Custodial / MPC API | Fetched from the provider at startup            |

Backend quirks: `crossmint` does not support message signing; `cdp` only signs UTF-8 message payloads.

### Local demo with Vault

Vault is the only backend that runs fully locally with no signup — ideal for seeing a second signer next to `memory`. It requires the [Vault CLI](https://developer.hashicorp.com/vault/install) (`brew install vault` on macOS); there is no way to run a Vault server from Node alone:

```shell
vault server -dev -dev-tls
```

In another terminal, using the `VAULT_ADDR`, `VAULT_CACERT`, and root token the dev server printed:

```shell
export VAULT_ADDR=https://127.0.0.1:8200 VAULT_CACERT=<printed path> VAULT_TOKEN=<printed root token>
vault secrets enable transit
vault write -f transit/keys/demo type=ed25519
vault read -field=keys -format=json transit/keys/demo   # note the base64 public_key
node --input-type=module -e "import { getBase58Decoder } from '@solana/kit'; console.log(getBase58Decoder().decode(Buffer.from(process.argv[1], 'base64')))" <base64 public_key>
```

Put the connection details in `.env.local` (`VAULT_ADDR`, `VAULT_TOKEN`, `VAULT_KEY_NAME=demo`, `VAULT_PUBLIC_KEY=<base58>`), then start the app with the dev server's CA trusted:

```shell
NODE_EXTRA_CA_CERTS=<printed VAULT_CACERT path> npm run dev
```

The signer list now shows `vault` as available, backed by a real Ed25519 key in Vault's transit engine.

## Security

- **The signing routes ship with no authentication.** As-is, anyone who can reach the app can obtain signatures from the configured key. Add authentication and authorization in front of `/api/sign/*` before deploying anywhere non-local.
- The routes can sign arbitrary messages and transactions with the configured key, which means they can authorize fund movements if that key holds assets. They never submit transactions themselves.
- Credentials are read from environment variables only; nothing is written to disk and the key never reaches the browser. Keep `.env.local` out of version control.
- To revoke access: stop the app and rotate or disable the key at the backend provider (KMS key policy, Vault token, provider API key, etc.).
- The default `memory` backend with an ephemeral key is safe for local experimentation — the key is discarded on restart.
