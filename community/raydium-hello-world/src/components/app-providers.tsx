"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SolanaProvider } from "@/components/solana/solana-provider";

export function AppProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SolanaProvider>{children}</SolanaProvider>
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}
