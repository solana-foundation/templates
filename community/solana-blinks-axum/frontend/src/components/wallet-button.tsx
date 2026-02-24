'use client'

import { useState, useRef, useEffect } from 'react'
import { useWallet } from '@/components/providers'

export function WalletButton() {
  const { wallets, account, connected, connect, disconnect } = useWallet()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (connected && account) {
    const addr = account.address
    const short = `${addr.slice(0, 4)}...${addr.slice(-4)}`
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 rounded-xl bg-surface-input border border-border text-text-primary text-sm font-medium hover:border-border-focus transition-colors"
      >
        {short}
      </button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
      >
        Connect Wallet
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {wallets.length === 0 && <div className="px-4 py-3 text-sm text-text-muted">No wallets found</div>}
          {wallets.map((w) => (
            <button
              key={w.name}
              onClick={async () => {
                try {
                  await connect(w)
                } catch (e) {
                  console.error('Failed to connect:', e)
                }
                setOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-input transition-colors text-left"
            >
              {w.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.icon} alt="" className="w-6 h-6 rounded" />
              )}
              <span className="text-sm text-text-primary">{w.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
