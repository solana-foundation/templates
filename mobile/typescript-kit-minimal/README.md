# typescript-kit-minimal

This is a Solana web app template written in plain TypeScript against the DOM, built with
[Vite](https://vite.dev). There is no framework: no React, no components, no reactivity library. It
connects to a wallet, reads a balance, signs a message, and submits a transaction using
[Solana Kit](https://www.solanakit.com/) and [wallet-standard](https://github.com/wallet-standard/wallet-standard)
directly.

That is the point of it. Kit and wallet-standard are plain JavaScript libraries — a client, a
registry, a few async functions — and neither one needs a render loop to work. If you are wiring
Solana into an existing page, a web component, a game canvas, or a framework nobody has written an
adapter for, this is the shape of the integration.

For the same feature set with React, TanStack Query and shadcn/ui, see
[react-kit-shadcn](https://github.com/solana-mobile/templates/tree/main/mobile/react-kit-shadcn).
Reading the two side by side is the fastest way to see which parts of a Solana app are the
framework's job and which parts are not.

## Technologies

- [@solana/kit](https://www.solanakit.com/) for the client, transaction building and codecs
- [@solana/kit-plugin-rpc](https://www.solanakit.com/) for the RPC connection and airdrops
- [@wallet-standard/app](https://github.com/wallet-standard/wallet-standard) for wallet discovery
- [@solana/wallet-standard-features](https://github.com/anza-xyz/wallet-standard) for signing
- [Mobile Wallet Adapter](https://docs.solanamobile.com/mobile-wallet-adapter/web-installation) for web
- [Seeker Connect](https://github.com/solana-mobile/seeker-connect) for the Seeker's built-in wallet
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)

## Included wallet flows

- Connect and disconnect a wallet. Every wallet in the list comes from the wallet-standard registry,
  so a browser extension and a wallet on a phone reached over Mobile Wallet Adapter are the same
  kind of entry and take the same code path.
- Connect to a Seeker's built-in wallet, either from the wallet list or from the branded
  "Connect with Seeker" button.
- Reconnect silently to the wallet used last time, without flashing a signed-out state first.
- Follow the connected wallet's own `change` events, so switching accounts or revoking access in the
  wallet is reflected here rather than leaving a stale address on screen.
- Read the connected account balance, seeded by an RPC call and kept current by an account
  subscription.
- Fund an empty account, offered only while the balance is zero. The RPC airdrop sits next to a link
  to the web faucet, because the RPC one is rate limited and returns an error far more often than it
  succeeds.
- Sign a message.
- Build, sign, and submit a Memo Program transaction, then link the signature to Solana Explorer.

An action the connected wallet does not implement says so and names the feature. Wallets are listed
whether or not they can sign, because one that silently vanishes reads as a bug rather than as an
answer.

## Get started

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start the development server.

   ```bash
   npm run dev
   ```

Devnet works with no configuration. To change anything, copy `.env.example` to `.env`.

## How it is put together

`src` is flat, and every file has one job. In reading order:

| File                                                           | What it does                                                    |
| -------------------------------------------------------------- | --------------------------------------------------------------- |
| [`cluster.ts`](src/cluster.ts)                                 | The one network this app talks to, and the URLs derived from it |
| [`rpc.ts`](src/rpc.ts)                                         | The Kit client: `rpc`, `rpcSubscriptions` and `airdrop`         |
| [`register-mwa.ts`](src/register-mwa.ts)                       | Puts Mobile Wallet Adapter into the wallet-standard registry    |
| [`register-seeker-connect.ts`](src/register-seeker-connect.ts) | Puts Seeker Connect into the same registry                      |
| [`wallet-store.ts`](src/wallet-store.ts)                       | Wallet discovery and the connection lifecycle                   |
| [`wallet-actions.ts`](src/wallet-actions.ts)                   | Signing a message, and building and submitting a transaction    |
| [`balance.ts`](src/balance.ts)                                 | The balance: one read, then an account subscription             |
| [`view.ts`](src/view.ts)                                       | `render(state)` — state in, DOM out                             |
| [`main.ts`](src/main.ts)                                       | Wires the store to the view and the view to the wallet actions  |
| `format-*.ts`                                                  | Turning an address, an error and a lamport balance into strings |

`index.html` holds the entire interface as static markup, with an `id` on everything the app writes
to. Nothing builds markup in JavaScript except the wallet list, which cannot be static because the
wallets are not known until they register themselves.

### Doing without a framework

Three things a framework would have handed you, and what replaces each here:

**A store.** [`wallet-store.ts`](src/wallet-store.ts) exposes `getState()` and `subscribe()`. That
pair is all any UI needs to stay in step with it — it is also exactly what React's
`useSyncExternalStore` wants, which is why the same store would drop into a React app unchanged.

**A render pass.** [`view.ts`](src/view.ts) looks its elements up once and then sets text, `hidden`
and `disabled` on every pass, unconditionally. Assigning a property the value it already has costs
nothing, so at this size there is nothing to diff. What the discipline buys is that no branch can
leave an element behind showing something that is no longer true.

The one exception is the wallet list, the only place nodes are replaced rather than updated.
Rebuilding it on every keystroke would throw away focus, so `render` remembers which wallets the
buttons were built for and skips the rebuild when that has not changed. Each button carries its
wallet's name in `data-wallet`, and a single delegated listener on the container reads it back — so
rebuilding cannot leak listeners the way attaching one per button would.

**Mutation state.** The `run` function in [`main.ts`](src/main.ts) is eight lines: flip a flag,
await, keep the result or the error, render. Every button shares it.

### Kit's plugins are not a framework

`createClient().use(...)` in [`rpc.ts`](src/rpc.ts) composes plain functions and hands back a plain
object, so taking two of Kit's plugins costs this template nothing it set out to avoid — and saves
lines that are easy to get subtly wrong:

- `solanaRpcConnection` installs `rpc` and `rpcSubscriptions` together, deriving the websocket URL
  from `rpcUrl`. Writing that swap by hand works right up until someone points the app at a provider
  that serves its socket somewhere else.
- `rpcAirdrop` installs `client.airdrop(address, amount)`, which waits on a signature subscription
  instead of polling `getSignatureStatuses`, so it resolves the moment the airdrop lands and returns
  the signature. It is also typed to refuse a mainnet RPC, which has no faucet to ask.

What this template does _not_ take is `@solana/kit-plugin-wallet`. That plugin is framework-agnostic
too, and it would replace most of [`wallet-store.ts`](src/wallet-store.ts) — but it hands the wallet
its own `UiWalletAccount` wrapper, and the point here is to show wallet-standard as the wallet
publishes it. `@solana/kit-plugin-signer` is a different thing again: `payer`, `identity` and
`generatedSigner` take keypairs, which is what a script or a test wants rather than a browser.

### Talking to a wallet

Wallet-standard hands over the wallet's own objects, and that is the detail worth carrying away.
`wallet.features['solana:signMessage'].signMessage({ account, message })` has to be given the very
`account` object out of `wallet.accounts` — wallets validate it against what they published and
reject anything else with "Invalid account". Passing a copy, or a wrapper from a UI layer, fails
against real wallets while working fine against a lenient mock.

`Wallet.features` is typed as `IdentifierRecord<unknown>`: the standard makes no promise about what
any given wallet implements, so a feature is a runtime check before it is a method call.
`getWalletFeature` in [`wallet-store.ts`](src/wallet-store.ts) is the one place that check and its
cast live.

### Sending a transaction

Kit does everything up to the wire format — the instruction from a program client, the fee payer,
the blockhash lifetime, the compile — and `solana:signAndSendTransaction` takes it from there:

```ts
const transaction = pipe(
  createTransactionMessage({ version: 0 }),
  (message) => setTransactionMessageFeePayer(address(account.address), message),
  (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
  (message) => appendTransactionMessageInstruction(getAddMemoInstruction({ memo }), message),
  compileTransaction,
)

const [{ signature }] = await feature.signAndSendTransaction({
  account,
  chain: 'solana:devnet',
  transaction: new Uint8Array(getTransactionEncoder().encode(transaction)),
})
```

No signer abstraction appears in between, because the feature takes bytes. Swap the instruction for
any other program client's and the rest is unchanged.

## Networks

The app talks to Devnet and nothing else. One chain means one RPC endpoint and one set of wallets
that advertise it, so nothing is rebuilt or re-filtered at runtime — which is what keeps the wallet
store and the render pass short enough to read in one sitting.

Set `VITE_RPC_URL_DEVNET` to use your own endpoint. To offer a choice of networks, make the values in
[`cluster.ts`](src/cluster.ts) state and rebuild [`rpc.ts`](src/rpc.ts) when they change; the wallet
store filters on `CHAIN` already.
[react-kit-shadcn](https://github.com/solana-mobile/templates/tree/main/mobile/react-kit-shadcn) has
a full network picker to copy from, including detecting an RPC URL pasted into the wrong variable.

## Mobile Wallet Adapter

With no configuration, Mobile Wallet Adapter appears in the wallet list only in Chrome on Android and in a
Solana Mobile web shell, where it connects to a wallet installed on the same device. Other Android browsers and iOS do not
support it, and everywhere else it is silently absent — which is why a desktop browser with no
extension wallet sees an empty wallet list.

Set `VITE_MWA_REMOTE_HOST_AUTHORITY` to a reflector host to additionally offer the QR code flow,
which pairs a desktop browser with a wallet on a phone.

Mobile Wallet Adapter is registered as a wallet-standard wallet like any other, so nothing below
`registerMobileWalletAdapter()` knows it is there.

## Seeker Connect

[Seeker Connect](https://github.com/solana-mobile/seeker-connect) reaches a Seeker's built-in wallet
over Mobile Wallet Adapter, with Seeker-branded UI instead of the generic wallet chooser. It has two
entry points here, and both drive the same `store.connect`: the wallet-standard registration puts it
in the wallet list, and `<seeker-connect-button>` in [`index.html`](index.html) is the branded
button.

That button is the part worth noticing in a template about not needing a framework. It ships as a
Lit custom element with its own Shadow DOM, so here it is a tag in the markup and one `click`
listener — no wrapper component, no JSX typing for a custom element, and no styling of its own to
maintain. The progress overlay and error dialog Seeker Connect shows around each interaction are
custom elements too, which is why nothing in `global.css` knows about them. They follow
`prefers-color-scheme` rather than the page.

Connecting only works in a browser running on a Seeker, where the wallet app can be launched.
Anywhere else the attempt fails with `association-failed`, which is why the button is offered
alongside the wallet list rather than instead of it.

## Wallet approvals

Every wallet interaction is started by a deliberate action in the interface, and the wallet prompts
for each one. The app never signs, submits, or moves funds on its own, holds no keys, and stores
nothing beyond the name of the wallet to reconnect to. Disconnecting clears that name, and the
wallet's own settings are where an app's authorization is revoked for good.

## Learn more

- [Solana documentation](https://solana.com/docs): Learn how to build on Solana.
- [Solana Kit documentation](https://www.solanakit.com/): Learn how to use the JavaScript SDK for Solana.
- [Solana Mobile documentation](https://docs.solanamobile.com/): Learn how to reach wallets on Android.
- [Wallet Standard](https://github.com/wallet-standard/wallet-standard): Learn how wallet discovery works.
- [Vite documentation](https://vite.dev/guide/): Learn how to configure the build.
