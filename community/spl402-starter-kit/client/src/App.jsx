import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useSPL402 } from 'spl402'
import { Zap, Lock, Globe, CheckCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const endpoints = [
  {
    path: '/api/free-data',
    name: 'Free Tier',
    price: 0,
    description: 'No payment required',
    icon: Globe,
    color: 'from-gray-500 to-gray-600',
  },
  {
    path: '/api/premium-data',
    name: 'Premium Tier',
    price: 0.001,
    description: 'Advanced analytics & real-time updates',
    icon: Zap,
    color: 'from-[#9945FF] to-[#7d3dd6]',
  },
  {
    path: '/api/ultra-premium',
    name: 'Ultra Premium',
    price: 0.005,
    description: 'Dedicated manager & custom integrations',
    icon: Lock,
    color: 'from-[#14F195] to-[#0fc978]',
  },
  {
    path: '/api/enterprise-data',
    name: 'Enterprise',
    price: 0.01,
    description: 'White-label & 24/7 dedicated support',
    icon: CheckCircle,
    color: 'from-[#9945FF] to-[#14F195]',
  },
]

export default function App() {
  const wallet = useWallet()
  const { connection } = useConnection()
  const { publicKey } = wallet
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState({})
  const [errors, setErrors] = useState({})

  const { makeRequest } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  })

  const fetchData = async (endpoint) => {
    if (!publicKey && endpoint.price > 0) {
      setErrors({ ...errors, [endpoint.path]: 'Please connect your wallet first' })
      return
    }

    setLoading({ ...loading, [endpoint.path]: true })
    setErrors({ ...errors, [endpoint.path]: null })
    setResponses({ ...responses, [endpoint.path]: null })

    try {
      let response

      if (endpoint.price === 0) {
        response = await fetch(`${API_URL}${endpoint.path}`)
      } else {
        const walletAdapter = {
          publicKey: wallet.publicKey,
          signAndSendTransaction: async (transaction) => {
            const signature = await wallet.sendTransaction(transaction, connection, {
              skipPreflight: false,
            })
            return { signature }
          },
        }

        response = await makeRequest(`${API_URL}${endpoint.path}`, walletAdapter)
      }

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setResponses({ ...responses, [endpoint.path]: data })
    } catch (error) {
      console.error('Error fetching data:', error)
      setErrors({ ...errors, [endpoint.path]: error.message })
    } finally {
      setLoading({ ...loading, [endpoint.path]: false })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
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

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-2">
            <h2 className="text-5xl font-black">
              Try{' '}
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">spl402</span>{' '}
              on Mainnet
            </h2>
            <p className="text-xl text-gray-400 mt-4">
              Click any tier to fetch data. Premium tiers require SOL payment.
            </p>
          </div>

          <div className="border-t border-white/10 py-6">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <a
                    href="https://spl402.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Globe size={18} />
                    <span className="text-base">Website</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://x.com/spl402"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-base">Twitter</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://github.com/astrohackerx/spl402"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span className="text-base">GitHub</span>
                    <ExternalLink size={14} />
                  </a>
                  <a
                    href="https://www.npmjs.com/package/spl402"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                    </svg>
                    <span className="text-base">npm</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {endpoints.map((endpoint) => {
              const Icon = endpoint.icon
              const isLoading = loading[endpoint.path]
              const response = responses[endpoint.path]
              const error = errors[endpoint.path]

              return (
                <div key={endpoint.path} className="group relative">
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${endpoint.color} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur`}
                  />
                  <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${endpoint.color} rounded-xl flex items-center justify-center`}
                        >
                          <Icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{endpoint.name}</h3>
                          <p className="text-sm text-gray-400">{endpoint.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold bg-gradient-to-r ${endpoint.color} text-transparent bg-clip-text`}
                        >
                          {endpoint.price === 0 ? 'FREE' : `${endpoint.price} SOL`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => fetchData(endpoint)}
                      disabled={isLoading}
                      className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        endpoint.price === 0
                          ? 'bg-white/10 hover:bg-white/20'
                          : `bg-gradient-to-r ${endpoint.color} hover:opacity-90`
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Fetch Data</>
                      )}
                    </button>

                    {error && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertCircle size={16} />
                          <span className="text-sm font-medium">{error}</span>
                        </div>
                      </div>
                    )}

                    {response && (
                      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-xs text-gray-400 mb-2">Response:</div>
                        <pre className="text-xs text-gray-300 overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">How it works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#9945FF]">
                  1
                </div>
                <h4 className="font-bold mb-2">Connect Wallet</h4>
                <p className="text-sm text-gray-400">Connect your Solana wallet (Phantom, Solflare, etc.)</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-[#14F195]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#14F195]">
                  2
                </div>
                <h4 className="font-bold mb-2">Choose Tier</h4>
                <p className="text-sm text-gray-400">Select a tier and click "Fetch Data" to make a request</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#9945FF]">
                  3
                </div>
                <h4 className="font-bold mb-2">Automatic Payment</h4>
                <p className="text-sm text-gray-400">SPL-402 handles payment verification automatically</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-white/10 py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <a
                  href="https://spl402.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Globe size={18} />
                  <span className="text-lg">Website</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://x.com/spl402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-lg">Twitter</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://github.com/astrohackerx/spl402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span className="text-lg">GitHub</span>
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.npmjs.com/package/spl402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                  </svg>
                  <span className="text-lg">npm</span>
                  <ExternalLink size={14} />
                </a>
              </div>
              <div className="text-lg text-gray-400">
                Powered by{' '}
                <span className="font-semibold bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
                  SOLANA
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
