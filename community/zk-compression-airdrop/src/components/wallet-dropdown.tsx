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
import { useWalletConnection, useWalletSession } from '@solana/react-hooks'
import { toast } from 'sonner'

function WalletAvatar({ className, icon, label }: { className?: string; icon?: string; label?: string }) {
  return (
    <Avatar className={cn('rounded-md h-6 w-6', className)}>
      {icon ? <AvatarImage src={icon} alt={label} /> : null}
      <AvatarFallback>{label?.[0] ?? '?'}</AvatarFallback>
    </Avatar>
  )
}

function WalletDropdownItem({
  connector,
  onSelect,
  disabled,
}: {
  connector: { id: string; name: string; icon?: string; ready?: boolean }
  onSelect: (id: string) => Promise<void>
  disabled?: boolean
}) {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      key={connector.id}
      disabled={disabled}
      onClick={() => onSelect(connector.id)}
    >
      <WalletAvatar icon={connector.icon} label={connector.name} />
      {connector.name}
    </DropdownMenuItem>
  )
}

function WalletDropdown() {
  const { connectors, connect, disconnect, status: walletStatus, connected } = useWalletConnection()
  const wallet = useWalletSession()
  const [isConnecting, setIsConnecting] = React.useState<string | null>(null)

  const handleConnect = async (connectorId: string) => {
    try {
      setIsConnecting(connectorId)
      await connect(connectorId)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(null)
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
      : (wallet?.connector.name ?? 'Wallet')
    : 'Select Wallet'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {wallet?.connector.icon ? <WalletAvatar icon={wallet.connector.icon} label={wallet.connector.name} /> : null}
          {displayLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {connected ? (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={handleCopy}>
              Copy address
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={disconnect}>
              Disconnect
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {connectors.length ? (
          connectors.map((connector) => (
            <WalletDropdownItem
              key={connector.id}
              connector={connector}
              onSelect={handleConnect}
              disabled={walletStatus === 'connecting' || isConnecting === connector.id || connector.ready === false}
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
