import { useWallet } from '@solana/wallet-adapter-react'
import { useRankProgress } from 'atomid-sdk/react'
import { ArrowUp } from 'lucide-react'
import { getRankName, getRankEmoji, formatAtomAmount } from 'atomid-sdk'

export function RankProgress() {
  const { publicKey } = useWallet()
  const { percentage, atomsNeeded, nextRank, loading } = useRankProgress(publicKey || undefined)

  if (!publicKey || loading) {
    return null
  }

  if (nextRank === null) {
    return (
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">♾️</div>
        <h4 className="text-xl font-bold text-white">Maximum Rank Achieved!</h4>
        <p className="text-white/80 mt-2">You've reached Eternal rank</p>
      </div>
    )
  }

  const nextRankName = getRankName(nextRank)
  const nextRankEmoji = getRankEmoji(nextRank)

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">Progress to Next Rank</h4>
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="text-2xl">{nextRankEmoji}</span>
          <span className="font-medium">{nextRankName}</span>
        </div>
      </div>

      <div className="relative">
        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">{percentage.toFixed(1)}% Complete</span>
          <span className="text-cyan-400 font-medium">
            {atomsNeeded ? formatAtomAmount(atomsNeeded) : '0'} ATOM needed
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
        <ArrowUp className="w-4 h-4" />
        <span>Burn more ATOM tokens to increase your rank</span>
      </div>
    </div>
  )
}
