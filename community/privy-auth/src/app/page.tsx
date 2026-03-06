"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "@/components/login-button";
import { Users, Wallet, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Social Logins",
    desc: "Google, Twitter, Discord & Email",
  },
  {
    icon: Wallet,
    title: "Embedded Wallets",
    desc: "Auto-created Solana wallet for every user",
  },
  {
    icon: ShieldCheck,
    title: "Protected Routes",
    desc: "Middleware + client-side auth guards",
  },
];

export default function Home() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/dashboard");
    }
  }, [ready, authenticated, router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Ambient purple glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-10 text-center">
        {/* Hero */}
        <div className="animate-fade-up space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h1 className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            privy-auth
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
            Solana dApp starter with Privy authentication, social logins, and
            embedded wallets
          </p>
        </div>

        {/* Login */}
        {ready && !authenticated && (
          <div
            className="animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <LoginButton />
          </div>
        )}

        {!ready && (
          <div
            className="animate-fade-up flex items-center justify-center gap-2"
            style={{ animationDelay: "100ms" }}
          >
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <p className="text-sm text-muted-foreground">Initializing...</p>
          </div>
        )}

        {/* Feature cards */}
        <div className="space-y-3">
          {features.map((item, i) => (
            <div
              key={item.title}
              className="animate-fade-up group flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 p-4 text-left backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card"
              style={{ animationDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                <item.icon className="h-[18px] w-[18px]" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
