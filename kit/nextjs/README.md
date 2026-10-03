# nextjs

Next.js starter built on `@solana/kit` v8, Kit plugins, and [`@solana/react`](https://www.npmjs.com/package/@solana/react). Connect a browser wallet, switch networks, and send real transactions — SOL transfers, SPL token actions, and memos.

## Getting Started

Requires Node.js 24 or newer.

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs
```

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect a wallet, and (on devnet) click **Airdrop 1 SOL** to fund it. Then try the actions. Need devnet SOL another way? [faucet.solana.com](https://faucet.solana.com/).

To use localnet, start a local validator in another terminal before selecting
**localnet**:

```shell
solana-test-validator
```

## What's Included

- **Wallet connection** via the Kit wallet plugin (wallet-standard discovery, auto-reconnect)
- **Network switcher** — devnet, testnet, mainnet, localnet
- **Transfer SOL** with the [`@solana-program/system`](https://www.npmjs.com/package/@solana-program/system) kit plugin
- **Token actions** — create a mint, mint tokens, and transfer them with the [`@solana-program/token`](https://www.npmjs.com/package/@solana-program/token) kit plugin (associated token accounts created for you)
- **Add memo** with the [`@solana-program/memo`](https://www.npmjs.com/package/@solana-program/memo) kit plugin
- **Live balance** and **toast notifications** with explorer links
- **Tailwind CSS v4** with light/dark mode

## How it works

The app builds a Kit client in [`app/lib/solana-client.ts`](app/lib/solana-client.ts). The Kit wallet plugin supplies the connected wallet's transaction signer:

```ts
createClient()
  .use(walletSigner({ chain }))
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl, transactionConfig }))
  .use(rpcAirdrop()) // client.airdrop (non-mainnet)
  .use(systemProgram()) // client.system.instructions.transferSol
  .use(tokenProgram()) // client.token.instructions.{createMint,mintToATA,transferToATA}
  .use(memoProgram()); // client.memo.instructions.addMemo
```

Components use `useAppClient()` and the Kit wallet hooks from the local provider. Sending uses `client.sendTransaction([instruction])` or the program plugin's instruction-plan helpers.

The Kit 8 RPC planner is configured to emit Version 1 transactions. This
requires `@solana/kit-plugin-rpc` 0.19 or newer and a wallet that advertises
Version 1 signing support. Version 1 transactions use a total priority fee in
lamports and keep resource-limit estimation enabled through the RPC planner.

### Switching networks

A kit client is bound to one chain and RPC endpoint. The cluster dropdown rebuilds the client for that cluster. See [`app/lib/client-provider.tsx`](app/lib/client-provider.tsx).

## Testing

```shell
npm run test
```

The tests in [`tests/`](tests/) drive the real UI — click **Connect Wallet**, pick a wallet, fill in the transfer form, press **Send SOL** — and assert on-chain state before and after each click. Three pieces make that work without a browser or a wallet extension:

- **Agave 4.2.2's `solana-test-validator`** runs the tests against a V1-enabled local validator. The test adapter starts an isolated validator and exposes only the small funding/account helpers the tests need.
- **A mock wallet-standard wallet** ([`tests/mock-wallet.ts`](tests/mock-wallet.ts)) registers itself like any browser extension would, so the app's real wallet discovery, connect flow, and transaction signing run unmodified — signatures come from an in-memory keypair.
- **[Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** render the actual app components in jsdom and interact with them by role and label, the same way a user would.

The tests point `AppClientProvider` at the local validator via its optional URL override. The validator adapter requires Agave 4.2.2 and a supported macOS or Linux environment.

If `SOLANA_TEST_LEDGER_DIR` is set, it is passed to the validator with
`--reset`. Use only a disposable, test-owned directory for this variable; do
not point it at a shared validator ledger or a localnet ledger containing data
you need to keep.

Agave 4.2.2 includes the Memo programs by default, so the tests do not need a
bundled program binary or a separate Memo deployment.
