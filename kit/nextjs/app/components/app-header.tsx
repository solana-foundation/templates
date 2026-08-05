"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { ClusterSelect } from "./cluster-select";
import { WalletButton } from "./wallet-button";

const NAV = [
  { href: "/", label: "Actions" },
  { href: "/nfts", label: "NFTs" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-4">
      <div className="flex items-center gap-5">
        <span className="text-sm font-semibold tracking-tight">
          Solana Kit Starter
        </span>
        <nav className="flex items-center gap-4">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href
                  ? "text-xs font-medium text-foreground"
                  : "text-xs font-medium text-muted transition hover:text-foreground"
              }
            >
              {label}
            </Link>
          ))}
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
