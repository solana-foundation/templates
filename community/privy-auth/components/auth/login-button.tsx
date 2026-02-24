"use client";

import { usePrivy } from "@privy-io/react-auth";

export function LoginButton() {
  const { ready, authenticated, login } = usePrivy();

  // Don't render until Privy is ready
  if (!ready) {
    return (
      <button
        disabled
        className="rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-500"
      >
        Loading...
      </button>
    );
  }

  // If user is already logged in, don't show login button
  if (authenticated) {
    return null;
  }

  return (
    <button
      onClick={login}
      className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
    >
      Log In
    </button>
  );
}
