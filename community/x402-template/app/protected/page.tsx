'use client'

import Link from 'next/link'

export default function ProtectedPage() {
  const handleTestPaywallAgain = async () => {
    await fetch('/api/clear-payment', { method: 'POST' })
    window.location.href = '/protected'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#14F195] to-[#9945FF] font-sans">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Premium Content! 🎉</h1>

          <p className="text-xl text-gray-600 mb-8">
            Your payment was successful! You now have access to this exclusive content.
          </p>

          {/* Premium Content Box */}
          <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-xl p-8 mb-8 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔓 Exclusive Content Unlocked</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This is your premium, paid content area. You paid 0.01 USDC on Solana Devnet using the x402 payment
              protocol to access this page.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This demonstrates a working implementation of micropayments on Solana with seamless wallet integration via
              Phantom. Your payment was verified on-chain and you&apos;ve been granted access for 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">$0.01</div>
              <div className="text-sm text-gray-600 mt-1">USDC Paid</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">402</div>
              <div className="text-sm text-gray-600 mt-1">x402 Protocol</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-[#14F195] to-[#9945FF] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
            <button
              onClick={handleTestPaywallAgain}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Test Paywall Again
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
