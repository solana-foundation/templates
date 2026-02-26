"use client";

import { usePrivy } from "@privy-io/react-auth";
import type { AuthState } from "@/types/privy";

/** Compact auth status indicator shown in the navbar */
export default function AuthStatus() {
  const { ready, authenticated, user } = usePrivy();

  const state: AuthState = !ready
    ? "loading"
    : authenticated
      ? "authenticated"
      : "unauthenticated";

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          state === "authenticated"
            ? "bg-solana-green"
            : state === "loading"
              ? "animate-pulse bg-yellow-400"
              : "bg-gray-500"
        }`}
      />
      <span className="text-gray-400">
        {state === "authenticated" && user?.email?.address
          ? user.email.address
          : state === "authenticated"
            ? "Connected"
            : state === "loading"
              ? "Loading…"
              : "Not connected"}
      </span>
    </div>
  );
}
