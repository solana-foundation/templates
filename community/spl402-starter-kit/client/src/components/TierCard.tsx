import { Loader2, AlertCircle } from 'lucide-react'
import type { Endpoint } from '../types'

interface TierCardProps {
  endpoint: Endpoint
  isLoading: boolean
  error: string | null
  response: unknown
  onFetchData: () => void
}

export default function TierCard({ endpoint, isLoading, error, response, onFetchData }: TierCardProps) {
  const Icon = endpoint.icon

  return (
    <div className="group relative">
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
            <div className={`text-lg font-bold bg-gradient-to-r ${endpoint.color} text-transparent bg-clip-text`}>
              {endpoint.price === 0 ? 'FREE' : `${endpoint.price} SOL`}
            </div>
          </div>
        </div>

        <button
          onClick={onFetchData}
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
}
