'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, ellipsify } from '@/lib/utils'
import { useAuth } from '@/components/auth/auth-provider'
import { useCombinedSignOut } from '@/hooks/use-combined-signout'
import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useIsWalletReady,
  useWallets,
} from '@solana/kit-plugin-wallet/react'
import { getWalletForHandle } from '@wallet-standard/ui-registry'
import { useSolana } from './provider'
import { toast } from 'sonner'

function WalletAvatar({ className, icon, label }: { className?: string; icon?: string; label?: string }) {
  return (
    <Avatar className={cn('rounded-md h-6 w-6', className)}>
      {icon ? <AvatarImage src={icon} alt={label} /> : null}
      <AvatarFallback>{label?.[0] ?? '?'}</AvatarFallback>
    </Avatar>
  )
}

const walletIds = new WeakMap<object, number>()
let nextWalletId = 0
function walletId(wallet: object) {
  if (!walletIds.has(wallet)) walletIds.set(wallet, nextWalletId++)
  return walletIds.get(wallet)
}

function WalletDropdown() {
  const { client } = useSolana()
  const wallets = useWallets(client)
  const wallet = useConnectedWallet(client)
  const ready = useIsWalletReady(client)
  const { dispatchAsync: connect, isRunning: connecting } = useConnect(client)
  const { dispatchAsync: disconnect, isRunning: disconnecting } = useDisconnect(client)
  const connected = Boolean(wallet)
  const { user } = useAuth()
  const { handleSignOut } = useCombinedSignOut()
  const [signingOut, setSigningOut] = React.useState(false)
  const busy = React.useRef(false)
  const handleConnect = async (candidate: (typeof wallets)[number]) => {
    try {
      await connect(candidate)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const handleDisconnect = async () => {
    if (busy.current) return
    busy.current = true
    setSigningOut(true)
    try {
      if (user) {
        await handleSignOut()
      } else {
        await disconnect()
      }
    } catch (error) {
      toast.error(`Disconnect failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      busy.current = false
      setSigningOut(false)
    }
  }

  const handleCopy = async () => {
    const address = wallet?.account.address.toString()
    if (!address) return
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(address)
      toast.success('Address copied')
    }
  }

  const displayLabel = connected
    ? wallet?.account
      ? ellipsify(wallet.account.address.toString())
      : (wallet?.wallet.name ?? 'Wallet')
    : 'Select Wallet'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={!ready || connecting || disconnecting || signingOut}
        >
          {wallet?.wallet.icon ? <WalletAvatar icon={wallet.wallet.icon} label={wallet.wallet.name} /> : null}
          {displayLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {connected ? (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={handleCopy}>
              Copy address
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleDisconnect}>
              {user ? 'Sign Out & Disconnect' : 'Disconnect'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {wallets.length ? (
          wallets.map((candidate) => (
            <DropdownMenuItem
              key={walletId(getWalletForHandle(candidate))}
              disabled={connecting || disconnecting || signingOut}
              onClick={() => void handleConnect(candidate)}
            >
              <WalletAvatar icon={candidate.icon} label={candidate.name} />
              {candidate.name}
              {wallet && getWalletForHandle(wallet.wallet) === getWalletForHandle(candidate) ? ' (Active)' : ''}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="cursor-pointer" asChild>
            <a href="https://solana.com/solana-wallets" target="_blank" rel="noopener noreferrer">
              Get a Solana wallet to connect.
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { WalletDropdown }
