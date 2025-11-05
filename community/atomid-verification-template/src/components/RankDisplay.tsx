import { useWallet } from '@solana/wallet-adapter-react'
import { useAtomIDRank } from 'atomid-sdk/react'
import { formatAtomAmount } from 'atomid-sdk'
import { Loader2 } from 'lucide-react'

export function RankDisplay() {
  const { publicKey } = useWallet()
  const { rank, rankName, rankEmoji, totalBurned, loading } = useAtomIDRank(publicKey || undefined)

  if (!publicKey) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 text-center">
        <p className="text-slate-400">Connect your wallet to view your AtomID rank</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-8 border border-slate-700">
      <div className="text-center">
        <div className="text-6xl mb-4">{rankEmoji}</div>
        <h3 className="text-3xl font-bold text-white mb-2">{rankName}</h3>
        <p className="text-slate-400 mb-4">Rank {rank}/9</p>
        <div className="bg-slate-800 rounded-lg p-4 inline-block">
          <p className="text-sm text-slate-400 mb-1">Total ATOM Burned</p>
          <p className="text-2xl font-bold text-cyan-400">{totalBurned ? formatAtomAmount(totalBurned) : '0'}</p>
        </div>
      </div>
    </div>
  )
}
