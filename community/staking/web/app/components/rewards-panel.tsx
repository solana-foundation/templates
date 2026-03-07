'use client'

/**
 * RewardsPanel — shows accumulated rewards and a Claim button.
 *
 * Reads the user's accumulated and claimed rewards from the on-chain
 * UserAccount, computes the claimable amount, and lets the user submit
 * a Claim instruction.
 */

import { useWalletSession, useSendTransaction } from '@solana/react-hooks'
import { createWalletTransactionSigner } from '@solana/client'
import type { StakingState } from '@/app/hooks/use-staking'
import { lamportsToSol } from '@/app/lib/format'
import { getClaimInstructionAsync } from '@/client/vault/index'

type Props = Pick<StakingState, 'user' | 'refresh'>

export function RewardsPanel({ user, refresh }: Props) {
  const session = useWalletSession()
  const { send, isSending, error, reset } = useSendTransaction()

  // On-chain semantics:
  //   accumulated_rewards = remaining unclaimed rewards (decremented on claim)
  //   claimed_rewards     = lifetime total claimed (incremented on claim)
  const claimable = user?.accumulatedRewards ?? 0n
  const claimed = user?.claimedRewards ?? 0n
  const totalEarned = claimable + claimed

  async function handleClaim() {
    if (!session || claimable <= 0n) return
    reset()

    const { signer } = createWalletTransactionSigner(session)

    const ix = await getClaimInstructionAsync({
      user: signer,
      amount: claimable,
    })

    await send({
      instructions: [ix],
      feePayer: signer,
    })

    await refresh()
  }

  if (!session) return null
  if (!user) return null

  return (
    <section className="rounded border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">Rewards</h2>

      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-500">Total Earned</dt>
          <dd className="font-mono">{lamportsToSol(totalEarned)} SOL</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-500">Claimed</dt>
          <dd className="font-mono">{lamportsToSol(claimed)} SOL</dd>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-2 dark:border-zinc-800">
          <dt className="font-medium">Claimable</dt>
          <dd className="font-mono font-medium">{lamportsToSol(claimable)} SOL</dd>
        </div>
      </dl>

      <button
        onClick={handleClaim}
        disabled={isSending || claimable <= 0n}
        className="mt-4 w-full rounded bg-zinc-900 py-2 text-sm font-medium text-white
          hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100
          dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isSending ? 'Claiming…' : 'Claim Rewards'}
      </button>

      {error ? (
        <p className="mt-2 text-xs text-red-600">{error instanceof Error ? error.message : 'Transaction failed'}</p>
      ) : null}
    </section>
  )
}
