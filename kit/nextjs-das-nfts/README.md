# nextjs-das-nfts

A Next.js app that browses the NFTs a wallet holds, built on a hand-written [`@solana/kit`](https://www.npmjs.com/package/@solana/kit) RPC client and plugin for the [Metaplex Digital Asset Standard (DAS) API](https://developers.metaplex.com/das-api).

The viewer is the demo. The point is [`app/lib/das`](app/lib/das): what it takes to teach a kit client an API it does not ship with, and how little code that is.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/nextjs-das-nfts
```

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste any wallet address, or connect a wallet to fill in your own. The public devnet and mainnet endpoints both serve DAS, so this works with no API key.

## What's Included

- **A custom DAS RPC client** — the full 13-method Metaplex surface, typed, in [`app/lib/das`](app/lib/das)
- **A kit plugin** that installs it as `client.das`, composable with every other plugin
- **NFT viewer** — owner lookup, pagination, and cards for regular and compressed NFTs
- **Wallet connection** via [`@solana/kit-plugin-wallet`](https://www.npmjs.com/package/@solana/kit-plugin-wallet) (wallet-standard discovery, auto-reconnect)
- **Network switcher** — devnet, testnet, mainnet, localnet
- **Server-proxied metadata images** with a host allowlist, so viewing a wallet cannot leak the viewer's IP to arbitrary hosts
- **Tailwind CSS v4** with light/dark mode

Looking for wallet connection plus SOL, token, and memo transactions instead? That's the [`kit/nextjs`](../nextjs) starter.

## Writing a custom RPC and plugin

Three pieces, none of them long.

### 1. Declare the API surface

[`types/api.ts`](app/lib/das/types/api.ts) declares each method as `name(input): Result`. That type is all `createJsonRpcApi` needs to hand back a fully typed client:

```ts
export type DasGetAssetsByOwnerApi = {
  getAssetsByOwner(input: GetAssetsByOwnerInput): DasApiAssetList;
};
```

Request keys and response fields both mirror the wire format verbatim, so a call can be written straight from the spec or a provider's docs. That means responses are `snake_case` — `asset.content.json_uri`, `asset.compression.data_hash`.

### 2. Build the RPC client

[`das-rpc.ts`](app/lib/das/das-rpc.ts) pairs that API with a transport. DAS methods take a single named-parameter object rather than positional arguments, so a `requestTransformer` reshapes the call, and a `responseTransformer` turns JSON-RPC errors into thrown `Error`s:

```ts
const api = createJsonRpcApi<DasApi>({
  requestTransformer,
  responseTransformer,
});
const transport = createDefaultRpcTransport({ url });
return createRpc({ api, transport });
```

### 3. Wrap it in a plugin

[`plugin.ts`](app/lib/das/plugin.ts) is the whole plugin. A kit plugin is just a function from client to extended client, so `extendClient` hangs the RPC off a namespace and `.use()` picks it up:

```ts
export function das(config: DasRpcConfig) {
  return <T extends object>(client: T) =>
    extendClient(client, { das: createDasRpc(config) });
}
```

Because the plugin carries its own URL and transport, it composes in any order and does not need an RPC plugin to have run first — see [`app/lib/solana-client.ts`](app/lib/solana-client.ts):

```ts
createClient()
  .use(walletSigner({ chain })) // wallet as identity
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl })) // base JSON-RPC, for the balance readout
  .use(das({ url: dasUrl })); // client.das.*
```

Calls then look like every other kit call — build the request, then `.send()`:

```ts
const { items } = await client.das
  .getAssetsByOwner({ ownerAddress, limit: 12, page: 1 })
  .send();
```

The UI on top is [`app/lib/hooks/use-owned-assets.ts`](app/lib/hooks/use-owned-assets.ts) and [`app/components/nft`](app/components/nft).

This code is vendored from [`@solana/kit-plugin-das`](https://github.com/solana-foundation/kit-tools/tree/main/packages/kit-plugin-das) so you can read and edit it here. That package documents the remaining methods, pagination modes, and per-provider quirks.

## Pointing it at a DAS provider

DAS is an indexer API rather than validator state, so not every endpoint serves it:

| Endpoint                      | DAS |
| ----------------------------- | --- |
| `api.mainnet-beta.solana.com` | yes |
| `api.devnet.solana.com`       | yes |
| `api.testnet.solana.com`      | no  |
| local validator               | no  |

Set `NEXT_PUBLIC_DAS_URL` to override the endpoint — needed for testnet or localnet, and worth doing anyway since the public endpoints are rate-limited:

```shell
# .env.local
NEXT_PUBLIC_DAS_URL=https://mainnet.helius-rpc.com/?api-key=<KEY>
```

Auth goes in the URL because providers disagree about where it belongs — Helius and Shyft take an API key as a query param, QuickNode and Triton as a path segment:

| Provider          | URL                                                   |
| ----------------- | ----------------------------------------------------- |
| Helius            | `https://mainnet.helius-rpc.com/?api-key=<KEY>`       |
| Triton One / Aura | `https://<slug>.rpcpool.com/<TOKEN>`                  |
| QuickNode         | `https://<name>.solana-mainnet.quiknode.pro/<TOKEN>/` |
| Shyft             | `https://rpc.shyft.to?api_key=<KEY>`                  |

Two methods need a param rename on Helius, which `solana-client.ts` turns on automatically for Helius URLs via the plugin's `heliusCompatibility` flag. Your TypeScript keeps using the spec names either way.

## Metadata images are not trusted

Anyone can airdrop an asset, and its off-chain metadata can point its image anywhere. Loading one straight into an `<img>` would tell that host the viewer's IP address, user agent, and when they looked at a wallet — so the viewer does two things instead:

- Images render through `next/image`, which fetches them **on the server**. The viewer's browser only ever talks to your origin.
- [`app/lib/nft-image.ts`](app/lib/nft-image.ts) allowlists the storage networks and IPFS gateways NFT metadata actually uses, and `next.config.ts` feeds that same list to `images.remotePatterns`. Anything else renders a placeholder rather than being fetched.

Add the hosts your own assets use to `NFT_IMAGE_HOSTS` before deploying.

## Switching networks

A kit client is bound to one chain and RPC endpoint. The cluster dropdown rebuilds the client in a `useMemo` keyed on the cluster and hands the new instance to `ClientProvider`, which reprovisions the subtree. See [`app/lib/client-provider.tsx`](app/lib/client-provider.tsx).
