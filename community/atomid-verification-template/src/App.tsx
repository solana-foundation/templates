import { AtomIDProvider } from 'atomid-sdk/react'
import { WalletContextProvider } from './components/WalletProvider'
import { Header } from './components/Header'
import { RankDisplay } from './components/RankDisplay'
import { RankProgress } from './components/RankProgress'
import { GatedContent } from './components/GatedContent'
import { RankTable } from './components/RankTable'
import { UseCases } from './components/UseCases'
import { Leaderboard } from './components/Leaderboard'
import { ExternalLink } from 'lucide-react'

function App() {
  const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'

  return (
    <WalletContextProvider>
      <AtomIDProvider config={{ rpcUrl }}>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <Header />

          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">AtomID Verification Template</h2>
              <p className="text-slate-400 mb-3">
                Permanent onchain identity powered by Solana Attestation Service. Experience soulbound credentials and
                proof-of-sacrifice verification.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  SAS Integration
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  PDA-Owned Attestation
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Soulbound Identity
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Proof of Sacrifice
                </span>
              </div>
              <a
                href="https://lostatom.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Learn more about Lost Bitcoin Layer</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 space-y-6">
                <RankDisplay />
                <RankProgress />
                <GatedContent />
                <UseCases />
              </div>

              <div className="mb-8">
                <Leaderboard />
              </div>

              <div className="space-y-6">
                <RankTable />

                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-3">About AtomID</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    AtomID is the first PDA-owned attestation issuer on Solana, creating permanent soulbound identities
                    through proof-of-sacrifice. Built on the Solana Attestation Service (SAS), it provides autonomous,
                    verifiable credentials that prove irreversible commitment.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://github.com/astrohackerx/AtomID"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>GitHub Repository</span>
                    </a>
                    <a
                      href="https://www.npmjs.com/package/atomid-sdk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>NPM Package</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
              <p>Built for the Lost Bitcoin Layer ecosystem 🜂</p>
            </footer>
          </main>
        </div>
      </AtomIDProvider>
    </WalletContextProvider>
  )
}

export default App
