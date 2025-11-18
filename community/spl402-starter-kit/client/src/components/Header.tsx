import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-lg flex items-center justify-center font-mono font-bold">
            402
          </div>
          <div>
            <h1 className="text-lg font-bold">spl402</h1>
            <p className="text-xs text-gray-400">Mainnet Starter Kit</p>
          </div>
        </div>
        <WalletMultiButton />
      </div>
    </div>
  )
}
