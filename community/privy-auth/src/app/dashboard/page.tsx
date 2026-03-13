"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Wallet } from "lucide-react";
import { UserProfile } from "@/components/user-profile";
import { WalletInfo } from "@/components/wallet-info";
import { SignMessage } from "@/components/sign-message";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <main className="relative min-h-screen">
      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-30" />

      {/* Nav */}
      <nav className="animate-fade-in relative z-20 flex items-center justify-between border-b border-border/60 px-6 py-3.5 backdrop-blur-sm sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight">privy-auth</span>
          <span className="ml-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            Dashboard
          </span>
        </div>
        <ThemeToggle />
      </nav>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div
          className="animate-fade-up mb-8"
          style={{ animationDelay: "50ms" }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your wallet and account
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <div
            className="animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <UserProfile />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className="animate-fade-up"
              style={{ animationDelay: "180ms" }}
            >
              <WalletInfo />
            </div>
            <div
              className="animate-fade-up"
              style={{ animationDelay: "260ms" }}
            >
              <SignMessage />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
