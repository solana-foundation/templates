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

Use an up-to-date Node.js 22 or 24 release. The client connects to devnet by default.

## Client Configuration

`src/solana-client.ts` creates the shared client. `src/providers.tsx` exposes it
through `ClientProvider`, and components access it with `useClient<AppClient>()`.
Change the RPC and WebSocket URLs together when selecting another cluster, and
keep the wallet plugin's chain aligned with that cluster.

## Validation

```shell
npm run ci
```

This runs the TypeScript/Vite build, lint, formatting checks, and wallet tests.
The six tests cover wallet account changes, duplicate wallet names, restoration,
error recovery, and client configuration without signing, sending, or contacting
a public RPC.

Manually check connection, account switching, disconnect, reload restoration, and rejected
connection prompts with a Wallet Standard browser wallet. No SOL is needed to
test the connection-only screen.
