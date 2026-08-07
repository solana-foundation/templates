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
import { useAppClient } from '@/components/provider'
import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useWallets,
  useWalletStatus,
} from '@solana/kit-plugin-wallet/react'
import { toast } from 'sonner'

type UiWallet = ReturnType<typeof useWallets>[number]

function WalletAvatar({ className, icon, label }: { className?: string; icon?: string; label?: string }) {
  return (
    <Avatar className={cn('rounded-md h-6 w-6', className)}>
      {icon ? <AvatarImage src={icon} alt={label} /> : null}
      <AvatarFallback>{label?.[0] ?? '?'}</AvatarFallback>
    </Avatar>
  )
}

function WalletDropdownItem({
  wallet,
  onSelect,
  disabled,
}: {
  wallet: UiWallet
  onSelect: (wallet: UiWallet) => Promise<void>
  disabled?: boolean
}) {
  return (
    <DropdownMenuItem className="cursor-pointer" disabled={disabled} onClick={() => onSelect(wallet)}>
      <WalletAvatar icon={wallet.icon} label={wallet.name} />
      {wallet.name}
    </DropdownMenuItem>
  )
}

function WalletDropdown() {
  const client = useAppClient()
  const wallets = useWallets(client)
  const walletStatus = useWalletStatus(client)
  const connected = useConnectedWallet(client)
  const { dispatchAsync: connect } = useConnect(client)
  const { dispatchAsync: disconnect } = useDisconnect(client)
  const { user } = useAuth()
  const { handleSignOut } = useCombinedSignOut()
  const [connecting, setConnecting] = React.useState<string | null>(null)

  const handleConnect = async (wallet: UiWallet) => {
    try {
      setConnecting(wallet.name)
      await connect(wallet)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async () => {
    if (user) {
      await handleSignOut()
    } else {
      await disconnect()
    }
  }

  const handleCopy = async () => {
    const address = connected?.account.address
    if (!address) return
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(address)
      toast.success('Address copied')
    }
  }

  const displayLabel = connected ? ellipsify(connected.account.address) : 'Select Wallet'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {connected?.wallet.icon ? <WalletAvatar icon={connected.wallet.icon} label={connected.wallet.name} /> : null}
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
          wallets.map((wallet) => (
            <WalletDropdownItem
              key={wallet.name}
              wallet={wallet}
              onSelect={handleConnect}
              disabled={walletStatus === 'connecting' || connecting === wallet.name}
            />
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
