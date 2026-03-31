"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";

export default function LoginButton() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  if (!ready || authenticated) return null;

  return (
    <button
      onClick={login}
      className="rounded-lg bg-gradient-to-r from-solana-purple to-solana-green px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!ready}
    >
      Sign In
    </button>
  );
}
