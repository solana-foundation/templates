"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useWallet, type SolanaSignInInput } from "@solana/wallet-adapter";
import { toast } from "sonner";
import type { Session } from "../lib/auth/session";
import { encodeSignInRequest } from "../lib/auth/wire";

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<Session>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function deleteSession() {
  const response = await fetch("/api/auth/session", { method: "DELETE" });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(body.error ?? "Sign-out failed.");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    publicKey,
    status,
    signIn: walletSignIn,
    supportsSignInWithOffchainMessage,
  } = useWallet();
  const address = publicKey?.toBase58() ?? null;
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pendingSignOut = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((body: { session: Session | null; error?: string }) => {
        if (!active) return;
        setSession(body.session);
        setError(body.error ?? null);
      })
      .catch(() => active && setError("Unable to load the session."))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    await deleteSession();
    setSession(null);
  }, []);

  const signIn = useCallback(async () => {
    if (!address) throw new Error("Connect a wallet first.");

    await pendingSignOut.current?.catch(() => {});
    if (!walletSignIn) {
      throw new Error("This wallet does not support Sign In With Solana.");
    }

    const nonceResponse = await fetch("/api/auth/nonce", { cache: "no-store" });
    if (!nonceResponse.ok) {
      throw new Error("Unable to get a sign-in nonce from the server.");
    }
    const { nonce } = (await nonceResponse.json()) as { nonce: string };

    const input: SolanaSignInInput = {
      domain: window.location.host,
      address,
      statement: "Sign in to the Web3.js v3 starter.",
      uri: window.location.origin,
      version: "1",
      nonce,
      issuedAt: new Date().toISOString(),
      ...(supportsSignInWithOffchainMessage && {
        useOffchainMessage: { messageVersion: 1 },
      }),
    };
    const output = await walletSignIn(input);

    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encodeSignInRequest(input, output)),
    });
    const body = (await response.json()) as {
      session?: Session;
      error?: string;
    };
    if (!response.ok || !body.session) {
      throw new Error(body.error ?? "Sign-in verification failed.");
    }
    setSession(body.session);
    setError(null);
    return body.session;
  }, [address, walletSignIn, supportsSignInWithOffchainMessage]);

  // A session belongs to one wallet account. Drop it when the wallet settles
  // as disconnected or connects a different account. "pending" and
  // "reconnecting" (page load, cluster switch) are transient and keep it.
  useEffect(() => {
    if (!session) return;
    const disconnected = status === "disconnected";
    const switched = address !== null && address !== session.address;
    if (disconnected || switched) {
      const signOut = deleteSession();
      pendingSignOut.current = signOut;
      signOut
        .then(
          () => setSession((current) => (current === session ? null : current)),
          (err: Error) => {
            console.error(err);
            toast.error(err.message);
          }
        )
        .finally(() => {
          if (pendingSignOut.current === signOut) pendingSignOut.current = null;
        });
    }
  }, [address, session, status]);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, error, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
