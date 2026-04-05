"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const NAV = [{ href: "/", label: "Dashboard", icon: "📊" }];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white text-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-200 bg-white sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-950">SOL Points</div>
              <div className="text-xs text-slate-600">Staking Protocol</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                pathname === href
                  ? "bg-slate-900 text-white font-medium"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Network badge */}
        <div className="px-5 py-4 border-t border-slate-200">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            Devnet
          </span>
        </div>
      </aside>

      {/* Mobile hamburger overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 z-50 flex flex-col border-r border-slate-200 bg-white transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <div className="text-sm font-bold text-slate-950">SOL Points</div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-500 hover:text-slate-900 text-xl"
          >
            ×
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                pathname === href
                  ? "bg-slate-900 text-white font-medium"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger – mobile only */}
            <button
              className="md:hidden text-slate-600 hover:text-slate-900 p-1"
              onClick={() => setMobileOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-1.5">
              <span className="text-lg">💎</span>
              <span className="text-sm font-bold text-slate-950">SOL Points</span>
            </div>

            {/* Network badge – desktop only in top bar */}
            <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 border border-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
              Devnet
            </span>
          </div>

          <WalletMultiButton
            style={{
              background: "#0f172a",
              border: "1px solid rgba(15,23,42,0.2)",
              borderRadius: "8px",
              height: "36px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#ffffff",
              padding: "0 14px"
            }}
          />
        </header>

        <main className="flex-1 px-4 md:px-6 py-6 md:py-8 overflow-y-auto max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
