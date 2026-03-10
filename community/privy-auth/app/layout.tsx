import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import PrivyProviderWrapper from "@/components/PrivyAppProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Privy + Solana Auth",
  description: "Next.js template with Privy authentication and embedded Solana wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased bg-white text-black`}>
        <PrivyProviderWrapper>
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
