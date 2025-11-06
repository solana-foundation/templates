'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import WalletContextProvider from '../components/WalletContextProvider'
import SwapInterface from '../components/SwapInterface'
import CrossmintSwapInterface from '../components/CrossmintSwapInterface'

// Dynamically import WalletMultiButton to avoid SSR issues
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false },
)

export default function Home() {
  const [swapMode, setSwapMode] = useState<'standard' | 'crossmint'>('standard')

  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-black flex flex-col p-4">
        {/* Top Navigation Bar */}
        <div className="w-full max-w-6xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Gill + Jupiter Swap</h2>
              <p className="text-gray-500 text-xs">Powered by Jupiter</p>
            </div>
            <div className="wallet-adapter-button-wrapper">
              <WalletMultiButton />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #fb923c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Gill + Jupiter
              </h1>
              <p className="text-gray-400 text-sm mb-4">Solana Swap powered by Jupiter Plugin</p>

              {/* Swap Mode Toggle */}
              <div className="flex gap-2 justify-center mb-4">
                <button
                  onClick={() => setSwapMode('standard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    swapMode === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Standard Wallets
                </button>
                <button
                  onClick={() => setSwapMode('crossmint')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    swapMode === 'crossmint'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Crossmint
                </button>
              </div>
            </div>

            {/* Swap Interface */}
            {swapMode === 'standard' ? <SwapInterface /> : <CrossmintSwapInterface />}

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-xs">
                Powered by{' '}
                <a
                  href="https://jup.ag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Jupiter
                </a>
                {' + '}
                <a
                  href="https://github.com/solana-developers/solana-rpc-get-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Gill
                </a>
                {swapMode === 'crossmint' && (
                  <>
                    {' + '}
                    <a
                      href="https://crossmint.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Crossmint
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </WalletContextProvider>
  )
}
