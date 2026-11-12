# ZK Compression Airdrop

Distribute compressed SPL tokens with Light Protocol, Next.js, Kit 8 and Wallet Standard wallets. Both mint setup and browser distribution build V1 transactions. Light's web3.js instruction builders are adapted to Kit; their keypair-signing transaction helpers are not used.

## Requirements

- Node 22+ and npm, pnpm or yarn.
- A devnet RPC with ZK Compression/Photon support, such as Helius.
- A funded devnet setup keypair, used only by the command-line setup script.
- A browser wallet that advertises V1 transaction support.

## Setup

```sh
npm install
```

Create an ignored `.env.local` file:

```dotenv
RPC_ENDPOINT=https://devnet.helius-rpc.com?api-key=YOUR_BROWSER_RESTRICTED_RPC_KEY
DEV_WALLET=/absolute/path/to/devnet-only-keypair.json
MINT_AUTHORITY=YOUR_BROWSER_WALLET_PUBLIC_ADDRESS
```

`DEV_WALLET` is a server/CLI-only keypair file path or Base58 secret. Never paste a real secret into frontend code, share it, or commit it. `MINT_AUTHORITY` is public: this browser wallet will approve each distribution batch, while the separate setup wallet pays to create the mint. If omitted, the setup wallet also becomes the mint authority.

The generated setup's `network` RPC URL is sent to the browser for Light queries. Use a browser-restricted RPC key; never put a privileged server credential in that URL. `.env.local` and generated setup/wallet files are Git-ignored. The setup script verifies devnet before creating a mint.

```sh
npm run airdrop:setup
npm run dev
```

Open http://localhost:3000, connect the configured authority wallet on devnet and approve the batch prompts yourself. Setup consumes devnet SOL and creates on-chain accounts; do not run it against a valuable wallet. The CLI and browser need RPC access to Light's deployed programs and indexer.

## Distribution

- Batch sizes range from 1 to 5 recipients. Each batch requires wallet approval; no private signing key is embedded in the browser.
- Before signing, the app checks V1 support, the connected authority, the RPC genesis hash, the on-chain mint authority/decimals and the recipient totals.
- Token base units remain exact integer strings/bigints, including u64 values above JavaScript's safe integer limit.
- Wallet changes, disconnection and errors stop subsequent batches. An already-open wallet prompt cannot be revoked by the app: cancel it yourself. Submitted batches are not retried automatically. Confirmed signatures appear in the progress panel.
- After any submission, repeat execution is disabled for that network and mint, including after switching networks and back. Progress and signatures are preserved while the app stays open. This is not an idempotent claim program: reloading and starting again can mint duplicates. Reconcile prior transactions and create a recipient list containing only outstanding recipients before restarting. An RPC timeout does not prove a transaction failed.

Generated files live under `scripts/`: `compressed-mint-config.json`, `airdrop-recipients.json` and the combined `airdrop-setup.json`. Customize public token metadata in the mint script and recipient amounts in `generate-recipients.ts`, then regenerate the setup. Keep secrets out of these public configuration files.

## Validation

```sh
npm test
npm run ci
```

Automated wallet tests exercise account switching, disconnection/restoration, duplicate wallet names and StrictMode. Instruction tests build a real Light mint instruction and sign/decode a V1 transaction offline. These are not proof of execution by Light's on-chain programs: complete a devnet distribution and verify both transaction version and compressed recipient balances before release.

Compressed token balances require a Photon indexer. The transactions themselves are visible on standard Solana explorers; compression does not hide transaction signatures.

## Resources

- https://www.zkcompression.com/
- https://github.com/Lightprotocol/light-protocol
- https://lightprotocol.github.io/light-protocol/compressed-token/
