import { Navbar } from '@/components/navbar'
import { StatsBar } from '@/components/stats-bar'
import SwapInterface from '@/components/swap-interface'
import { TrendingTokens } from '@/components/trending-tokens'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solana DEX Analytics Template | Next.js + Jupiter Ultra + Helius',
  description: 'Open-source Solana DEX analytics template powered by Jupiter Ultra, Helius, CoinGecko, and DeFiLlama.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-[100vw]">
      <Navbar />
      <div className="pt-12">
        <StatsBar />
        <TrendingTokens />
        <main className="flex items-center justify-center p-4 pt-8 w-full max-w-full">
          <SwapInterface />
        </main>
      </div>
    </div>
  )
}
