"use client";

import { usePrivy } from "@privy-io/react-auth";

/** Compact auth status indicator shown in the navbar */
export default function AuthStatus() {
  const { ready, authenticated, user } = usePrivy();

  const isLoading = !ready;
  const isAuthed = ready && authenticated;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          isAuthed
            ? "bg-solana-green"
            : isLoading
              ? "animate-pulse bg-yellow-400"
              : "bg-gray-500"
        }`}
      />
      <span className="text-gray-400">
        {isAuthed && user?.email?.address
          ? user.email.address
          : isAuthed
            ? "Connected"
            : isLoading
              ? "Loading…"
              : "Not connected"}
      </span>
    </div>
  );
}
