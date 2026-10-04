# React + Vite

React + Vite starter with Tailwind CSS, Solana Kit 8, Kit wallet/RPC plugins,
and `@solana/react` for wallet discovery, connection, and account updates.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/react-vite
```

```shell
npm install
npm run dev
```

Use Node.js 24 or newer. The client connects to devnet by default.
For pnpm, `pnpm-workspace.yaml` permits only esbuild's required build script.

## Client Configuration

`src/solana-client.ts` creates the shared client. `src/providers.tsx` exposes it
through `ClientProvider`, and components access it with `useClient<AppClient>()`.
Change the RPC and WebSocket URLs together when selecting another cluster, and
keep the wallet plugin's chain aligned with that cluster.

The RPC plugin is configured with `transactionConfig: { version: 1 }`. This
starter demonstrates wallet connection only; it does not submit transactions.
When adding transaction actions, require a signer and check
`connectedWallet.supportedTransactionVersions.has(1)` before enabling signing.
Keep resource estimation enabled, and have the user review each wallet prompt.
Connecting a wallet does not imply that it supports signing V1 transactions.

## Validation

```shell
npm run ci
```

This runs the TypeScript/Vite build, lint, formatting checks, and wallet tests.
The tests exercise Wallet Standard account changes, rejected connections, and
V1 transaction planning without signing, sending, or contacting a public RPC.
Manually check
connection, account switching, disconnect, reload restoration, and rejected
connection prompts with a Wallet Standard browser wallet. No SOL is needed to
test the connection-only screen.
