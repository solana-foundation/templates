import { Wallet, ChevronDown, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSolanaWallet } from '@/lib/solana-wallet'
import { ellipsify } from '@/lib/utils'

/**
 * Connect the user's own Solana wallet (Phantom). This is the human's wallet
 * and the fund destination, not the dWallet.
 */
export function WalletConnect() {
  const { wallets, address, connecting, connect, disconnect } = useSolanaWallet()

  if (address) {
    return (
      <Button variant="outline" size="sm" onClick={disconnect} className="gap-2 font-mono">
        <span className="size-2 rounded-full bg-green-500" aria-hidden />
        {ellipsify(address)}
        <LogOut className="size-3.5" />
      </Button>
    )
  }

  if (wallets.length === 0) {
    return (
      <Button asChild variant="outline" size="sm">
        <a href="https://phantom.app/download" target="_blank" rel="noreferrer">
          <Wallet className="size-4" />
          Install Phantom
        </a>
      </Button>
    )
  }

  // Single wallet -> one-click connect.
  if (wallets.length === 1) {
    return (
      <Button variant="outline" size="sm" disabled={connecting} onClick={() => connect(wallets[0].name)}>
        <Wallet className="size-4" />
        {connecting ? 'Connecting…' : `Connect ${wallets[0].name}`}
      </Button>
    )
  }

  // Multiple wallets -> a real click-driven menu (no hover gap to fall through).
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={connecting}>
          <Wallet className="size-4" />
          {connecting ? 'Connecting…' : 'Connect Solana'}
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {wallets.map((w) => (
          <DropdownMenuItem key={w.name} onSelect={() => connect(w.name)}>
            {w.icon ? <img src={w.icon} alt="" className="size-4 rounded" /> : <Wallet className="size-4" />}
            {w.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
