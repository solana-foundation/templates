import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SolanaWalletProvider } from '@/components/wallet-provider'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import type React from 'react'
import { Suspense } from 'react'
import './globals.css'
import { JsonLd } from './jsonld'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Solana DEX Analytics Template – Open Source Next.js Starter',
    template: '%s | Solana DEX Analytics Template',
  },
  description:
    'Open-source Solana DEX analytics template built with Next.js 15, Jupiter Ultra, Helius, CoinGecko, and DeFiLlama.',
  keywords: [
    'Solana DEX',
    'decentralized exchange',
    'Solana trading',
    'crypto swap',
    'SPL tokens',
    'DeFi',
    'blockchain',
    'cryptocurrency exchange',
    'Solana DeFi',
    'token swap',
    'Solana DEX Analytics Template',
  ],
  authors: [{ name: 'Solana DEX Analytics Template' }],
  creator: 'Solana DEX Analytics Template',
  publisher: 'Solana DEX Analytics Template',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    title: 'Solana DEX Analytics Template – Open Source Next.js Starter',
    description: 'Open-source Solana DEX analytics template using Jupiter Ultra, Helius, CoinGecko, and DeFiLlama.',
    siteName: 'Solana DEX Analytics Template',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Solana DEX Analytics Template – Open Source Next.js Starter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solana DEX Analytics Template – Open Source Next.js Starter',
    description: 'Open-source Solana DEX analytics template using Jupiter Ultra, Helius, CoinGecko, and DeFiLlama.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'finance',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} overflow-x-hidden w-full max-w-[100vw]`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SolanaWalletProvider>
              {children}
              <Footer />
            </SolanaWalletProvider>
          </ThemeProvider>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
