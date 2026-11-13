# vite

React + Vite starter with Tailwind CSS and `@solana/react-hooks` for wallet connection and Solana hooks.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/kit/react-vite
```

```shell
npm install
npm run dev
```

## Wallet actions

The starter uses **devnet** (configured in `src/providers.tsx`). Connect a Wallet
Standard wallet to see its live SOL balance, request a 1 SOL airdrop, and send SOL
to a recipient. Airdrops can be rate-limited; use https://faucet.solana.com/ if needed.

Transfers validate the address and amount before requesting wallet approval.
Amounts support up to 9 decimal places. The wallet holds your keys and must approve
each transfer; nothing is sent automatically. Submitted actions link to the devnet
explorer. Disconnect to revoke the app's wallet session.
