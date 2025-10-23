import type { Metadata } from 'next'
import { JsonLd } from '../jsonld'

export const metadata: Metadata = {
  title: 'Solana DEX Analytics: Volume & Protocol Metrics | Template',
  description:
    'Explore Solana DEX analytics: real-time volumes, protocol rankings, 7d/30d trends, and breakdowns. Data powered by DeFi Llama.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dex-analytics`,
  },
  openGraph: {
    title: 'Solana DEX Analytics | Template',
    description: 'Track Solana decentralized exchange volumes, market share and history across protocols.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dex-analytics`,
    siteName: 'Solana DEX Analytics Template',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solana DEX Analytics | Template',
    description: 'Live Solana DEX metrics: volume, market share, history, and protocol trends.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    // Low-competition, long-tail
    'solana dex analytics',
    'solana dex volume dashboard',
    'solana protocol volume trends',
    'solana decentralized exchange analytics',
    'defi llama solana dex data',
  ],
}

export default function DexAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd />
      {children}
    </>
  )
}
