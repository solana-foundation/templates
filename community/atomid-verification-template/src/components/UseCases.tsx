import { useWallet } from '@solana/wallet-adapter-react'
import { useAtomIDRank } from 'atomid-sdk/react'
import { TrendingUp, Vote, Tag, Users, Shield } from 'lucide-react'

export function UseCases() {
  const { publicKey } = useWallet()
  const { rank } = useAtomIDRank(publicKey || undefined)

  const useCases = [
    {
      icon: Tag,
      title: 'NFT Mint Discounts',
      description: 'Get discounts on NFT mints based on your rank',
      calculation: `${rank * 10}% discount`,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Vote,
      title: 'DAO Voting Power',
      description: 'Your votes carry more weight in governance',
      calculation: `${1 + rank * 2}x voting power`,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Trading Fee Reduction',
      description: 'Lower fees on all trading activities',
      calculation: `${Math.max(10, 100 - rank * 10)}% of base fee`,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Community Access',
      description: 'Unlock exclusive Discord roles and channels',
      calculation: rank >= 5 ? 'Premium Access' : 'Standard Access',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Reputation Score',
      description: 'Build credibility in the ecosystem',
      calculation: `${rank * 10}/90 credibility`,
      color: 'from-amber-500 to-yellow-500',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Use Case Examples</h3>
        {publicKey && <span className="text-sm text-slate-400">Based on your current rank</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {useCases.map((useCase) => {
          const Icon = useCase.icon
          return (
            <div
              key={useCase.title}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-gradient-to-br ${useCase.color} rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold mb-1">{useCase.title}</h4>
                  <p className="text-sm text-slate-400 mb-2">{useCase.description}</p>
                  {publicKey && (
                    <div className="inline-block px-3 py-1 bg-slate-900 rounded-full">
                      <span className="text-sm font-mono text-cyan-400">{useCase.calculation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-slate-700">
        <p className="text-sm text-slate-300 leading-relaxed">
          These are examples of how dApps can integrate AtomID to create tiered access, rewards, and reputation systems
          based on user commitment to the ecosystem.
        </p>
      </div>
    </div>
  )
}
