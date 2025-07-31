'use client'

import { AirdropClient } from '@/lib/airdrop-client'
import { AIRDROP_CONFIG, validateConfig } from '@/lib/config'
import { useState } from 'react'

export const ClaimButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')

  const claimAirdrop = async () => {
    setIsLoading(true)
    setStatus('Initializing...')

    try {
      validateConfig()

      const client = new AirdropClient({
        privateKey: AIRDROP_CONFIG.PRIVATE_KEY!,
        network: AIRDROP_CONFIG.NETWORK,
      })

      setStatus('Checking if airdrop has already been claimed...')

      // Check if already claimed before attempting to claim
      const alreadyClaimed = await client.checkClaimStatus(AIRDROP_CONFIG.PRIVATE_KEY!)

      if (alreadyClaimed) {
        setStatus('Already claimed')
        return
      }

      setStatus('Claiming airdrop...')

      const result = await client.claimAirdrop(AIRDROP_CONFIG.PRIVATE_KEY!)

      setStatus('Success!')
      console.log('Claim result:', result)
      alert(
        `Airdrop claimed successfully!\nAmount: ${parseInt(result.amount) / 1e9} SOL\nSignature: ${result.signature}`,
      )
    } catch (error) {
      console.error('Error:', error)
      setStatus('Error occurred')
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-2xl font-bold">Airdrop Claim</h2>

      {status && <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded">{status}</div>}

      <button
        onClick={claimAirdrop}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Claiming...' : 'Claim Airdrop'}
      </button>

      <p className="text-xs text-gray-500 max-w-md text-center">
        This will automatically claim your airdrop using the configured private key. Make sure
        NEXT_PUBLIC_USER_PRIVATE_KEY is set in your environment.
      </p>
    </div>
  )
}
