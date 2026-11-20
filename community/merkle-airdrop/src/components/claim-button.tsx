'use client'

import { useAirdropClaim } from '@/hooks/useAirdropClaim'
import { cluster } from '@/lib/solana-client'

export function ClaimButton() {
  const { isLoading, status, signature, canClaim, handleClaimAirdrop } = useAirdropClaim()
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Airdrop Claim</h1>
      <span className="text-sm">{cluster}</span>
      {status && (
        <p role="status" className="break-words text-sm">
          {status}
        </p>
      )}
      <button
        type="button"
        onClick={() => void handleClaimAirdrop()}
        disabled={isLoading || !canClaim}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:opacity-50"
      >
        {isLoading ? 'Claiming...' : 'Claim Airdrop'}
      </button>
      {!canClaim && <p>Connect a wallet with V1 transaction support to claim.</p>}
      {signature && (
        <a
          className="underline"
          href={`https://explorer.solana.com/tx/${signature}?cluster=${cluster}`}
          target="_blank"
          rel="noreferrer"
        >
          View transaction
        </a>
      )}
    </section>
  )
}
