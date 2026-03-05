"use client";

import { usePrivy } from "@privy-io/react-auth";

export function LoginButton() {
  const { ready, authenticated, login } = usePrivy();

  // Don't render until Privy is ready
  if (!ready) {
    return (
      <button
        disabled
        className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gray-300 px-8 py-4 font-semibold text-gray-500 shadow-lg"
      >
        <div className="h-5 w-5 animate-spin rounded-full border-3 border-gray-400 border-t-transparent"></div>
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
      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
      <span className="relative flex items-center gap-2">
        <svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Connect Wallet
      </span>
    </button>
  );
}
