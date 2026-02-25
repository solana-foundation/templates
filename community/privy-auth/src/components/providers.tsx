"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { Wallet } from "lucide-react";

const solanaConnectors = toSolanaWalletConnectors();

export function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="animate-fade-up space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
            <Wallet className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-lg font-semibold">Missing Privy App ID</p>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            Copy{" "}
            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              .env.example
            </code>{" "}
            to{" "}
            <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              .env.local
            </code>{" "}
            and add your Privy App ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          showWalletLoginFirst: false,
          walletChainType: "solana-only",
          theme: "dark",
          accentColor: "#ffffff",
        },
        loginMethods: ["google", "twitter", "discord", "email", "wallet"],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        embeddedWallets: {
          solana: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
