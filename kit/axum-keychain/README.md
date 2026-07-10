# axum-keychain

Axum (Rust) signing API with a Next.js + Tailwind frontend, built on [`solana-keychain`](https://github.com/solana-foundation/solana-keychain) — one `SolanaSigner` trait with pluggable key-management backends. All signing, transaction building, and verification happens in Rust; the frontend is plain fetch-and-render and picks a signer per request.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/axum-keychain
```

```shell
npm install
npm run dev
```

`npm run dev` starts the Axum API (`cargo run`, port 8080) and the Next.js frontend (port 3000) together. With no configuration, the registry contains the `memory` backend with an ephemeral keypair — no credentials or signup required. Open [http://localhost:3000](http://localhost:3000) to pick a signer, sign messages, and co-sign transactions from the demo UI.

Requires a [Rust toolchain](https://rustup.rs) alongside Node.js.

## API routes

Signers are constructed at startup in `src/signers.rs` — one per backend configured in the environment — and served by Axum handlers in `src/api.rs`. The Next.js rewrite in `next.config.ts` proxies `/api/*` to the Rust service; all transaction building, decoding, and verification happens in Rust, so the frontend is plain fetch-and-render:

| Method | Path                    | Description                                                                                                                                                                      |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/signers`          | Lists every configured backend with its signer address and availability (`is_available()`)                                                                                       |
| POST   | `/api/sign/message`     | Signs a UTF-8 message with the given backend (`{ message, backend? }`); returns a base58 signature                                                                               |
| POST   | `/api/sign/transaction` | Adds the given backend's signature to a wire transaction (`{ transaction, backend? }`); returns the signed wire transaction and signature                                        |
| POST   | `/api/demo/transaction` | Builds a memo transaction with a placeholder blockhash (`{ memo, backend? }`), signs it, verifies the signature, and returns the decoded fields plus the signed wire transaction |

The routes only sign — they never submit transactions to the network. Broadcasting stays with the caller. Transactions use the legacy wire format (`bincode`-serialized `solana_sdk::Transaction`, base64-encoded).

## Adding backends

Copy `.env.example` to `.env.local` (or export the variables) and fill in the variables for any backend; every fully-configured backend appears in the registry and the demo UI's signer picker — no code changes. The `memory` backend is always available.

All `solana-keychain` backends are compiled in (the `all` feature). To slim the dependency tree and build time, replace `all` in `Cargo.toml` with just the features you use, e.g.:

```toml
solana-keychain = { version = "1.4", default-features = false, features = ["memory", "vault", "sdk-v2"] }
```

## Local demo with Vault

Vault is the only backend that runs fully locally with no signup. It requires the [Vault CLI](https://developer.hashicorp.com/vault/install) (`brew install vault` on macOS):

```shell
vault server -dev
```

In another terminal, using the root token the dev server printed:

```shell
export VAULT_ADDR=http://127.0.0.1:8200 VAULT_TOKEN=<printed root token>
vault secrets enable transit
vault write -f transit/keys/demo type=ed25519
vault read -field=keys -format=json transit/keys/demo   # note the base64 public_key
node -e "const b=Buffer.from(process.argv[1],'base64');const A='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';let n=BigInt('0x'+b.toString('hex')),o='';while(n>0n){o=A[Number(n%58n)]+o;n/=58n}for(const x of b){if(x)break;o='1'+o}console.log(o)" <base64 public_key>
```

Put the connection details in `.env.local`:

```shell
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=<printed root token>
VAULT_KEY_NAME=demo
VAULT_PUBLIC_KEY=<base58>
VAULT_ALLOW_HTTP=true
```

`VAULT_ALLOW_HTTP=true` builds the signer with a caller-supplied HTTP client (see `src/signers.rs`) because `solana-keychain` enforces HTTPS by default — use it for local development only. Restart `npm run dev` and the signer list shows `vault` as available, backed by a real Ed25519 key in Vault's transit engine.

## Security

- **The signing routes ship with no authentication.** As-is, anyone who can reach the API can obtain signatures from the configured keys. Add authentication and authorization in front of `/api/sign/*` before deploying anywhere non-local.
- The routes can sign arbitrary messages and transactions with the configured keys, which means they can authorize fund movements if a key holds assets. They never submit transactions themselves.
- Credentials are read from environment variables only; nothing is written to disk and keys never reach the browser. Keep `.env.local` out of version control.
- `VAULT_ALLOW_HTTP` disables transport security to the Vault server — local development only.
- To revoke access: stop the service and rotate or disable the key at the backend provider.
- The default `memory` backend with an ephemeral key is safe for local experimentation — the key is discarded on restart.
