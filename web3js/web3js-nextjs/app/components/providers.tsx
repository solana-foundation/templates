"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth-context";
import { ClusterProvider } from "./cluster-context";
import { SolanaProvider } from "./solana-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ClusterProvider>
        <SolanaProvider>
          <AuthProvider>{children}</AuthProvider>
        </SolanaProvider>
        <Toaster position="bottom-right" richColors />
      </ClusterProvider>
    </ThemeProvider>
  );
}
