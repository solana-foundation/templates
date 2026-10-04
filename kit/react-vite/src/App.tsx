import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useIsWalletReady,
  useWallets,
} from "@solana/kit-plugin-wallet/react";
import { useClient } from "@solana/react";
import type { AppClient } from "./solana-client";
import { getWalletForHandle } from "@wallet-standard/ui-registry";

const walletIds = new WeakMap<object, number>();
let nextWalletId = 0;
function walletId(wallet: object) {
  let id = walletIds.get(wallet);
  if (id === undefined) {
    id = nextWalletId++;
    walletIds.set(wallet, id);
  }
  return id;
}

export default function App() {
  const client = useClient<AppClient>();
  const wallets = useWallets(client);
  const connectedWallet = useConnectedWallet(client);
  const isWalletReady = useIsWalletReady(client);
  const {
    dispatchAsync: connect,
    error: connectError,
    isRunning: isConnecting,
    reset: resetConnect,
  } = useConnect(client);
  const {
    dispatchAsync: disconnect,
    error: disconnectError,
    isRunning: isDisconnecting,
    reset: resetDisconnect,
  } = useDisconnect(client);

  const address = connectedWallet?.account.address;
  const status = connectedWallet ? "connected" : "disconnected";
  const walletError = connectError ?? disconnectError;
  const isBusy = isConnecting || isDisconnecting;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg1 text-foreground">
      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-10 border-x border-border-low px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">
            Solana starter kit
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Ship a Solana dapp fast
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted">
            Drop in <code className="font-mono">@solana/kit</code>, add the Kit
            wallet and RPC plugins, and you get wallet connection plus Version 1
            transaction support without manual RPC wiring.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span
                className="mt-1.5 h-2 w-2 rounded-full bg-foreground/60"
                aria-hidden
              />
              <div>
                <a
                  className="font-medium underline underline-offset-2"
                  href="https://solana.com/docs"
                  target="_blank"
                  rel="noreferrer"
                >
                  Solana docs
                </a>{" "}
                — core concepts, RPC, programs, and client patterns.
              </div>
            </li>
            <li className="flex gap-2">
              <span
                className="mt-1.5 h-2 w-2 rounded-full bg-foreground/60"
                aria-hidden
              />
              <div>
                <a
                  className="font-medium underline underline-offset-2"
                  href="https://www.anchor-lang.com/docs/introduction"
                  target="_blank"
                  rel="noreferrer"
                >
                  Anchor docs
                </a>{" "}
                — build and test programs with IDL, macros, and type-safe
                clients.
              </div>
            </li>
            <li className="flex gap-2">
              <span
                className="mt-1.5 h-2 w-2 rounded-full bg-foreground/60"
                aria-hidden
              />
              <div>
                <a
                  className="font-medium underline underline-offset-2"
                  href="https://faucet.solana.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Solana faucet (devnet)
                </a>{" "}
                — grab free devnet SOL to try transfers and transactions.
              </div>
            </li>
            <li className="flex gap-2">
              <span
                className="mt-1.5 h-2 w-2 rounded-full bg-foreground/60"
                aria-hidden
              />
              <div>
                <a
                  className="font-medium underline underline-offset-2"
                  href="https://www.npmjs.com/package/@solana/kit-plugin-wallet"
                  target="_blank"
                  rel="noreferrer"
                >
                  Kit wallet plugin README
                </a>{" "}
                — how this starter wires the client, connectors, and hooks.
              </div>
            </li>
          </ul>
        </header>

        <section className="w-full max-w-3xl space-y-4 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-lg font-semibold">Wallet connection</p>
              <p className="text-sm text-muted">
                Pick any discovered connector and manage connect / disconnect in
                one spot.
              </p>
            </div>
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/80">
              {status === "connected" ? "Connected" : "Not connected"}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {!isWalletReady ? (
              <p className="text-sm text-muted">Restoring wallet...</p>
            ) : wallets.length === 0 ? (
              <p className="text-sm text-muted">No wallets detected.</p>
            ) : (
              wallets.map((candidate) => (
                <button
                  key={walletId(getWalletForHandle(candidate))}
                  onClick={() => {
                    resetDisconnect();
                    void connect(candidate).catch(() => {});
                  }}
                  disabled={isBusy}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-border-low bg-card px-4 py-3 text-left text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex flex-col">
                    <span className="text-base">{candidate.name}</span>
                    <span className="text-xs text-muted">
                      {isConnecting
                        ? "Connecting…"
                        : status === "connected" &&
                            connectedWallet != null &&
                            getWalletForHandle(connectedWallet.wallet) ===
                              getWalletForHandle(candidate)
                          ? "Active"
                          : "Tap to connect"}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full bg-border-low transition group-hover:bg-primary/80"
                  />
                </button>
              ))
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border-low pt-4 text-sm">
            <span
              className="min-w-0 break-all rounded-lg border border-border-low bg-cream px-3 py-2 font-mono text-xs"
              aria-live="polite"
            >
              {address ?? "No wallet connected"}
            </span>
            <button
              onClick={() => {
                resetConnect();
                void disconnect().catch(() => {});
              }}
              disabled={status !== "connected" || isBusy}
              className="inline-flex items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 font-medium transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Disconnect
            </button>
          </div>
          {walletError != null && (
            <p role="alert" className="break-words text-sm text-red-600">
              {walletError instanceof Error
                ? walletError.message
                : String(walletError)}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
