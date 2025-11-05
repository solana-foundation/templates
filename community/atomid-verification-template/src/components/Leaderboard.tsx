import { useEffect, useState } from 'react'
import { AtomIDClient } from 'atomid-sdk'
import { formatAtomAmount } from 'atomid-sdk'
import { Trophy, Loader2, RefreshCw } from 'lucide-react'
import type { AtomIDAccount } from 'atomid-sdk'

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<AtomIDAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchLeaderboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      const client = new AtomIDClient({ rpcUrl })
      const data = await client.getLeaderboard(10)
      setLeaderboard(data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const handleRefresh = () => {
    fetchLeaderboard(true)
  }

  const getRankEmoji = (rank: number) => {
    const emojis = ['🌱', '🔥', '💎', '🛡️', '🗝️', '🔮', '⚡', '🌟', '👑', '♾️']
    return emojis[rank] || '🌱'
  }

  const getRankName = (rank: number) => {
    const names = [
      'Initiate',
      'Believer',
      'Devotee',
      'Guardian',
      'Keeper',
      'Oracle',
      'Architect',
      'Sage',
      'Ascended',
      'Eternal',
    ]
    return names[rank] || 'Unknown'
  }

  const getMedalIcon = (position: number) => {
    if (position === 0) return '🥇'
    if (position === 1) return '🥈'
    if (position === 2) return '🥉'
    return `#${position + 1}`
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            <p className="text-sm text-slate-400">Top 10 AtomID Holders</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh leaderboard"
        >
          <RefreshCw className={`w-5 h-5 text-slate-300 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium text-sm">Position</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium text-sm">Wallet</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium text-sm">Rank</th>
              <th className="text-right py-3 px-2 text-slate-400 font-medium text-sm">ATOM Burned</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((account, index) => {
              const rankName = getRankName(account.rank)
              const rankEmoji = getRankEmoji(account.rank)
              const isTopThree = index < 3

              return (
                <tr
                  key={account.wallet.toString()}
                  className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                    isTopThree ? 'bg-slate-700/20' : ''
                  }`}
                >
                  <td className="py-4 px-2">
                    <span className="text-xl font-bold">{getMedalIcon(index)}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-white font-mono text-sm">
                      {account.wallet.toString().slice(0, 4)}...{account.wallet.toString().slice(-4)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rankEmoji}</span>
                      <div>
                        <p className="text-white font-medium text-sm">{rankName}</p>
                        <p className="text-slate-500 text-xs">Rank {account.rank}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="text-cyan-400 font-mono font-semibold">
                      {formatAtomAmount(account.totalBurned)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">No leaderboard data available</p>
        </div>
      )}
    </div>
  )
}
