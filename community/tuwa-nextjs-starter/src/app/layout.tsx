import '@/styles/app.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ReactNode } from 'react';

import { Header } from '@/components/Header';
import { Providers } from '@/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pulsar & Cosmos SDK: Next.js',
  description:
    'An example demonstrating the integration of Pulsar transaction tracking with a Next.js application using Solana adapter.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Pulsar & Cosmos SDK: Next.js',
  },
  icons: {
    icon: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/icon0.svg',
    shortcut: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/web-app-manifest-512x512.png',
    apple: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/web-app-manifest-512x512.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
