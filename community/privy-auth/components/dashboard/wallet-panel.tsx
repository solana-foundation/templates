'use client'

import { useState, useEffect } from 'react'
import { useWallets, useCreateWallet } from '@privy-io/react-auth/solana'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, Check, Loader2 } from 'lucide-react'
import { truncateAddress } from '@/lib/utils'

const connection = new Connection('https://api.devnet.solana.com')

export function WalletPanel() {
  const { ready: walletsReady, wallets } = useWallets()
  const { createWallet } = useCreateWallet()
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)

  const wallet = wallets[0]

  useEffect(() => {
    if (!wallet?.address) return
    let cancelled = false
    setBalanceLoading(true)
    connection
      .getBalance(new PublicKey(wallet.address))
      .then((lamports) => {
        if (!cancelled) setBalance(lamports / LAMPORTS_PER_SOL)
      })
      .catch(() => {
        if (!cancelled) setBalance(null)
      })
      .finally(() => {
        if (!cancelled) setBalanceLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [wallet?.address])

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const textarea = document.createElement('textarea')
      textarea.value = address
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCreateWallet = async () => {
    setIsCreating(true)
    setCreateError(null)
    try {
      await createWallet()
    } catch (err) {
      console.error('Failed to create wallet:', err)
      setCreateError('Failed to create wallet. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (!walletsReady) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Wallet</CardTitle>
          <Badge variant="secondary" className="gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Devnet
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {wallet ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Wallet Address</p>
            <div className="flex items-center gap-2">
              <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm">{truncateAddress(wallet.address)}</p>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleCopy(wallet.address)}
                aria-label="Copy wallet address"
              >
                {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Balance</p>
              <p className="font-mono text-sm">
                {balanceLoading ? (
                  <Skeleton className="inline-block h-4 w-20" />
                ) : balance !== null ? (
                  `${balance.toFixed(4)} SOL`
                ) : (
                  <span className="text-muted-foreground">Unavailable</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">No wallet found</p>
            <Button onClick={handleCreateWallet} disabled={isCreating} size="sm">
              {isCreating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Wallet'
              )}
            </Button>
            {createError && <p className="text-xs text-destructive">{createError}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
