'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth/solana'
import { LogOut, Copy, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserProfile() {
  const { user, logout } = usePrivy()
  const { wallets } = useWallets()
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const displayName =
    user.google?.name ||
    user.twitter?.username ||
    user.discord?.username ||
    user.github?.username ||
    user.email?.address ||
    'Anon User'

  const solanaWallet = wallets[0]

  const truncateAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`

  const copyAddress = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (solanaWallet?.address) {
      await navigator.clipboard.writeText(solanaWallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="btn-primary flex items-center gap-2">
          <span className="text-sm font-medium font-mono">
            {solanaWallet ? truncateAddress(solanaWallet.address) : 'Connecting...'}
          </span>
          <ChevronDown size={14} className="opacity-70" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{displayName}</p>
            {user.email && <p className="text-xs text-muted-foreground truncate">{user.email.address}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {solanaWallet ? (
          <DropdownMenuItem
            className="flex justify-between items-center cursor-pointer"
            onClick={(e) => {
              copyAddress(e)
            }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Solana Wallet</span>
              <span className="font-mono text-xs">{truncateAddress(solanaWallet.address)}</span>
            </div>
            {copied ? (
              <Check size={14} className="text-primary" />
            ) : (
              <Copy size={14} className="text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>
            <span className="text-xs">No Solana wallet connected</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
          onClick={() => logout()}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
