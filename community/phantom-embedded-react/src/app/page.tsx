'use client'

import Image from 'next/image'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-bg-page to-bg-surface p-4 sm:p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Theme Toggle - Top Right */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="text-center py-8 sm:py-12">
          <div className="flex justify-center mb-6">
            <Image src="/phantom-logo.png" alt="Phantom Logo" width={80} height={80} priority />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-ink">Phantom Embedded Wallet</h1>
          <p className="text-lg text-muted">Sign in with Google, Apple, or Phantom to get started</p>
        </header>

        {/* Main Card */}
        <div className="bg-bg-surface rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="space-y-6">
            {/* Connect Button */}
            <div className="flex justify-center">
              <ConnectWalletButton />
            </div>

            {/* Info Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-ink">Getting Started</h2>
              <ul className="space-y-3 text-text-default">
                <li className="flex items-start gap-3">
                  <span className="text-brand font-bold">1.</span>
                  <span>Click "Login with Phantom" above</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand font-bold">2.</span>
                  <span>Choose your sign-in method (Google, Apple, Phantom, or discovered wallets)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand font-bold">3.</span>
                  <span>Start building your dApp!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-text-muted">
          <p>
            Built with{' '}
            <a
              href="https://docs.phantom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              Phantom Connect SDK
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
