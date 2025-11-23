"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Avatar } from "./ui/avatar";
import { formatAddress } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

const isWalletWithChainDetails = (
  wallet: { chainId?: string; walletClientType?: string } | undefined
): wallet is { chainId: string; walletClientType: string } =>
  Boolean(wallet?.chainId && wallet.walletClientType);

const isSolanaLinkedWallet = (
  account: {
    type?: string;
    address?: string;
    chainType?: string | null;
    walletClientType?: string | null;
  }
): account is {
  type: "wallet";
  address: string;
  chainType: string;
  walletClientType?: string | null;
} =>
  Boolean(
    account.type === "wallet" && account.chainType?.startsWith("solana") && account.address
  );

type ToastState = {
  message: string;
  tone: "success" | "error";
};

export function UserProfile() {
  const { user, logout, linkWallet, unlinkWallet } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const [unlinkingAddress, setUnlinkingAddress] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const solanaWallet =
    user?.wallet ??
    wallets.find(
      (w) => w.walletClientType === "privy" && w.chainId.startsWith("solana:")
    );

  const walletHasChainMetadata = isWalletWithChainDetails(solanaWallet);
  const walletClientType = walletHasChainMetadata
    ? solanaWallet.walletClientType
    : undefined;

  const solanaLinkedWallets = (user?.linkedAccounts ?? []).filter((account) =>
    isSolanaLinkedWallet(account)
  );

  const dismissToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(null);
    toastTimerRef.current = null;
  };

  const showToast = (nextToast: ToastState) => {
    dismissToast();
    setToast(nextToast);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  const handleLinkSolanaWallet = () => {
    linkWallet({ walletChainType: "solana-only" });
  };

  const handleUnlinkWallet = async (address: string) => {
    setUnlinkingAddress(address);
    try {
      await unlinkWallet(address);
      showToast({ message: "Wallet unlinked successfully.", tone: "success" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to unlink wallet.";
      if (message.includes("Cannot unlink when user has only one account")) {
        showToast({
          message:
            "Add another login method before removing your last wallet.",
          tone: "error",
        });
      } else {
        showToast({
          message: "Unable to unlink wallet. Please try again.",
          tone: "error",
        });
      }
    } finally {
      setUnlinkingAddress(null);
    }
  };

  const walletType = walletClientType === "privy"
      ? "Embedded"
      : "External"

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-0 shadow-xl">
          <div className="rounded-3xl bg-white p-6 text-black shadow-inner">
            <div className="flex items-center gap-4">
              <Avatar
                address={solanaWallet?.address as string}
                size={200}
                className="border aspect-square w-20 h-20 border-black/30 bg-gray-50 shadow-none rounded-2xl"
              />
              <div className="flex flex-col">
                <div>
                  <Badge variant={'outline'} className="text-black">{walletType}</Badge>
                  <p className="text-3xl font-semibold font-mono">
                    {solanaWallet ? formatAddress(solanaWallet.address) : 'Auto-create on demand'}
                  </p>
                </div>
                <Button
                  onClick={logout}
                  variant={"default"}
                  className="mt-6 w-auto flex flex-row items-center rounded-lg border border-none bg-red-700/15 px-4 py-2 text-sm font-semibold text-red-500 transition cursor-pointer"
                >
                  Logout <LogOutIcon className="ml-3 h-4 w-4"/>
                </Button>{' '}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-2xl">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Protected Route</p>
              <h2 className="mt-3 text-2xl font-semibold">Session Inspector</h2>
              <p className="mt-2 text-sm text-white/80">
                Review the raw Privy user and session objects rendered on a server-protected surface.
              </p>
            </div>
            <button
              onClick={() => router.push('/protected')}
              className="mt-8 cursor-pointer inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Go to protected view →
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Linked Solana Wallets</h2>
            <p className="text-sm text-slate-500">Link or unlink external Solana wallets from your Privy account.</p>
          </div>
          <button
            onClick={handleLinkSolanaWallet}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Link wallet
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {solanaLinkedWallets.length ? (
            solanaLinkedWallets.map((wallet) => (
              <div
                key={wallet.address}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-sm text-slate-900">{wallet.address}</p>
                  <p className="text-xs text-slate-500">{wallet.walletClientType ?? 'Linked wallet'}</p>
                </div>
                <button
                  onClick={() => handleUnlinkWallet(wallet.address)}
                  disabled={unlinkingAddress === wallet.address}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {unlinkingAddress === wallet.address ? 'Unlinking…' : 'Unlink'}
                </button>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              No secondary Solana wallets linked. Connect one to make it available across sessions.
            </p>
          )}
        </div>
      </div>
      {toast && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50">
          <div
            className={`pointer-events-auto rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${
              toast.tone === 'error' ? 'bg-rose-500/95' : 'bg-emerald-500/95'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
