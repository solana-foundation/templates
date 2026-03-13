"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginButton } from "@/components/login-button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Wallet,
  ShieldCheck,
  Zap,
  ArrowRight,
  Chrome,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: Chrome,
    title: "Google",
    desc: "One-tap sign in",
  },
  {
    icon: MessageCircle,
    title: "Discord",
    desc: "Community login",
  },
  {
    icon: Zap,
    title: "Twitter",
    desc: "Social auth",
  },
  {
    icon: Wallet,
    title: "Wallet",
    desc: "Phantom, Solflare & more",
  },
];

const highlights = [
  {
    icon: Wallet,
    title: "Embedded Wallets",
    desc: "Auto-created Solana wallet for users without one",
  },
  {
    icon: ShieldCheck,
    title: "Protected Routes",
    desc: "Middleware and client-side auth guards",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    desc: "Drop-in Privy provider, ready to build",
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
    <main className="relative min-h-screen overflow-hidden">
      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-40" />

      {/* Top nav */}
      <nav
        className="animate-fade-in relative z-20 flex items-center justify-between px-6 py-4 sm:px-10"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight">privy-auth</span>
        </div>
        <ThemeToggle />
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-4 pb-20">
        {/* Gradient orb */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative w-full max-w-lg space-y-10">
          {/* Badge */}
          <div
            className="animate-fade-up flex justify-center"
            style={{ animationDelay: "50ms" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Solana + Privy Auth Template
            </div>
          </div>

          {/* Headline */}
          <div
            className="animate-fade-up space-y-4 text-center"
            style={{ animationDelay: "120ms" }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Auth that just{" "}
              <span className="text-primary">works</span>
            </h1>
            <p className="mx-auto max-w-sm text-base leading-relaxed text-muted-foreground">
              Social logins, embedded wallets, and protected routes for your
              Solana dApp. Built with Privy.
            </p>
          </div>

          {/* Login methods grid */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/80 p-4 text-center shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="animate-fade-up flex justify-center"
            style={{ animationDelay: "300ms" }}
          >
            {ready && !authenticated && (
              <div className="w-full max-w-xs">
                <LoginButton />
              </div>
            )}

            {!ready && (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Initializing...
                </p>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div
            className="animate-fade-up space-y-3 pt-4"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="h-px w-8 bg-border" />
              What you get
              <div className="h-px w-8 bg-border" />
            </div>
            <div className="space-y-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-4 py-2.5 transition-colors hover:border-border hover:bg-card/60"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
