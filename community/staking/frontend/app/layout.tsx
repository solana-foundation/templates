import "./globals.css";
import type { ReactNode } from "react";
import { LayoutClient } from "@/components/layout/layout-client";

export const metadata = {
  title: "Solana Staking dApp",
  description: "Stake your SOL and earn rewards"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
