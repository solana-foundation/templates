import '@/styles/app.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Header } from '@/components/Header';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Pulsar & Cosmos SDK: Next.js',
  description:
    'An example demonstrating the integration of Pulsar transaction tracking with a Next.js application using Solana adapter.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Pulsar & Cosmos SDK: Next.js',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
