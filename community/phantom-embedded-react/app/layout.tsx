import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ClientLayout } from '@/components/ClientLayout';
import './globals.css';

// Configure Inter font from Google Fonts
const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO and social sharing
export const metadata: Metadata = {
  title: 'Phantom Embedded Wallet',
  description: 'Next.js starter template for Phantom embedded wallet integration on Solana',
  openGraph: {
    title: 'Phantom Embedded Wallet',
    description: 'Next.js starter template for Phantom embedded wallet integration on Solana',
    type: 'website',
  },
};

/**
 * Root layout component
 * Wraps the entire application with providers and global styles
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

