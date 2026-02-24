"use client";

import { usePrivy } from "@privy-io/react-auth";

export function LogoutButton() {
  const { ready, authenticated, logout } = usePrivy();

  if (!ready || !authenticated) {
    return null;
  }

  return (
    <button
      onClick={logout}
      className="group inline-flex items-center gap-2 rounded-full border-2 border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:shadow-md dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-gray-700"
    >
      <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Log Out
    </button>
  );
}
