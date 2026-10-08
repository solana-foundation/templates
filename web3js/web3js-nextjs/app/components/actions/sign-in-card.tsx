"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter";
import { toast } from "sonner";
import { parseTransactionError } from "../../lib/errors";
import { ellipsify } from "../../lib/explorer";
import { useAuth } from "../auth-context";

export function SignInCard() {
  const {
    publicKey,
    signIn: walletSignIn,
    supportsSignInWithOffchainMessage,
  } = useWallet();
  const { session, isLoading, error, signIn, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const signedIn =
    session !== null && session.address === publicKey?.toBase58();

  const handleSignIn = async () => {
    setBusy(true);
    try {
      await signIn();
      toast.success("Signed in with Solana");
    } catch (err) {
      console.error(err);
      toast.error(parseTransactionError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut();
    } catch (err) {
      console.error(err);
      toast.error(parseTransactionError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-sm font-semibold">Sign In With Solana</h2>
      {signedIn ? (
        <>
          <p className="mt-1 text-xs text-muted">
            The server verified your signature and set an httpOnly session
            cookie.
          </p>
          <div className="mt-4 rounded-lg border border-border-low bg-cream/50 px-3 py-2 text-xs">
            <p>
              Signed in as{" "}
              <span className="font-mono">{ellipsify(session.address, 6)}</span>
            </p>
            <p className="mt-1 text-muted">
              Expires {new Date(session.expiresAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={busy}
            className="mt-4 w-full cursor-pointer rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-cream disabled:pointer-events-none disabled:opacity-50"
          >
            {busy ? "Signing out..." : "Sign out"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-1 text-xs text-muted">
            Prove you own this wallet with a server-issued nonce.{" "}
            {supportsSignInWithOffchainMessage
              ? "Your wallet signs SIWS 1.1 as an off-chain message."
              : "Your wallet signs the plain SIWS message."}
          </p>
          {error && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
          {!walletSignIn && (
            <p className="mt-2 text-xs text-muted">
              This wallet does not support Sign In With Solana.
            </p>
          )}
          <button
            onClick={handleSignIn}
            disabled={busy || isLoading || !walletSignIn}
            className="mt-4 w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </>
      )}
    </div>
  );
}
