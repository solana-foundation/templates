'use client'

import { Button } from '@/components/ui/button'
import { useConnectWallet, useWallet, useDisconnectWallet } from '@solana/react-hooks'
import { useState } from 'react'
import { ellipsify } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

const CONNECTORS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'wallet-standard:phantom', label: 'Phantom' },
  { id: 'wallet-standard:solflare', label: 'Solflare' },
  { id: 'wallet-standard:backpack', label: 'Backpack' },
]

export function WalletUI() {
  const wallet = useWallet()
  const connectWallet = useConnectWallet()
  const disconnectWallet = useDisconnectWallet()
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const isConnected = wallet.status === 'connected'

  const address = isConnected ? wallet.session.account.address.toString() : null

  async function handleConnect(connectorId: string) {
    setError(null)
    try {
      await connectWallet(connectorId)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect')
    }
  }

  async function handleDisconnect() {
    setError(null)
    if (isConnected) {
      await disconnectWallet()
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer bg-foreground text-white shadow-md hover:bg-vibrant-red/80 transition-colors duration-300 min-w-[160px]"
      >
        {address ? (
          <span className="font-mono max-w-[12ch] truncate">{ellipsify(address)}</span>
        ) : (
          <span>connect wallet</span>
        )}
        {open ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
      </Button>

      {open ? (
        <div className="absolute right-0 z-10 mt-2 w-full min-w-[240px] rounded-lg border border-gray-200 bg-white shadow-lg">
          {isConnected ? (
            <div className="space-y-2 p-2">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                <p className="text-xs font-medium text-neutral-500 mb-1">Connected</p>
                <p className="font-mono text-sm text-neutral-900 max-w-[18ch] truncate">{ellipsify(address ?? '')}</p>
              </div>
              <Button
                type="button"
                onClick={handleDisconnect}
                variant="outline"
                className="cursor-pointer shadow-none w-full"
              >
                disconnect
              </Button>
            </div>
          ) : (
            <div className=" pb-2">
              <p className="text-xs font-medium text-neutral-500 px-3 py-2">Choose Wallet</p>
              <div className="space-y-1.5">
                {CONNECTORS.map((connector) => (
                  <Button
                    key={connector.id}
                    type="button"
                    onClick={() => void handleConnect(connector.id)}
                    variant="outline"
                    className="cursor-pointer shadow-none border-0 w-full justify-between hover:bg-neutral-50"
                  >
                    <span>{connector.label.toLowerCase()}</span>
                    <span className="text-xs text-neutral-400">→</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
