# web3js-react-vite

React + Vite starter built on [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) v3 and [`@solana/wallet-adapter`](https://www.npmjs.com/package/@solana/wallet-adapter) v3. Connect a browser wallet, switch networks, and send real transactions — SOL transfers, message signing, and SPL token actions with [`@solana-program/token`](https://www.npmjs.com/package/@solana-program/token) — using the familiar `Connection` / `Transaction` / `PublicKey` API.

## Getting Started

Requires Node.js 24 or newer.

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/web3js/web3js-react-vite
```

```shell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), connect a wallet, and (on devnet) click **Airdrop 1 SOL** to fund it. Then try the actions. Need devnet SOL another way? [faucet.solana.com](https://faucet.solana.com/).

To use localnet, start a local validator in another terminal before selecting **localnet**. Only wallets that advertise the `solana:localnet` chain are listed there.

```shell
solana-test-validator
```

The public mainnet RPC rejects most browser requests. To use mainnet, copy `.env.example` to `.env` and set `VITE_MAINNET_RPC_URL` to a private RPC endpoint.

## What's Included

- **Wallet connection** with `@solana/wallet-adapter` v3 — `WalletMultiButton` and the wallet modal, themed to match the app. Wallets are discovered through Wallet Standard; there are no per-wallet adapters to install.
- **Network switcher** — devnet, testnet, mainnet, localnet
- **Live SOL balance** via `connection.getBalance` and `connection.onAccountChange`, plus **airdrop** on non-mainnet clusters
- **Transfer SOL** with `SystemProgram.transfer`, a legacy `Transaction`, and the wallet adapter's `sendTransaction`
- **Sign message** with `signMessage`, verified with `publicKey.verifySignature`
- **SPL token actions** — create a mint, mint more, and transfer to any address with `@solana-program/token` (associated token accounts created idempotently)
- **Toast notifications** with explorer links
- **Tailwind CSS v4** with light/dark mode
- **Vitest** unit tests for the amount, explorer, and error helpers

## How it works

### Providers

[`src/components/providers.tsx`](src/components/providers.tsx) wraps the app in the wallet adapter providers. The selected cluster drives both the RPC endpoint and the wallet chain:

```tsx
<ConnectionProvider
  endpoint={getClusterEndpoint(cluster)}
  config={CONNECTION_CONFIG}
>
  <WalletProvider chain={getWalletChain(cluster)} onError={onWalletError}>
    <WalletModalProvider>{children}</WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
```

Changing `chain` rebuilds the wallet client, so every prop passed to the providers is a string or a module-level constant to keep them referentially stable. Components read the `Connection` with `useConnection()` and the wallet with `useWallet()` (`publicKey`, `signer`, `sendTransaction`, `signMessage`).

### Sending transactions

[`src/lib/hooks/use-send-transaction.tsx`](src/lib/hooks/use-send-transaction.tsx) fetches a blockhash, calls `sendTransaction(transaction, connection, { minContextSlot, signers })`, confirms the signature, and shows a toast. Extra local signers — like a freshly generated mint keypair — go in `signers` and sign before the wallet does.

### SPL tokens through `@solana-program/token`

v3 `Transaction.add(...)` accepts Kit instructions and instruction plans, so `@solana-program/token` builders drop straight into a web3.js transaction — no `@solana/spl-token` needed. Creating a mint in [`src/components/actions/token-card.tsx`](src/components/actions/token-card.tsx):

```ts
const newMint = await Keypair.generate();
const transaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: owner,
    newAccountPubkey: newMint.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(getMintSize()),
    space: getMintSize(),
    programId: new PublicKey(TOKEN_PROGRAM_ADDRESS),
  }),
  getInitializeMint2Instruction({
    mint: newMint.publicKey,
    decimals: 9,
    mintAuthority: owner.toBase58(),
    freezeAuthority: null,
  }),
  await getMintToATAInstructionPlanAsync({
    payer: signer, // useWallet().signer — a Kit TransactionSigner
    owner: owner.toBase58(),
    mint: newMint.publicKey.toBase58(),
    mintAuthority: signer,
    amount,
    decimals: 9,
  })
);
await sendTransaction(transaction, connection, { signers: [newMint] });
```

Transfers use `getTransferToATAInstructionPlanAsync`, which derives both associated token accounts and creates the recipient's idempotently. Balances are read with `connection.getAccountInfo(...)` and decoded with `getMintDecoder()` / `getTokenDecoder()` in [`src/lib/hooks/use-token-account.ts`](src/lib/hooks/use-token-account.ts).

Builder account inputs take a v3 `PublicKey` directly. Where a bare Kit `Address` is required (authorities, owners, plan inputs), pass `publicKey.toBase58()` — it is already typed as `Address`.

## Coming from web3.js v1

web3.js v3 keeps the class-based API but rebuilds it on [Solana Kit](https://github.com/anza-xyz/kit): key generation and signing are async, RPC numbers are `bigint`, account data is `Uint8Array`, and no `Buffer` polyfill is needed in the browser. `@solana/wallet-adapter` v3 replaces the `-react`, `-react-ui`, `-base`, and `-wallets` packages with a single package.

- [web3.js v1 → v3 migration guide](https://github.com/solana-foundation/solana-web3.js/blob/main/docs/web3js-v1-to-v3-migration.md)
- [`@solana/spl-token` → `@solana-program/token` guide](https://github.com/solana-foundation/solana-web3.js/blob/main/docs/web3js-spl-token-migration.md)
- [Wallet adapter v3 release notes](https://github.com/solana-foundation/solana-web3.js/blob/main/packages/wallet-adapter/RELEASE_NOTES.md)
- [Migration agent skill](https://github.com/solana-foundation/solana-web3.js/tree/main/skills/web3js-v1-to-v3-migration) — `npx skills add https://github.com/solana-foundation/solana-web3.js/tree/main/skills/web3js-v1-to-v3-migration`

## Scripts

| Script              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                       |
| `npm run build`     | Typecheck and build for production into `dist/` |
| `npm run preview`   | Serve the production build locally              |
| `npm run lint`      | Lint with ESLint                                |
| `npm run typecheck` | Typecheck with TypeScript                       |
| `npm run format`    | Format with Prettier                            |
| `npm run test`      | Run the Vitest unit tests                       |
| `npm run ci`        | Build, lint, check formatting, and run tests    |

## Wallet permissions

The app never holds keys and never signs on its own. Every transaction and message is signed in your wallet after you approve the prompt; the only local signer is the throwaway mint keypair generated when you create a token. Disconnect from the wallet menu or revoke the site in your wallet's connected-apps settings.
