"use client";

import { useRouter } from "next/navigation";
import { useSession } from "../lib/hooks/use-session";

export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useSession();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex-1 cursor-pointer rounded-lg border border-border-low bg-card px-4 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
    >
      Sign out
    </button>
  );
}
