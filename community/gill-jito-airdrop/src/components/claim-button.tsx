'use client'

import { useAirdropClaim } from '@/hooks/useAirdropClaim'

export const ClaimButton = () => {
  const { isLoading, status, handleClaimAirdrop } = useAirdropClaim()

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-2xl font-bold">Airdrop Claim</h2>

      {status && <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded">{status}</div>}

      <button
        onClick={handleClaimAirdrop}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Claiming...' : 'Claim Airdrop'}
      </button>

      <p className="text-xs text-gray-500 max-w-md text-center">
        This will automatically claim your airdrop using the configured private key. Make sure USER_PRIVATE_KEY is set
        in your environment.
      </p>
    </div>
  )
}
