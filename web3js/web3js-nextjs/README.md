# web3js-nextjs

Next.js starter built on [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) v3 and [`@solana/wallet-adapter`](https://www.npmjs.com/package/@solana/wallet-adapter) v3. Connect a browser wallet, switch networks, sign in with Solana (SIWS 1.1), and send real transactions — SOL transfers and SPL token actions — with the familiar `Connection` / `Transaction` / `PublicKey` API.

## Getting Started

Requires Node.js 24 or newer.

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/web3js/web3js-nextjs
```

Sign-in needs a session secret. Copy the example env file and fill in `AUTH_SECRET`. In production also set `APP_URL` to the app's public origin (for example `https://app.example.com`); development falls back to the request host.

```shell
cp .env.example .env.local
openssl rand -base64 32 # paste the output into AUTH_SECRET
```

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect a wallet, and (on devnet) click **Airdrop 1 SOL** to fund it. Then try the actions. Need devnet SOL another way? [faucet.solana.com](https://faucet.solana.com/).

To use localnet, start a local validator in another terminal before selecting **localnet**. Only wallets that advertise the `solana:localnet` chain are listed there.

```shell
solana-test-validator
```

The public mainnet RPC endpoint rejects most browser traffic. Set `NEXT_PUBLIC_MAINNET_RPC_URL` in `.env.local` to a provider endpoint before using **mainnet**.

## What's Included

- **Wallet connection** with `@solana/wallet-adapter` v3 — `ConnectionProvider`, `WalletProvider`, `WalletModalProvider`, and a themed `WalletMultiButton` (Wallet Standard discovery, auto-reconnect)
- **Network switcher** — devnet, testnet, mainnet, localnet
- **Live SOL balance** via `connection.getBalance` + `connection.onAccountChange`, and a devnet/testnet airdrop
- **Transfer SOL** with `SystemProgram.transfer` in a legacy `Transaction`
- **Sign message** with `signMessage`, verified locally with `publicKey.verifySignature`
- **SPL token actions** with [`@solana-program/token`](https://www.npmjs.com/package/@solana-program/token) — create a mint, mint to your associated token account, mint more, and transfer to any wallet (recipient ATA created idempotently), with balances decoded by `getTokenDecoder` / `getMintDecoder`
- **Sign In With Solana** — server-issued nonce, wallet `signIn`, server-side verification, and an HMAC-signed httpOnly session cookie
- **Toast notifications** with explorer links, **Tailwind CSS v4** with light/dark mode

## How it works

### Providers

[`app/components/solana-provider.tsx`](app/components/solana-provider.tsx) wires the wallet adapter to the selected cluster:

```tsx
<ConnectionProvider endpoint={getClusterUrl(cluster)}>
  <WalletProvider chain={getWalletChain(cluster)} onError={onWalletError}>
    <WalletModalProvider>{children}</WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
```

Both props are plain strings looked up from [`app/lib/cluster.ts`](app/lib/cluster.ts), so they stay referentially stable between renders. Changing `chain` rebuilds the wallet client; localnet uses `solana:localnet` so wallets that broadcast transactions themselves send them to the local validator at `http://localhost:8899`.

Components use `useConnection()` for the v3 `Connection` and `useWallet()` for `publicKey`, `signer`, `sendTransaction`, `signMessage`, and `signIn`.

### Sending transactions

[`app/lib/hooks/use-send-transaction.tsx`](app/lib/hooks/use-send-transaction.tsx) fetches a blockhash, calls `sendTransaction(transaction, connection, { minContextSlot, signers })`, confirms with the blockhash strategy, and shows a toast. Extra local signers (such as a new mint keypair) go in `signers` and sign before the wallet does.

### SPL tokens on web3.js v3

v3 `Transaction.add(...)` accepts Kit instructions and instruction plans, so `@solana-program/token` builders drop straight in — no `@solana/spl-token`. See [`app/components/actions/token-card.tsx`](app/components/actions/token-card.tsx):

```ts
const newMint = await Keypair.generate();
const transaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: publicKey,
    newAccountPubkey: newMint.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(space),
    space,
    programId: new PublicKey(TOKEN_PROGRAM_ADDRESS),
  }),
  getInitializeMint2Instruction({
    mint: newMint.publicKey,
    decimals,
    mintAuthority: publicKey.toBase58(),
    freezeAuthority: null,
  }),
  await getMintToATAInstructionPlanAsync({
    payer: signer,
    owner: publicKey.toBase58(),
    mint: newMint.publicKey.toBase58(),
    mintAuthority: signer,
    amount,
    decimals,
  })
);
await sendTransaction(transaction, connection, { signers: [newMint] });
```

The rules of thumb at the boundary:

- Builder account inputs take a v3 `PublicKey` directly; fields typed as a bare `Address` take `publicKey.toBase58()`.
- Signer-typed fields (`payer`, `mintAuthority`, `authority`) take `useWallet().signer` so the instruction marks the wallet as a signer. The wallet still signs once, through `sendTransaction`.
- `new PublicKey(kitAddress)` converts a Kit address back for `SystemProgram` and `Connection` calls.
- Token balances come from `connection.getAccountInfo(...)` decoded with `getTokenDecoder()` / `getMintDecoder()`; amounts are `bigint`.

### Sign In With Solana

The flow lives in [`app/components/auth-context.tsx`](app/components/auth-context.tsx) (client) and [`app/api/auth`](app/api/auth) (server):

1. The client requests a nonce from `GET /api/auth/nonce`.
2. It builds a SIWS input (domain, address, statement, URI, nonce, `issuedAt`) and calls the wallet's `signIn(input)`. When `useWallet().supportsSignInWithOffchainMessage` is true (wallets implementing `solana:signIn` 1.1.0), it passes `useOffchainMessage: { messageVersion: 1 }` so the wallet signs a version 1 off-chain message, which hardware wallets can display.
3. The client posts the input and output to `POST /api/auth/verify`.
4. The server verifies with [`verifySignInRequest`](app/lib/auth/siws.ts) and, on success, sets a session cookie.
5. `GET /api/auth/session` reads the session; `DELETE /api/auth/session` signs out. The client also signs out when the wallet settles as disconnected or switches accounts, but not while it reconnects after a page load or cluster switch.

What the server verifies before issuing a session:

- `input.domain` equals the host of `APP_URL`. The client signs `window.location.host`, so `APP_URL` must be the exact origin users visit. Without `APP_URL`, development uses the request's `Host` header and production refuses to verify, because a proxy or a phishing backend can set `Host` to anything.
- `issuedAt` is no older than five minutes (and not more than a minute in the future); `expirationTime` / `notBefore` are honored when present.
- The signature is 64 bytes and the public key 32 bytes, and `verifySignIn(input, output)` from `@solana/wallet-adapter/core` passes: the account's public key matches its address, the signed message reproduces every input field and names `input.address`, and it carries a valid signature from that account, for both plain-text and off-chain message formats.
- The nonce was issued by this server, has not expired, and is consumed so it cannot be replayed.
- `POST /api/auth/verify` and `DELETE /api/auth/session` reject requests whose `Origin` header differs from the app origin.

The session cookie is `httpOnly`, `SameSite=Lax`, `Secure` in production, and expires after 24 hours. Its value is `base64url(JSON) + "." + HMAC-SHA256(AUTH_SECRET)`, so the server can trust it without a database. Rotating `AUTH_SECRET` invalidates every session.

Trust boundaries and demo limitations:

- Everything the client sends is untrusted; only the server checks above decide whether a session is issued. Client-side state (the signed-in panel) is a convenience, not an authorization check — protect your own API routes by reading the cookie with `decodeSession`.
- The nonce store in [`app/lib/auth/nonce-store.ts`](app/lib/auth/nonce-store.ts) is an in-memory `Map` for demo purposes. Nonces are lost on restart and are not shared between server instances or serverless invocations. Use a shared store with an atomic consume (Redis `GETDEL`, a database row delete) in production.
- Sessions are stateless, so signing out clears the cookie but cannot revoke a token copied elsewhere before it expires. Add a server-side session table if you need revocation.
- Signing in proves wallet ownership only; it never requests a transaction signature or moves funds.

## Testing

```shell
npm run test
```

The [Vitest](https://vitest.dev) suite in [`tests/`](tests/) covers the pure logic without any network: amount parsing and formatting, and the SIWS server checks — signed with a real generated `Keypair` in both plain-text and off-chain message formats — including replayed and unknown nonces, wrong domains, stale timestamps, tampered signatures, mismatched inputs, forged account addresses, and session token tampering and expiry.

`npm run ci` runs the build, typecheck, lint, format check, and tests.

## Coming from web3.js v1

[@solana/web3.js v3](https://github.com/solana-foundation/solana-web3.js/) keeps the class-based API but runs on [Solana Kit](https://github.com/anza-xyz/kit) internally. The changes you are most likely to hit in app code: `Keypair.generate()`, signing, and PDA derivation are async; lamports, slots, and block heights are `bigint`; account data is `Uint8Array`; `@solana/spl-token` is replaced by `@solana-program/token`; and the wallet adapter is one package with Wallet Standard discovery instead of per-wallet adapters. See:

- [web3.js v1 → v3 migration guide](https://github.com/solana-foundation/solana-web3.js/blob/main/docs/web3js-v1-to-v3-migration.md)
- [Migration agent skill](https://github.com/solana-foundation/solana-web3.js/tree/main/skills/web3js-v1-to-v3-migration), including the [`@solana/spl-token` reference](https://github.com/solana-foundation/solana-web3.js/blob/main/skills/web3js-v1-to-v3-migration/reference/spl-token.md)
- [`@solana/wallet-adapter` v3 release notes](https://github.com/solana-foundation/solana-web3.js/blob/main/packages/wallet-adapter/RELEASE_NOTES.md)
