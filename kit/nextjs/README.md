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
- **NFT viewer** at `/nfts`, built on a hand-written [DAS API](https://developers.metaplex.com/das-api) RPC client and kit plugin in [`app/lib/das`](app/lib/das) — a worked example of extending the client with your own RPC
- **Live balance** and **toast notifications** with explorer links
- **Tailwind CSS v4** with light/dark mode

## How it works

The app builds one kit client per selected cluster in [`app/lib/solana-client.ts`](app/lib/solana-client.ts) and provides it through `@solana/react`'s `ClientProvider`:

```ts
createClient()
  .use(walletSigner({ chain })) // wallet as payer + identity; must precede rpc
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl })) // rpc, subscriptions, getMinimumBalance, sendTransaction
  .use(rpcAirdrop()) // client.airdrop (non-mainnet)
  .use(das({ url: dasUrl })) // client.das.* — the local DAS plugin
  .use(systemProgram()) // client.system.instructions.transferSol
  .use(tokenProgram()) // client.token.instructions.{createMint,mintToATA,transferToATA}
  .use(memoProgram()); // client.memo.instructions.addMemo
```

Components read the client with `useClient()` and the connected wallet with the `@solana/kit-plugin-wallet/react` hooks (`useWallets`, `useConnect`, `useConnectedWallet`, `useDisconnect`). Sending is a single call — `client.sendTransaction([instruction])` for raw instructions, or `client.token.instructions.createMint({...}).sendTransaction()` for the token plugin's built-in instruction plans.

### Writing a custom RPC and plugin

[`app/lib/das`](app/lib/das) is the whole story of adding an RPC the base client does not
know about — in this case the Metaplex Digital Asset Standard API, the indexed read API
for NFTs and compressed NFTs. Three pieces, none of them long:

1. **The API surface** — [`types/api.ts`](app/lib/das/types/api.ts) declares each method as
   `name(input): Result`. That type is all `createJsonRpcApi` needs to give you a fully
   typed `Rpc`.
2. **The RPC client** — [`das-rpc.ts`](app/lib/das/das-rpc.ts) pairs that API with a
   transport. DAS methods take one named-parameter object instead of positional arguments,
   so a `requestTransformer` reshapes the call, and a `responseTransformer` turns JSON-RPC
   errors into thrown `Error`s.

   ```ts
   const api = createJsonRpcApi<DasApi>({
     requestTransformer,
     responseTransformer,
   });
   const transport = createDefaultRpcTransport({ url });
   return createRpc({ api, transport });
   ```

3. **The plugin** — [`plugin.ts`](app/lib/das/plugin.ts) is a one-liner. A kit plugin is
   just a function from client to extended client, so `extendClient` hangs the RPC off a
   namespace and `.use()` picks it up:

   ```ts
   export function das(config: DasRpcConfig) {
     return <T extends object>(client: T) =>
       extendClient(client, { das: createDasRpc(config) });
   }
   ```

Because the plugin carries its own URL and transport, it composes in any order and does not
need the RPC plugin to have run first. Calls then look like every other kit call:

```ts
const { items } = await client.das
  .getAssetsByOwner({ ownerAddress, limit: 12, page: 1 })
  .send();
```

See [`app/lib/hooks/use-owned-assets.ts`](app/lib/hooks/use-owned-assets.ts) and
[`app/components/nft`](app/components/nft) for the UI on top, rendered at
[`app/nfts/page.tsx`](app/nfts/page.tsx). This code is vendored from
[`@solana/kit-plugin-das`](https://github.com/solana-foundation/kit-tools/tree/main/packages/kit-plugin-das),
which also ships the remaining DAS methods and provider quirks.

#### Pointing it at a DAS provider

DAS is served by indexers, not by every validator, so it gets its own endpoint. The public
endpoints only index mainnet, so set `NEXT_PUBLIC_DAS_URL` to use it anywhere else:

```shell
# .env.local
NEXT_PUBLIC_DAS_URL=https://devnet.helius-rpc.com/?api-key=<KEY>
```

Auth goes in the URL because providers disagree about where it belongs — Helius and Shyft
take an API key as a query param, QuickNode and Triton as a path segment. Helius also
renames two params, which `app/lib/solana-client.ts` handles by turning on
`heliusCompatibility` for Helius URLs. Without an override the app falls back to the
selected cluster's RPC URL, and the viewer tells you when that endpoint has no DAS behind
it.

#### Metadata images are not trusted

Anyone can airdrop an asset, and its off-chain metadata can point its image anywhere. Loading
one straight into an `<img>` would tell that host the viewer's IP address, user agent, and
when they looked at a wallet — so the viewer does two things instead:

- Images render through `next/image`, which fetches them **on the server**. The viewer's
  browser only ever talks to your origin.
- [`app/lib/nft-image.ts`](app/lib/nft-image.ts) allowlists the storage networks and IPFS
  gateways NFT metadata actually uses, and `next.config.ts` feeds that same list to
  `images.remotePatterns`. Anything else renders a placeholder rather than being fetched.

Add the hosts your own assets use to `NFT_IMAGE_HOSTS` before deploying.

### Switching networks

A kit client is bound to one chain and RPC endpoint. The cluster dropdown rebuilds the client in a `useMemo` keyed on the cluster and hands the new instance to `ClientProvider`, which reprovisions the subtree. See [`app/lib/client-provider.tsx`](app/lib/client-provider.tsx).
