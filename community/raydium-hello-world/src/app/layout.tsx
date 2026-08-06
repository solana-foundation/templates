import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";
import { GridBackground } from "@/components/grid-background";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raydium Hello World",
  description:
    "A minimal Raydium swap integration with Next.js, Tailwind, and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <div className="relative min-h-screen bg-background text-foreground">
            <GridBackground />
            <div className="relative z-10">{children}</div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
