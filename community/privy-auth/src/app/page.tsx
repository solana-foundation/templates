"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginButton from "@/components/LoginButton";
import AuthStatus from "@/components/AuthStatus";

export default function Home() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/dashboard");
    }
  }, [ready, authenticated, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-solana-purple/10 via-transparent to-solana-green/5" />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* Logo / branding */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-solana-purple to-solana-green">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
              Solana
            </span>{" "}
            <span className="text-white">× Privy</span>
          </h1>
        </div>

        <p className="mb-2 text-lg text-gray-300">
          Authentication made simple
        </p>
        <p className="mb-8 max-w-sm text-sm text-gray-500">
          Sign in with your email or social account. A Solana wallet is
          automatically created for you.
        </p>

        {/* Login providers */}
        <LoginButton />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
          <span>Email</span>
          <span>·</span>
          <span>Google</span>
          <span>·</span>
          <span>X (Twitter)</span>
          <span>·</span>
          <span>Discord</span>
          <span>·</span>
          <span>GitHub</span>
        </div>

        {/* Auth status */}
        <div className="mt-8">
          <AuthStatus />
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full py-4 text-center text-xs text-gray-600">
        Built with{" "}
        <a
          href="https://www.privy.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-400"
        >
          Privy
        </a>{" "}
        ·{" "}
        <a
          href="https://solana.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-400"
        >
          Solana
        </a>{" "}
        ·{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-400"
        >
          Next.js
        </a>
      </footer>
    </main>
  );
}
