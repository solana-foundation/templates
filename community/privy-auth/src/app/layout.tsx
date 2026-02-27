import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PrivyClientProvider from "@/providers/PrivyClientProvider";
import "./globals.css";

// Privy requires a valid App ID at runtime — skip static prerendering
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Privy Auth — Solana dApp",
  description:
    "Next.js + Tailwind template with Privy authentication, social logins, and embedded Solana wallets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyClientProvider>{children}</PrivyClientProvider>
      </body>
    </html>
  );
}
