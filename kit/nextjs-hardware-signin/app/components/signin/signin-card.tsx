"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useHardwareSignIn } from "../../lib/hooks/use-hardware-signin";
import { useSession } from "../../lib/hooks/use-session";
import { ellipsify } from "../../lib/explorer";

export function SignInCard() {
  const router = useRouter();
  const client = useAppClient();
  const connected = useConnectedWallet(client);
  const { address, isLoading, refresh, signOut } = useSession();
  const { signIn, isSigningIn } = useHardwareSignIn(async () => {
    await refresh();
    router.push("/protected");
  });

  if (isLoading) {
    return (
      <div className="mt-8 rounded-2xl border border-border-low bg-card p-6 text-sm text-muted">
        Loading session…
      </div>
    );
  }

  if (address) {
    return (
      <div className="mt-8 rounded-2xl border border-border-low bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <h2 className="text-sm font-semibold">Signed in</h2>
        </div>
        <p className="mt-2 text-xs text-muted">
          The server verified an Ed25519 signature over a memo transaction — no
          transaction was ever sent to the network.
        </p>
        <p className="mt-3 break-all rounded-lg border border-border-low bg-cream/50 px-3 py-2 font-mono text-xs">
          {address}
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href="/protected"
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
          >
            Enter dashboard
          </Link>
          <button
            onClick={signOut}
            className="flex-1 cursor-pointer rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Sign in with a hardware wallet</h2>
      <p className="mt-1 text-xs text-muted">
        Prove wallet ownership by signing a memo transaction containing a
        server-issued nonce. Works with hardware wallets, which cannot sign
        arbitrary off-chain messages.
      </p>
      {connected ? (
        <button
          onClick={signIn}
          disabled={isSigningIn}
          className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSigningIn
            ? "Waiting for signature…"
            : `Sign in as ${ellipsify(connected.account.address, 4)}`}
        </button>
      ) : (
        <p className="mt-4 rounded-lg border border-border-low bg-cream/50 px-3 py-2 text-xs text-muted">
          Connect a wallet to sign in.
        </p>
      )}
    </div>
  );
}
