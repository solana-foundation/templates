import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Triangle } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <Triangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AtomID Template</h1>
            <p className="text-xs text-slate-400">Proof-of-Sacrifice Verification</p>
          </div>
        </div>
        <WalletMultiButton />
      </div>
    </header>
  )
}
