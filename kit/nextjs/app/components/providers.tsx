"use client";

import { useMemo, PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AppProvider } from "@solana/connector/react";
import {
  getDefaultConfig,
  getDefaultMobileConfig,
} from "@solana/connector/headless";

export function Providers({ children }: PropsWithChildren) {
  const connectorConfig = useMemo(
    () =>
      getDefaultConfig({
        appName: "Solana dApp Starter",
        appUrl: "https://solana.com",
        autoConnect: true,
        enableMobile: true,
      }),
    [],
  );

  const mobile = useMemo(
    () =>
      getDefaultMobileConfig({
        appName: "Solana dApp Starter",
        appUrl: "https://solana.com",
      }),
    [],
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AppProvider connectorConfig={connectorConfig} mobile={mobile}>
        {children}
        <Toaster position="bottom-right" richColors />
      </AppProvider>
    </ThemeProvider>
  );
}
