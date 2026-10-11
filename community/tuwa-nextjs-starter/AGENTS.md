# AGENTS.md: tuwa-nextjs-starter

This app is a Next.js App Router app on the TUWA SDK for Solana, with SIWX sign-in and tracked program calls. It comes from the `tuwa-nextjs-starter` template of `create-solana-dapp`, maintained as the `nextjs-solana` template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); `README.md` describes its features, environment variables and files.

Before changing TUWA code, read the TUWA integration guide for agents: https://raw.githubusercontent.com/TuwaIO/workflows/main/TUWA_AGENTS.md. It lists the packages and their import paths, working code for every part of this app, and the full list of rules.

## Commands

`pnpm dev`, `pnpm build`, `pnpm lint:fix`, `pnpm generate:solana` (after changing the Anchor IDL in `src/targets`).

## Rules

- Create the wagmi config, the Satellite adapters and the Pulsar store once, at module level, never inside components.
- Send blockchain writes through `executeTxAction` of the Pulsar store and read their status from the store.
- Pass `siwx` only to `NovaConnectProvider`, with `getNonce`: the `/api/siwx` routes accept only nonces they issued.
- Server code reads the SIWX session from the cookie with `getSiwxServerSession`; never accept a session object from the browser.
- Do not add EVM packages: the app has no EVM network.
- Never edit `src/programs/solanatest/generated`: regenerate it with `pnpm generate:solana`.
- Keep strict TypeScript without `any`; run `pnpm lint:fix` after changes.
