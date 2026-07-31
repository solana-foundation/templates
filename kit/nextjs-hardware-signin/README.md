# nextjs-hardware-signin

Sign In With a Hardware Wallet — wallet authentication for hardware wallets that **cannot sign arbitrary off-chain messages**. Built on `@solana/kit` v7 with the kit plugin client and [`@solana/react`](https://www.npmjs.com/package/@solana/react).

Instead of `signMessage` (unsupported by many hardware wallets), the wallet signs a **memo transaction** carrying a server-issued nonce. The server verifies the Ed25519 signature off-chain — the transaction is **never broadcast**.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs-hardware-signin
```

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect a wallet, and click **Sign in**. Approve the signature in your wallet — nothing hits the chain.

## Why a memo transaction?

Many hardware wallets do not support signing arbitrary messages, so the usual Sign-In-With-Solana `signMessage` flow does not work for those users. The workaround, [first suggested here](https://github.com/solana-labs/solana/issues/21366#issuecomment-1194310677), is to have the wallet sign a transaction whose only instruction is a memo containing a nonce, then verify that signature server-side without ever sending the transaction.

## Flow

1. **Nonce** — the client requests a single-use nonce from `GET /api/nonce`.
2. **Sign** — the client builds a memo transaction with the nonce and signs it, without sending:

   ```ts
   const message = await client.memo.instructions
     .addMemo({ memo: nonce, signers: [signer] })
     .planTransaction(); // builds an unsigned message — does NOT send
   const signedTx = await signTransactionMessageWithSigners(message);
   ```

3. **Verify** — the client posts `{ address, messageBytesBase64, signatureBase64, nonce }` to `POST /api/session`. The server ([`app/lib/auth.ts`](app/lib/auth.ts)) checks that:
   - the Ed25519 signature is valid over the exact signed bytes (`getPublicKeyFromAddress` + `verifySignature`),
   - those bytes decode to a memo instruction whose text equals the nonce, and
   - the transaction fee payer is the claimed signer.

   On success it consumes the nonce (single use) and sets an `httpOnly` session cookie.

## What's Included

- **Wallet connection** via [`@solana/kit-plugin-wallet`](https://www.npmjs.com/package/@solana/kit-plugin-wallet) (wallet-standard discovery, auto-reconnect)
- **Sign-in flow** with off-chain signature verification — no transaction sent
- **Route handlers** for nonce issuance and session management ([`app/api`](app/api))
- **Server-gated dashboard** ([`app/protected`](app/protected)) — a restricted page that redirects unauthenticated visitors home
- **Network switcher** — devnet, testnet, mainnet, localnet
- **Offline tests** with `vitest` — the sign-and-verify flow needs no RPC or validator
- **Tailwind CSS v4** with light/dark mode

## The kit client

The app builds one kit client per selected cluster in [`app/lib/solana-client.ts`](app/lib/solana-client.ts):

```ts
createClient()
  .use(walletSigner({ chain })) // wallet as signer + identity; must precede rpc
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl })) // rpc + transaction planner
  .use(memoProgram()); // client.memo.instructions.addMemo
```

## Protected route

`/protected` ([`app/protected/page.tsx`](app/protected/page.tsx)) is a server component that reads the session cookie and calls `readSessionToken` — a forged or missing cookie is redirected home before anything renders. The authorization check runs in the Node runtime (HMAC verification), so gating lives in the server component rather than edge middleware. Signing in redirects here.

## Testing

Because the transaction is never broadcast, the entire sign-and-verify flow runs **offline** — no RPC, validator, or funded account. The test builds a memo transaction message by hand, signs it with a generated keypair, and asserts the server verifier (`verifyAuthProof`) accepts a valid proof and rejects a wrong nonce or tampered signature:

```shell
npm run test
```

See [`test/hardware-signin.test.ts`](test/hardware-signin.test.ts).

## Production notes

This template favors clarity over completeness. For real deployments:

- The nonce store ([`app/lib/nonce-store.ts`](app/lib/nonce-store.ts)) is in-memory and per-process — back it with Redis or a database across instances.
- The session cookie is HMAC-signed ([`app/lib/auth.ts`](app/lib/auth.ts)) so its address cannot be forged. Set `SESSION_SECRET` in the environment; it is required in production, where signing or verifying a token without it throws. The insecure fallback applies only outside production. For richer sessions (expiry, claims) reach for a signed JWT.
