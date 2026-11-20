# Example Expo app with Seeker Connect

This is an example of how to use [`@solana-mobile/seeker-connect-react-native`](https://www.npmjs.com/package/@solana-mobile/seeker-connect-react-native) with Expo. `components/seeker-wallet-provider.tsx` wraps it in a React provider and builds transactions with [`@solana/kit`](https://www.npmjs.com/package/@solana/kit); the RPC client and the cluster definitions come from [`@wallet-ui/react-native-kit`](https://www.npmjs.com/package/@wallet-ui/react-native-kit).

## Reset the project

The account and network screens are here to demonstrate the SDK, not to be built on. When you are ready to start your own app, strip them out:

```bash
npm run reset-project
pnpm run reset-project
bun run reset-project
yarn reset-project
```

Run it with the package manager you created the app with. The script writes the instructions it leaves behind for whichever one invoked it, so reaching for `npm` here in a pnpm app leaves you with a README telling you to run `npm`.

It lists what it is about to delete and asks before touching anything. What it keeps is the wiring — the crypto polyfill, the providers and the app config. What it deletes is everything built on top: the account screens, the network switcher and its read queries, the formatting helpers and the tests covering them.

The switcher goes because `SeekerWalletProvider` takes a single cluster, so a blank app has no use for a list to pick from. `constants/app-config.ts` is rewritten to hold one cluster — carried over from whichever network was configured first, so a project already pointed at mainnet stays there — and `components/app-providers.tsx` passes it straight to the provider.

`app/index.tsx` becomes an empty screen, `components/app-providers.test.tsx` is left behind so the suite still covers the wiring, the demo-only dependency is dropped from `package.json`, and the README is replaced with one describing what is left.

Pass `--yes` to skip the prompt. npm needs a `--` separator to forward the flag; the others do not:

```bash
npm run reset-project -- --yes
pnpm run reset-project --yes
```

If you already know you want a blank app, pass `--reset-project` when you create the project and the reset runs for you,
before dependencies are installed so the demo-only dependency never gets installed at all:

```bash
npx create-solana-dapp@latest my-app --template expo-kit-minimal --reset-project
```

## Testing

Tests run on [Vitest](https://vitest.dev) with [React Native Testing Library](https://callstack.github.io/react-native-testing-library/). No emulator, device or wallet app is needed, so the whole suite runs in a couple of seconds and works in CI.

```bash
npm run test           # run once
npm run test:watch     # re-run on change
npm run test:coverage  # run once with a coverage report
```

`npm run ci` runs the suite alongside the type check, linter and formatter.

### Three layers of tests

L1 and L2 both run on every commit and need nothing but Node. L3 drives the built app on an emulator against a real wallet app, so it runs when you ask for it.

| Layer  | Scope                                         | Example                                                                             |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| **L1** | Pure functions, no React                      | [`ellipsify.test.ts`](utils/ellipsify.test.ts)                                      |
| **L2** | Components and hooks, wallet transport mocked | [`account-feature-index.test.tsx`](features/account/account-feature-index.test.tsx) |
| **L3** | The built app, a real emulator, a real wallet | [`e2e/fakewallet.sh`](e2e/fakewallet.sh)                                            |

**L1** tests import a function and assert on its output — the formatting helpers in [`utils/`](utils) are the whole of it, because that is the whole of this template's logic that does not need React.

Transaction building is deliberately _not_ tested at L1. Building the memo instruction is a single call into [`@solana-program/memo`](https://www.npmjs.com/package/@solana-program/memo); wrapping it in a function just to unit test it would only assert that a dependency and a template string work. What is worth pinning is that pressing the button hands the wallet the right instruction, and that is an L2 assertion. Extract a helper when a transaction grows logic of its own — branching, several instructions, computed amounts — and test it at L1 then.

**L3** tests are the only ones that prove the app can actually talk to a wallet, because they are the only ones that do not mock the transport. They drive the emulator through `adb`, hand off to [fakewallet](https://github.com/solana-mobile/mobile-wallet-adapter), and come back — including the paths where the wallet declines or fails, which is where unhandled rejections hide. They need an emulator and a wallet APK, so they sit outside `npm run ci`; see [`e2e/README.md`](e2e/README.md).

```bash
npm run e2e
```

**L2** tests render real components and press real buttons. The only thing replaced is the Seeker Connect transport — `useSeekerWallet()` is mocked so that no wallet app is launched and no RPC request leaves the process:

```tsx
vi.mock('@/components/seeker-wallet-provider', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/seeker-wallet-provider')>()),
  useSeekerWallet: () => wallet.current,
}))
```

Everything else — `View`, `Text`, `Button`, React Query, the network provider — is the real implementation. Shared helpers live in [`test/test-utils.tsx`](test/test-utils.tsx): `renderWithProviders` wraps a tree in a fresh React Query client, and `createSeekerWalletMock` builds the stand-in wallet.

### Writing tests

A few conventions worth knowing before you add to the suite.

**`render` is async.** React Native Testing Library v14 returns a promise from `render`, `fireEvent` and `rerender`. Await them, and query through the awaited result rather than the `screen` global:

```tsx
const screen = await renderWithProviders(<AccountFeatureIndex />)
await fireEvent.press(screen.getByRole('button', { name: /sign transaction/i }))
```

The `screen` export is reassigned internally by `render`, which a static ESM import will not observe — so it stays stuck on the "render has not been called" stub. The awaited render result carries the same queries and always works.

**Match button labels case-insensitively.** Android's `Button` uppercases its title, so the rendered text is `SIGN TRANSACTION`. A `/sign transaction/i` regex keeps tests readable and platform-independent. Anchor it (`/^connect$/i`) when one label is a substring of another.

**Prefer roles over text.** `getByRole('button', { name: ... })` asserts the element is actually reachable by assistive technology, which `getByText` does not.

### How it works

[`vitest-native`](https://github.com/danfry1/vitest-native) makes React Native loadable under Vitest: it applies the Babel transform React Native's Flow-typed source needs and mocks the native module boundary. Configuration lives in [`vitest.config.mts`](vitest.config.mts).

Tests execute the real `react-native` package rather than a reimplementation, so the rendered tree contains genuine host components (`RCTView`, `RCTText`) with real accessibility props. The platform is pinned to `android`, matching Mobile Wallet Adapter, and presets supply native mocks for Reanimated, Gesture Handler, Safe Area Context and Async Storage.

The config file uses the `.mts` extension because this package is CommonJS; a plain `vitest.config.ts` would be loaded as CJS and fail.

> React Native Testing Library v14 requires Node 22.13 or newer.
