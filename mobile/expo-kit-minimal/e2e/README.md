# End-to-end tests

The Vitest suite mocks the Mobile Wallet Adapter transport, so it never proves the app can actually
talk to a wallet. These tests do: the real app, on an emulator, handing off to a real wallet app and
back.

```bash
npm run e2e
```

They are not part of `npm run ci` — they need an emulator, so they run when you ask for them.

## Setup

An Android emulator, the app installed on it, and a wallet app to talk to.

**1. Emulator and app.** `npm run android` builds, installs and starts the dev server. Leave it
running: this is a dev client build, so the app cannot reload its JavaScript without it.

**2. Install fakewallet.** The tests drive
[fakewallet](https://github.com/solana-mobile/mobile-wallet-adapter), a wallet built for testing:

```bash
gh release download v2.1.1 -R solana-mobile/mobile-wallet-adapter -p fakewallet-v1-debug.apk
adb install -r fakewallet-v1-debug.apk
```

**3. One wallet at a time.** With two wallets installed Android raises a chooser, and the detour is
slow enough that the association times out before anyone picks. Disable the others for the run:

```bash
adb shell pm disable-user --user 0 com.solflare.mobile   # adb shell pm enable ... to restore
```

With more than one device attached, pin the target: `export ANDROID_SERIAL=emulator-5554`.

## Why fakewallet

A shipping wallet makes these tests worse in every way. It wants a passcode, its approvals are
slide gestures, it warns about unrecognised dev-server origins, and it cannot be made to fail on
demand. fakewallet has none of that, and it exposes buttons that force specific failures:

| Button                               | Failure it injects           |
| ------------------------------------ | ---------------------------- |
| `btn_decline`                        | the user rejects the request |
| `btn_simulate_internal_error`        | the wallet fails internally  |
| `btn_simulate_cluster_not_supported` | the cluster is not supported |
| `btn_simulate_invalid_payloads`      | the payload is rejected      |

Those paths are the point. The happy path breaks loudly; a swallowed rejection or an unhandled
promise is what actually ships. Every failure test asserts three things — the app stays unbound, it
tells the user something went wrong, and it does not leak an unhandled rejection.

Nothing here needs SOL. fakewallet's account is empty, and every flow the demo exposes works at a
zero balance except sending a transaction, which is why sending is not covered.

## Testing against a real wallet

Point the tests at a shipping wallet by installing it instead, and expect to drive the approvals by
hand — the passcode in particular is yours to type. Useful as an occasional compatibility check,
not as something to run on every change.

## How it finds things

Every element is located through `uiautomator dump` by resource id or text, then tapped at the
centre of its reported bounds. No coordinates are hardcoded, so the tests survive a different screen
size or density.

Both apps expose a full accessibility tree, including the wallet — dump it yourself while a screen is
up to find a selector:

```bash
adb shell uiautomator dump /sdcard/ui.xml && adb shell cat /sdcard/ui.xml
```

When a dump looks empty, check the byte count before concluding the screen is unreadable. Grepping
only for `text=` misses screens that are rich in `resource-id` and have almost no text.

## Timing

Two windows close faster than you would expect, and both look like unrelated failures:

- **The association expires while the wallet is locked.** Unlock the wallet before starting a flow,
  not after the app asks for it.
- **A transaction's blockhash expires in well under a minute.** Anything that screenshots, thinks,
  then taps will miss it.

This is why the tests are a script rather than a person clicking, and why each approve sequence runs
without pausing in the middle.
