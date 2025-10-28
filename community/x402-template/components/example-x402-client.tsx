/**
 * Example client component showing how to make paid API requests
 * This demonstrates how to use x402-solana client with your local facilitator
 */

'use client'

import { useState } from 'react'

// If you want to use x402-solana client library, install it first:
// pnpm add x402-solana @privy-io/react-auth
//
// import { createX402Client } from 'x402-solana/client';
// import { useSolanaWallets } from '@privy-io/react-auth/solana';

export function ExampleX402Client() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Example: Using x402-solana client (requires installing the library)
  // const { wallets } = useSolanaWallets();
  // const wallet = wallets[0];
  //
  // const makePaidRequest = async () => {
  //   setLoading(true);
  //   try {
  //     const client = createX402Client({
  //       wallet,
  //       network: 'solana-devnet',
  //       maxPaymentAmount: BigInt(10_000_000), // max 10 USDC
  //     });
  //
  //     const response = await client.fetch('/api/example-paid-endpoint', {
  //       method: 'POST',
  //       body: JSON.stringify({ data: 'test request' }),
  //     });
  //
  //     const result = await response.json();
  //     setResult(JSON.stringify(result, null, 2));
  //   } catch (error) {
  //     setResult(`Error: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Example: Manual implementation (without x402-solana library)
  const makePaidRequestManual = async () => {
    setLoading(true)
    setResult('Making payment...')

    try {
      // First request - get payment requirements
      const initialResponse = await fetch('/api/example-paid-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: 'test request' }),
      })

      if (initialResponse.status === 402) {
        const requirements = await initialResponse.json()
        setResult('Payment required. Please use the /protected route to test the full payment flow.')
        console.log('Payment requirements:', requirements)
      } else {
        const result = await initialResponse.json()
        setResult(JSON.stringify(result, null, 2))
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">x402 Paid API Example</h2>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Click the button to make a paid API request</li>
          <li>If payment is required, you&apos;ll get a 402 response</li>
          <li>The x402 client automatically handles the payment</li>
          <li>After payment, the request is retried and succeeds</li>
        </ol>
      </div>

      <button
        onClick={makePaidRequestManual}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Processing...' : 'Make Paid Request ($2.50 USDC)'}
      </button>

      {result && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto text-sm">{result}</pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-900 mb-2">Note:</h3>
        <p className="text-sm text-yellow-800">
          For a complete payment flow, visit{' '}
          <a href="/protected" className="underline">
            /protected
          </a>{' '}
          which uses the x402 middleware with your custom facilitator.
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Facilitator: {process.env.NEXT_PUBLIC_FACILITATOR_URL || 'http://localhost:3000/api/facilitator'}</p>
        <p>Network: Solana Devnet</p>
      </div>
    </div>
  )
}
