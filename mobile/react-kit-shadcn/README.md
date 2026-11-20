# react-kit-shadcn

This is a [React](https://react.dev) web app template built with [Vite](https://vite.dev) and
[shadcn/ui](https://ui.shadcn.com). It connects to a wallet, reads account state, and signs and submits transactions
using [Solana Kit](https://www.solanakit.com/) on its own — there is no wallet adapter library in the dependency list.

Wallet connection comes from `@solana/kit-plugin-wallet`, a Kit plugin that owns discovery, the connection lifecycle,
and signer creation, and publishes all of it on `client.wallet`. React reads that state through `@solana/react`, whose
hooks bridge Kit's reactive primitives into TanStack Query. Mobile Wallet Adapter registers itself into the same
wallet-standard registry that browser extension wallets use, so a wallet on a phone and a wallet in a browser take the
same code path.

## Technologies

- [@solana/kit](https://www.solanakit.com/) with `@solana/kit-plugin-rpc` and `@solana/kit-plugin-wallet`
- [@solana/react](https://www.solanakit.com/api#solanareact) and its TanStack Query adapter
- [Mobile Wallet Adapter](https://docs.solanamobile.com/mobile-wallet-adapter/web-installation) for web
- [React](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vite.dev)

## Included wallet flows

- Connect and disconnect a wallet, and switch between the accounts it exposes.
- Switch to a different wallet without disconnecting first. A declined prompt leaves the current
  session untouched, and the reason is shown in the wallet menu.
- Networks the connected wallet does not support are disabled in the picker, and wallets that do
  not support the active network are listed but disabled. Neither is hidden: picking a network the
  wallet cannot reach would silently disconnect it, and a wallet that simply vanishes on a network
  switch reads as a bug rather than as an answer.
- Reconnect silently to the wallet used last time, without flashing a signed-out state first.
- Read the connected account balance, seeded by an RPC call and kept current by an account subscription.
- Fund an empty account, offered only while the balance is zero. The RPC airdrop is offered
  alongside a link to the web faucet, because the RPC one is rate limited and returns 429 far more
  often than it succeeds.
- Sign in with Sign In With Solana.
- Sign a message.
- Sign a transaction without submitting it — the path to copy when a relayer, a fee sponsor, or a
  multi-signature flow owns submission.
- Build, sign, and submit a Memo Program transaction, then link the signature to Solana Explorer.

## Get started

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start the development server.

   ```bash
   npm run dev
   ```

Devnet and Testnet work with no configuration. To change anything else, copy `.env.example` to `.env`.

You can start developing by editing the files inside the `src` directory. Feature code lives in `src/features`, and
`src/components/ui` holds the shadcn/ui components — add more with `npx shadcn@latest add <component>`.

Cards whose feature the connected wallet does not advertise say so and name the feature, rather
than disappearing. Between them the cards exercise every Solana wallet-standard feature except
`solana:signAndSendAllTransactions` and `solana:signOffchainMessage`, which few wallets implement.

## Theme

The theme follows the operating system by default, and the switcher in the header overrides it with
Light or Dark. `System` stays a choice of its own so the default is reachable again after picking a
side. The preference is applied before the first paint, so a stored theme that disagrees with the
operating system never flashes.

`public/favicon.svg` is the only logo asset: the browser tab uses the `prefers-color-scheme` switch
inside that file, and the header masks the same file and paints it in `currentColor` so it tracks an
explicit override too. Replace that one file to rebrand both.

## Networks

Devnet, Testnet, and Localnet all work with no configuration. Localnet points at
`http://localhost:8899` unless `VITE_RPC_URL_LOCALNET` says otherwise, so developing against a local
validator is one click rather than a setup step. If nothing is listening, the app says so and gives
you the command:

```bash
npx solana-mobile@latest localnet start
```

Mainnet is the exception: it stays out of the picker until `VITE_RPC_URL_MAINNET` names an endpoint.
The public mainnet endpoint is rate limited and serves no websocket, so account subscriptions fail
against it — there is no usable default to fall back on.

On every network the app reads `getGenesisHash` once and compares it to the network you picked. That
catches an RPC URL pasted into the wrong variable, which otherwise shows up much later as balances
that look wrong rather than as an error. Any hash that is not Mainnet, Devnet, or Testnet is treated
as a local validator.

Switching networks builds a new client and disconnects the current wallet. One client targets one
chain: the wallet plugin is bound to a single chain, and the wallet authorized the previous one.

## Mobile Wallet Adapter

With no configuration, Mobile Wallet Adapter appears in the wallet list only in Chrome on Android and in a Solana Mobile
web shell, where it connects to a wallet installed on the same device. Other Android browsers and iOS do not support it, and everywhere else it is
silently absent — which is why a desktop browser with no extension wallet sees an empty wallet list.

Set `VITE_MWA_REMOTE_HOST_AUTHORITY` to a reflector host to additionally offer the QR code flow, which pairs a desktop
browser with a wallet on a phone.

Localnet is deliberately left out of the chains Mobile Wallet Adapter advertises. Mobile wallets carry no localnet
configuration, and the ones that resolve `solana:localnet` at all tend to map it to mainnet — which surfaces as a
confusing network mismatch at signing time rather than an honest refusal. Signing against a local validator needs a
localnet-capable wallet.

## Wallet approvals

Every wallet interaction is started by a deliberate action in the UI, and the wallet prompts for each one. The app
never signs, submits, or moves funds on its own, holds no keys, and stores nothing beyond the selected network and the
key of the wallet account to reconnect to. Disconnecting from the wallet menu clears that key, and the wallet's own
settings are where an app's authorization is revoked for good.

## Learn more

- [Solana documentation](https://solana.com/docs): Learn how to build on Solana.
- [Solana Kit documentation](https://www.solanakit.com/): Learn how to use the JavaScript SDK for Solana.
- [Solana Mobile documentation](https://docs.solanamobile.com/): Learn how to reach wallets on Android.
- [shadcn/ui documentation](https://ui.shadcn.com/docs): Learn how to add and customize components.
- [Vite documentation](https://vite.dev/guide/): Learn how to configure the build.
