"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaWalletProvider } from "@/components/providers/wallet-provider";
import { Toaster } from "sonner";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      <SolanaWalletProvider network={WalletAdapterNetwork.Devnet}>
        {children}
        <Toaster position="top-right" />
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}

