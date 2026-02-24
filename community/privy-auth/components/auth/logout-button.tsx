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
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      Log Out
    </button>
  );
}
