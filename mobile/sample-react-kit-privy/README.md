# sample-react-kit-privy

This is a reference sample: read it, run it, copy the parts you need. It shows a working [Privy](https://privy.io)
integration in a [React](https://react.dev) web app built on the `react-kit-shadcn` template — the web counterpart of
the `sample-expo-kit-privy` reference sample.

Wallet connection comes from `@solana/kit-plugin-wallet`, a Kit plugin that owns discovery, the connection lifecycle,
and signer creation, and publishes all of it on `client.wallet`. React reads that state through `@solana/react`, whose
hooks bridge Kit's reactive primitives into TanStack Query. Mobile Wallet Adapter registers itself into the same
wallet-standard registry that browser extension wallets use, so a wallet on a phone and a wallet in a browser take the
same code path.

Privy sits on top of that connection rather than owning it. The Privy authentication card runs the headless Sign-In
With Solana flow: Privy generates the SIWS message, the connected wallet signs it through the same wallet-standard path
every other card uses, and `loginWithSiws` exchanges the signature for a Privy session. None of Privy's own connect UI
is involved, which is what lets a wallet reached over Mobile Wallet Adapter sign in to Privy exactly like a browser
extension.

## Technologies

- [@solana/kit](https://www.solanakit.com/) with `@solana/kit-plugin-rpc` and `@solana/kit-plugin-wallet`
- [@solana/react](https://www.solanakit.com/api#solanareact) and its TanStack Query adapter
- [Mobile Wallet Adapter](https://docs.solanamobile.com/mobile-wallet-adapter/web-installation) for web
- [Privy](https://privy.io) via `@privy-io/react-auth`
- [React](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vite.dev)

## Included wallet flows

- Connect and disconnect a wallet, and switch between the accounts it exposes.
- Sign in with Privy: sign a Privy-issued Sign-In With Solana message with the connected wallet and
  exchange it for a Privy session. Logging out from the card ends only the session; disconnecting
  from the wallet menu ends both.
- Reconnect silently to the wallet used last time, without flashing a signed-out state first.
- Read the connected account balance, seeded by an RPC call and kept current by an account subscription.
- Fund an empty account, offered only while the balance is zero.
- Sign in with Sign In With Solana, directly against the wallet.
- Sign a message.
- Sign a transaction without submitting it.
- Build, sign, and submit a Memo Program transaction, then link the signature to Solana Explorer.

## Set up Privy

1. Log in or sign up at the [Privy dashboard](https://dashboard.privy.io).
2. On the [organization overview](https://dashboard.privy.io/organization-overview), click `New app`.
3. Enter your app name, select `Web app`, and click `Create app`.
4. Save the `App ID`, then click `Close`.
5. Under `User management` in the sidebar, go to `Authentication`.
6. In the `External wallets` card, enable `SVM (Solana) wallets`.
7. Go to `App settings` > `Clients`.
8. Save the `Client ID` for the default web app client. If you deploy the app, add the deployed URL
   to the client's allowed origins; local development on `localhost` needs no extra configuration.
9. Copy `.env.example` to `.env` and set:

```bash
VITE_PRIVY_APP_ID=your-privy-app-id
VITE_PRIVY_CLIENT_ID=your-privy-client-id
```

Do not put the Privy app secret in `.env`; this web app only uses public client-side Privy identifiers.

## Get started

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start the development server.

   ```bash
   npm run dev
   ```

Devnet and Testnet work with no configuration beyond the Privy variables above.

You can start developing by editing the files inside the `src` directory. Feature code lives in `src/features`, and
`src/components/ui` holds the shadcn/ui components — add more with `npx shadcn@latest add <component>`. The Privy
integration is three files: `app-providers.tsx` mounts the `PrivyProvider`, `wallet-feature-privy-sign-in.tsx` is the
sign-in card, and `wallet-ui-connect-menu.tsx` logs out of Privy when the wallet disconnects.

## Networks

Devnet, Testnet, and Localnet all work with no configuration. Localnet points at
`http://localhost:8899` unless `VITE_RPC_URL_LOCALNET` says otherwise. If nothing is listening, the
app says so and gives you the command:

```bash
npx solana-mobile@latest localnet start
```

Mainnet is the exception: it stays out of the picker until `VITE_RPC_URL_MAINNET` names an endpoint.
The public mainnet endpoint is rate limited and serves no websocket, so account subscriptions fail
against it — there is no usable default to fall back on.

Switching networks builds a new client and disconnects the current wallet. One client targets one
chain: the wallet plugin is bound to a single chain, and the wallet authorized the previous one. The
Privy session survives a network switch — it authenticates a user, not a network.

## Mobile Wallet Adapter

With no configuration, Mobile Wallet Adapter appears in the wallet list only in Chrome on Android and in a Solana Mobile
web shell, where it connects to a wallet installed on the same device. Other Android browsers and iOS do not support it, and everywhere else it is
silently absent — which is why a desktop browser with no extension wallet sees an empty wallet list.

Set `VITE_MWA_REMOTE_HOST_AUTHORITY` to a reflector host to additionally offer the QR code flow, which pairs a desktop
browser with a wallet on a phone. The Privy sign-in works over either transport, because it only ever asks the
connected wallet for a message signature.

Localnet is deliberately left out of the chains Mobile Wallet Adapter advertises. Mobile wallets carry no localnet
configuration, and the ones that resolve `solana:localnet` at all tend to map it to mainnet. Signing against a local
validator needs a localnet-capable wallet.

## Wallet approvals

Every wallet interaction is started by a deliberate action in the UI, and the wallet prompts for each one. The app
never signs, submits, or moves funds on its own, holds no keys, and stores nothing beyond the selected network, the
key of the wallet account to reconnect to, and the Privy session token Privy's SDK manages. Disconnecting from the
wallet menu clears the stored key and logs out of Privy, and the wallet's own settings are where an app's
authorization is revoked for good.

## Learn more

- [Privy documentation](https://docs.privy.io/): Learn how to authenticate users with Privy.
- [Solana documentation](https://solana.com/docs): Learn how to build on Solana.
- [Solana Kit documentation](https://www.solanakit.com/): Learn how to use the JavaScript SDK for Solana.
- [Solana Mobile documentation](https://docs.solanamobile.com/): Learn how to reach wallets on Android.
- [shadcn/ui documentation](https://ui.shadcn.com/docs): Learn how to add and customize components.
- [Vite documentation](https://vite.dev/guide/): Learn how to configure the build.
