"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;

if (!privyAppId) {
  throw new Error(
    "NEXT_PUBLIC_PRIVY_APP_ID is not set. Please add it to your .env.local file. See README.md for setup instructions.",
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const mainnetRpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL ||
    "https://api.mainnet-beta.solana.com";
  const mainnetWsUrl = mainnetRpcUrl.replace(/^http/, "ws");

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        // Embedded wallet configuration for Solana
        // Automatically creates a Solana wallet for users who log in without one
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        // Appearance configuration - Solana-only chain type
        appearance: {
          walletChainType: "solana-only",
          theme: "light",
        },
        // External wallet connectors (Phantom, Solflare, etc.)
        externalWallets: {
          solana: { connectors: toSolanaWalletConnectors() },
        },
        // Social login providers - configure these in Privy Dashboard
        loginMethods: ["email", "wallet", "google", "twitter", "discord"],
        // Solana RPC configuration
        solana: {
          rpcs: {
            "solana:mainnet": {
              rpc: createSolanaRpc(mainnetRpcUrl),
              rpcSubscriptions: createSolanaRpcSubscriptions(mainnetWsUrl),
            },
            "solana:devnet": {
              rpc: createSolanaRpc("https://api.devnet.solana.com"),
              rpcSubscriptions: createSolanaRpcSubscriptions(
                "wss://api.devnet.solana.com",
              ),
            },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}