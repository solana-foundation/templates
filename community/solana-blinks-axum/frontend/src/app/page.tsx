'use client'

import { useEffect, useState } from 'react'
import { WalletButton } from '@/components/wallet-button'
import { BlinkCard } from '@/components/blink-card'
import { fetchActionsJson } from '@/lib/actions'
import { ACTIONS_API } from '@/lib/constants'
import type { ActionRule } from '@/lib/types'

export default function Home() {
  const [rules, setRules] = useState<ActionRule[]>([])
  const [customUrl, setCustomUrl] = useState('')
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([])
  const [customUrls, setCustomUrls] = useState<string[]>([])

  useEffect(() => {
    fetchActionsJson(ACTIONS_API)
      .then((json) => {
        setRules(json.rules)
        const urls = json.rules.filter((r) => !r.apiPath.includes('*')).map((r) => `${ACTIONS_API}${r.apiPath}`)
        setDiscoveredUrls(urls)
      })
      .catch(console.error)
  }, [])

  const addCustomAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (customUrl.trim()) {
      setCustomUrls((prev) => [...prev, customUrl.trim()])
      setCustomUrl('')
    }
  }

  const removeCustomAction = (url: string) => {
    setCustomUrls((prev) => prev.filter((u) => u !== url))
  }

  const allUrls = [...discoveredUrls, ...customUrls]

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solana Blinks</h1>
          <p className="text-sm text-text-secondary mt-1">Actions rendered from your Axum backend</p>
        </div>
        <WalletButton />
      </div>

      {/* Load custom action URL */}
      <form onSubmit={addCustomAction} className="flex gap-2">
        <input
          type="url"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Paste an action URL..."
          className="flex-1 px-3 py-2 rounded-xl bg-surface-input border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
        >
          Load
        </button>
      </form>

      {/* Discovered actions list */}
      {rules.length > 0 && (
        <div className="text-xs text-text-muted space-y-1">
          <div className="font-medium text-text-secondary">Discovered actions:</div>
          {rules.map((r, i) => (
            <div key={i} className="font-mono">
              {r.pathPattern} - {r.apiPath}
            </div>
          ))}
        </div>
      )}

      {/* Blink Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {discoveredUrls.map((url) => (
          <BlinkCard key={url} actionUrl={url} />
        ))}
        {customUrls.map((url) => (
          <BlinkCard key={url} actionUrl={url} onRemove={() => removeCustomAction(url)} />
        ))}
      </div>

      {allUrls.length === 0 && (
        <div className="text-center text-text-muted py-16">
          <p>No actions loaded yet.</p>
          <p className="text-sm mt-1">
            Make sure the Axum backend is running on <code className="text-text-secondary">{ACTIONS_API}</code>
          </p>
        </div>
      )}
    </main>
  )
}
