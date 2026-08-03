"use client";

import React from "react";
import { SolanaProvider } from "@/components/solana/solana-provider";

export function AppProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SolanaProvider>{children}</SolanaProvider>;
}
