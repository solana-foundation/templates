import { useWallet } from '@solana/wallet-adapter-react'
import { AtomIDGate } from 'atomid-sdk/react'
import { Lock, Crown, Sparkles } from 'lucide-react'
import { getRankName, getRankEmoji, AtomIDRank } from 'atomid-sdk'

interface GatedFeatureProps {
  minRank: AtomIDRank
  title: string
  description: string
  icon: 'lock' | 'crown' | 'sparkles'
}

function GatedFeature({ minRank, title, description, icon }: GatedFeatureProps) {
  const { publicKey } = useWallet()

  const IconComponent = icon === 'crown' ? Crown : icon === 'sparkles' ? Sparkles : Lock
  const rankName = getRankName(minRank)
  const rankEmoji = getRankEmoji(minRank)

  const fallback = (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 opacity-60">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-700 rounded-lg">
          <Lock className="w-6 h-6 text-slate-500" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-300 mb-1">{title}</h4>
          <p className="text-sm text-slate-400 mb-3">{description}</p>
          <div className="flex items-center gap-2 text-amber-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">
              Requires {rankEmoji} {rankName} (Rank {minRank})
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  if (!publicKey) {
    return fallback
  }

  return (
    <AtomIDGate wallet={publicKey} minRank={minRank} fallback={fallback}>
      <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-6 border border-green-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <IconComponent className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
            <p className="text-sm text-green-100 mb-3">{description}</p>
            <div className="flex items-center gap-2 text-green-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Unlocked!</span>
            </div>
          </div>
        </div>
      </div>
    </AtomIDGate>
  )
}

export function GatedContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Gated Features</h3>

      <GatedFeature
        minRank={3}
        title="Early Access Beta"
        description="Get exclusive early access to new features before public release"
        icon="sparkles"
      />

      <GatedFeature
        minRank={5}
        title="Premium Trading Discounts"
        description="Receive 50% off trading fees on all transactions"
        icon="crown"
      />

      <GatedFeature
        minRank={7}
        title="VIP Community Access"
        description="Join our exclusive community of top-tier members with direct team access"
        icon="lock"
      />
    </div>
  )
}
