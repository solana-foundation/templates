"use client";

import { useLogout, usePrivy } from "@privy-io/react-auth";

export default function LogoutButton() {
  const { ready, authenticated } = usePrivy();
  const { logout } = useLogout();

  if (!ready || !authenticated) return null;

  return (
    <button
      onClick={logout}
      className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
    >
      Sign Out
    </button>
  );
}
