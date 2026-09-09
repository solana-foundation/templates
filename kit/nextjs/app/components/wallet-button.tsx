"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { address, formatDecimalFixedPoint, lamportsToSol } from "@solana/kit";
import {
  useWallets,
  useConnect,
  useDisconnect,
  useConnectedWallet,
  useIsWalletReady,
} from "@solana/kit-plugin-wallet/react";
import { useBalance } from "../lib/hooks/use-balance";
import { ellipsify } from "../lib/explorer";
import { useCluster } from "./cluster-context";
import { useAppClient } from "../lib/client-provider";

const solFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 9,
});
const subscribeToHydration = () => () => {};

export function WalletButton() {
  const client = useAppClient();
  const wallets = useWallets(client);
  const connected = useConnectedWallet(client);
  const isWalletReady = useIsWalletReady(client);
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );
  const {
    dispatchAsync: connect,
    error: connectError,
    isRunning: isConnecting,
  } = useConnect(client);
  const {
    dispatchAsync: disconnect,
    error: disconnectError,
    isRunning: isDisconnecting,
  } = useDisconnect(client);

  const { getExplorerUrl } = useCluster();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [clipboardError, setClipboardError] = useState<{
    address: string;
    message: string;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const walletAddress = connected?.account.address;
  const copied = copiedAddress === walletAddress;
  const balance = useBalance(
    walletAddress ? address(walletAddress) : undefined
  );
  const connectMenuError = connectError;
  const accountMenuError =
    disconnectError ??
    (clipboardError && clipboardError.address === walletAddress
      ? clipboardError.message
      : null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopy = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      setClipboardError(null);
      setCopiedAddress(walletAddress);
      setTimeout(
        () =>
          setCopiedAddress((current) =>
            current === walletAddress ? null : current
          ),
        2000
      );
    } catch {
      setClipboardError({
        address: walletAddress,
        message: "Unable to copy the address to the clipboard.",
      });
    }
  };

  if (!isHydrated || !isWalletReady) {
    return (
      <span className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground opacity-60">
        Restoring wallet...
      </span>
    );
  }

  if (!connected) {
    return (
      <div className="relative" ref={ref}>
        <button
          ref={triggerRef}
          onClick={() => (isOpen ? close() : open())}
          aria-expanded={isOpen}
          aria-controls={isOpen ? "wallet-options" : undefined}
          className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
        >
          Connect Wallet
        </button>

        {isOpen && (
          <div
            id="wallet-options"
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border-low bg-card p-3 shadow-lg"
          >
            <p className="mb-2 text-xs font-medium text-muted">
              Choose a wallet
            </p>
            {wallets.length === 0 ? (
              <p className="text-xs text-muted">
                No wallets detected. Install a Solana wallet extension.
              </p>
            ) : (
              <div className="space-y-1">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={async () => {
                      try {
                        await connect(wallet);
                        closeAndRestoreFocus();
                      } catch {
                        // The hook exposes the connection error below.
                      }
                    }}
                    disabled={isConnecting}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition hover:bg-cream disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {wallet.icon && (
                      // eslint-disable-next-line @next/next/no-img-element -- wallet-standard icons are data URIs
                      <img
                        src={wallet.icon}
                        alt=""
                        className="h-5 w-5 rounded"
                      />
                    )}
                    <span>{wallet.name}</span>
                  </button>
                ))}
              </div>
            )}
            {isConnecting && (
              <p className="mt-2 text-xs text-muted" role="status">
                Connecting...
              </p>
            )}
            {connectMenuError != null && (
              <p
                className="mt-2 break-words text-xs text-destructive [overflow-wrap:anywhere]"
                role="alert"
              >
                {connectMenuError instanceof Error
                  ? connectMenuError.message
                  : String(connectMenuError)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        onClick={() => (isOpen ? close() : open())}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "wallet-options" : undefined}
        aria-label={`Wallet ${walletAddress}`}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium transition hover:bg-cream"
      >
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-mono">{ellipsify(walletAddress!, 4)}</span>
      </button>

      {isOpen && (
        <div
          id="wallet-options"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border-low bg-card p-4 shadow-lg"
        >
          <div className="mb-3">
            <p className="text-xs text-muted">Balance</p>
            <p className="text-lg font-bold tabular-nums">
              {balance.lamports != null
                ? formatDecimalFixedPoint(
                    solFormatter,
                    lamportsToSol(balance.lamports)
                  )
                : balance.isLoading
                  ? "Loading..."
                  : "Unavailable"}{" "}
              {balance.lamports != null && (
                <span className="text-sm font-normal text-muted">SOL</span>
              )}
            </p>
            {balance.error != null && (
              <p className="mt-1 text-xs text-destructive" role="alert">
                Unable to load the wallet balance.
              </p>
            )}
          </div>

          <div className="mb-3 rounded-lg border border-border-low bg-cream/50 px-3 py-2">
            <p className="break-all font-mono text-xs">{walletAddress}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              aria-label={copied ? "Address copied" : "Copy address"}
              className="flex-1 cursor-pointer rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium transition hover:bg-cream"
            >
              {copied ? "Copied!" : "Copy address"}
            </button>
            <a
              href={getExplorerUrl(`/address/${walletAddress}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg border border-border-low bg-card px-3 py-2 text-center text-xs font-medium transition hover:bg-cream"
            >
              Explorer
            </a>
          </div>

          <button
            onClick={async () => {
              try {
                await disconnect();
                closeAndRestoreFocus();
              } catch {
                // The hook exposes the disconnection error below.
              }
            }}
            disabled={isDisconnecting}
            className="mt-2 w-full cursor-pointer rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
          {accountMenuError != null && (
            <p
              className="mt-2 break-words text-xs text-destructive [overflow-wrap:anywhere]"
              role="alert"
            >
              {accountMenuError instanceof Error
                ? accountMenuError.message
                : String(accountMenuError)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
