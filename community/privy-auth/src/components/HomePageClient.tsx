'use client';

import Link from 'next/link';
import LoginButton from '@/components/LoginButton';
import { usePrivy } from '@privy-io/react-auth';
import { Shield, Wallet, Zap } from 'lucide-react';
import SetupChecklist from '@/components/SetupChecklist';
import Navbar from '@/components/Navbar';

const features = [
  {
    icon: Zap,
    title: 'Social Login',
    desc: 'One-click sign-in via Google, Twitter, Discord, GitHub, and Apple — no seed phrases.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  {
    icon: Wallet,
    title: 'Embedded Wallet',
    desc: 'Privy creates a Solana wallet automatically — users never touch a browser extension.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
  },
  {
    icon: Shield,
    title: 'Protected Routes',
    desc: 'Server-side and client-side auth guards keep sensitive pages behind authentication.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
];

export default function HomePageClient() {
  const { ready, authenticated } = usePrivy();

  return (
    <main className="relative min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 mt-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-2">
              Solana · Privy · Next.js
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Auth that <span className="gradient-text">just works</span>
            </h1>
            <p className="text-lg text-white/50 max-w-lg mx-auto leading-relaxed">
              Social logins and embedded Solana wallets — no seed phrases, no extensions. Your
              users are three seconds from being onboarded.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <LoginButton size="lg" />
            {authenticated && ready && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
              >
                Dashboard →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
            {features.map(({ icon: Icon, title, desc, color, bg, border }) => (
              <div key={title} className={`feature-card text-left border ${border}`}>
                <div
                  className={`${bg} ${border} size-10 rounded-xl flex items-center justify-center border mb-4`}
                >
                  <Icon className={`size-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <SetupChecklist className="w-full text-left" />
        </div>

        <footer className="mt-24 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-white/25">
          <span>Solana Foundation · Community Template</span>
          <a
            href="https://docs.privy.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/50 transition-colors underline"
          >
            Privy Docs
          </a>
        </footer>
      </div>
    </main>
  );
}
