"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserProfile } from "@/components/user-profile";
import { WalletInfo } from "@/components/wallet-info";
import { SignMessage } from "@/components/sign-message";

export default function DashboardPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!authenticated) return null;

  return (
    <main className="relative min-h-screen px-4 py-8">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] -translate-y-1/4 rounded-full bg-primary/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="space-y-4">
          <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <UserProfile />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <WalletInfo />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
            <SignMessage />
          </div>
        </div>
      </div>
    </main>
  );
}
