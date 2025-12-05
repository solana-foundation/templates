"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserProfile } from "@/components/user-profile";
import { LoginScreen } from "@/components/login-screen";

export function HomeContent() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.prefetch("/protected");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {authenticated ? <UserProfile /> : <LoginScreen />}
    </main>
  );
}

