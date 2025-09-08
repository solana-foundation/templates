import { AppHero } from '@/components/app-hero'

export default function Page() {
  return (
    <div>
      <AppHero title="Solana Quickstart" subtitle="Minimal Solana dApp: connect your wallet and start building." />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 w-fit mx-auto">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white transition-transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <h3 className="text-xl font-bold mb-2">Gill Docs →</h3>
              <p className="text-purple-100 text-sm">
                Modern JavaScript/TypeScript client library for Solana blockchain
              </p>
              <a
                href="https://gill.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label="Visit Gill Documentation"
              />
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 p-6 text-white transition-transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <h3 className="text-xl font-bold mb-2">Get SOL on testnet →</h3>
              <p className="text-cyan-100 text-sm">Get testnet tokens to use when testing your smart contracts</p>
              <a
                href="https://faucet.solana.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label="Visit Solana Faucet"
              />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-rose-600 p-6 text-white md:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <h3 className="text-xl font-bold mb-4">Developer Resources</h3>
            <div className="space-y-3 text-sm">
              <a
                href="https://github.com/wallet-ui/wallet-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-100 hover:text-white transition-colors"
              >
                <span>→</span> Wallet UI Components
              </a>
              <a
                href="https://github.com/codama-idl/codama"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-100 hover:text-white transition-colors"
              >
                <span>→</span> Codama IDL Generator
              </a>
              <a
                href="https://www.anchor-lang.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-100 hover:text-white transition-colors"
              >
                <span>→</span> Anchor Framework Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
