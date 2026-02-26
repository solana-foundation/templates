"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

const solanaConnectors = toSolanaWalletConnectors();

export default function PrivyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
        <div className="max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            Missing Privy App ID
          </h2>
          <p className="text-sm text-gray-300">
            Copy <code className="text-red-300">.env.example</code> to{" "}
            <code className="text-red-300">.env.local</code> and add your Privy
            App ID from{" "}
            <a
              href="https://dashboard.privy.io"
              className="underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              dashboard.privy.io
            </a>
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
          theme: "dark",
          accentColor: "#9945FF",
          logo: undefined,
        },
        loginMethods: ["email", "google", "twitter", "discord", "github"],
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
        },
        solanaClusters: [
          {
            name: "mainnet-beta",
            rpcUrl:
              process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
              "https://api.mainnet-beta.solana.com",
          },
        ],
        externalWallets: {
          solana: { connectors: solanaConnectors },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
