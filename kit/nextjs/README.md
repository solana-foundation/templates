# nextjs

Next.js starter built on `@solana/kit` v7 with the kit plugin client and [`@solana/react`](https://www.npmjs.com/package/@solana/react). Connect a browser wallet, switch networks, and send real transactions — SOL transfers, SPL token actions, and memos — with zero manual `pipe()` boilerplate.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs
```

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect a wallet, and (on devnet) click **Airdrop 1 SOL** to fund it. Then try the actions. Need devnet SOL another way? [faucet.solana.com](https://faucet.solana.com/).

## What's Included

- **Wallet connection** via [`@solana/kit-plugin-wallet`](https://www.npmjs.com/package/@solana/kit-plugin-wallet) (wallet-standard discovery, auto-reconnect)
- **Network switcher** — devnet, testnet, mainnet, localnet
- **Transfer SOL** with the (`@solana-program/system`)[https://www.npmjs.com/package/@solana-program/system] kit plugin
- **Token actions** — create a mint, mint tokens, and transfer them with the [`@solana-program/token`](https://www.npmjs.com/package/@solana-program/token) kit plugin (associated token accounts created for you)
- **Add memo** with the [`@solana-program/memo`](https://www.npmjs.com/package/@solana-program/memo) kit plugin
- **Live balance** and **toast notifications** with explorer links
- **Tailwind CSS v4** with light/dark mode

## How it works

The app builds one kit client per selected cluster in [`app/lib/solana-client.ts`](app/lib/solana-client.ts) and provides it through `@solana/react`'s `ClientProvider`:

```ts
createClient()
  .use(walletSigner({ chain })) // wallet as payer + identity; must precede rpc
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl })) // rpc, subscriptions, getMinimumBalance, sendTransaction
  .use(rpcAirdrop()) // client.airdrop (non-mainnet)
  .use(systemProgram()) // client.system.instructions.transferSol
  .use(tokenProgram()) // client.token.instructions.{createMint,mintToATA,transferToATA}
  .use(memoProgram()); // client.memo.instructions.addMemo
```

Components read the client with `useClient()` and the connected wallet with the `@solana/kit-plugin-wallet/react` hooks (`useWallets`, `useConnect`, `useConnectedWallet`, `useDisconnect`). Sending is a single call — `client.sendTransaction([instruction])` for raw instructions, or `client.token.instructions.createMint({...}).sendTransaction()` for the token plugin's built-in instruction plans.

### Switching networks

A kit client is bound to one chain and RPC endpoint. The cluster dropdown rebuilds the client in a `useMemo` keyed on the cluster and hands the new instance to `ClientProvider`, which reprovisions the subtree. See [`app/lib/client-provider.tsx`](app/lib/client-provider.tsx).
