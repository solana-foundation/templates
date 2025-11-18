import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useSPL402 } from 'spl402'
import { Zap, Lock, Globe, CheckCircle } from 'lucide-react'
import Header from './components/Header'
import TierCard from './components/TierCard'
import SocialLinks from './components/SocialLinks'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import type { Endpoint, ResponseData, LoadingState, ErrorState } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const endpoints: Endpoint[] = [
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
  const [responses, setResponses] = useState<ResponseData>({})
  const [loading, setLoading] = useState<LoadingState>({})
  const [errors, setErrors] = useState<ErrorState>({})

  const { makeRequest } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  })

  const fetchData = async (endpoint: Endpoint) => {
    if (!publicKey && endpoint.price > 0) {
      setErrors({ ...errors, [endpoint.path]: 'Please connect your wallet first' })
      return
    }

    setLoading({ ...loading, [endpoint.path]: true })
    setErrors({ ...errors, [endpoint.path]: null })
    setResponses({ ...responses, [endpoint.path]: null })

    try {
      let response: Response

      if (endpoint.price === 0) {
        response = await fetch(`${API_URL}${endpoint.path}`)
      } else {
        const walletAdapter = {
          publicKey: wallet.publicKey,
          signAndSendTransaction: async (transaction: any) => {
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
      setErrors({ ...errors, [endpoint.path]: (error as Error).message })
    } finally {
      setLoading({ ...loading, [endpoint.path]: false })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

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
                <SocialLinks />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {endpoints.map((endpoint) => (
              <TierCard
                key={endpoint.path}
                endpoint={endpoint}
                isLoading={loading[endpoint.path] || false}
                error={errors[endpoint.path] || null}
                response={responses[endpoint.path]}
                onFetchData={() => fetchData(endpoint)}
              />
            ))}
          </div>

          <HowItWorks />
        </div>

        <Footer />
      </div>
    </div>
  )
}
