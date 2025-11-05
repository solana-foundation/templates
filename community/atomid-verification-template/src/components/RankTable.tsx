import { getRankName, getRankEmoji, getRankThreshold, formatAtomAmount } from 'atomid-sdk'

export function RankTable() {
  const ranks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">AtomID Rank System</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-2 text-slate-400 font-medium text-sm">Rank</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium text-sm">Name</th>
              <th className="text-right py-3 px-2 text-slate-400 font-medium text-sm">ATOM Required</th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((rank) => {
              const name = getRankName(rank)
              const emoji = getRankEmoji(rank)
              const threshold = getRankThreshold(rank)

              return (
                <tr key={rank} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-2">
                    <span className="text-2xl">{emoji}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{name}</span>
                      <span className="text-slate-500 text-sm">({rank})</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-cyan-400 font-mono">{formatAtomAmount(threshold)}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-slate-900 rounded-lg">
        <p className="text-sm text-slate-400">
          Ranks are determined by the total amount of ATOM tokens burned on the Solana blockchain. Higher ranks unlock
          exclusive features and benefits across the ecosystem.
        </p>
      </div>
    </div>
  )
}
