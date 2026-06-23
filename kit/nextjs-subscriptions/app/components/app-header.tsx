"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { ClusterSelect } from "./cluster-select";
import { WalletButton } from "./wallet-button";

const NAV = [
  { href: "/", label: "Subscribe" },
  { href: "/subscriptions", label: "My Subscriptions" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Solana Subscriptions
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition hover:bg-cream ${
                  active ? "bg-cream text-foreground" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ClusterSelect />
        <WalletButton />
      </div>
    </header>
  );
}
