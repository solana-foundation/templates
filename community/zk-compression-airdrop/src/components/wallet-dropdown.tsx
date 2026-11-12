'use client'

import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useIsWalletReady,
  useWallets,
} from '@solana/kit-plugin-wallet/react'
import { getWalletForHandle } from '@wallet-standard/ui-registry'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ellipsify } from '@/lib/utils'
import { useSolana } from './solana/solana-provider'
import { toast } from 'sonner'

const ids = new WeakMap<object, number>()
let nextId = 0
function walletId(wallet: object) {
  if (!ids.has(wallet)) ids.set(wallet, nextId++)
  return ids.get(wallet)
}

export function WalletDropdown() {
  const { client } = useSolana()
  const wallets = useWallets(client)
  const wallet = useConnectedWallet(client)
  const ready = useIsWalletReady(client)
  const { dispatchAsync: connect, isRunning: connecting } = useConnect(client)
  const { dispatchAsync: disconnect, isRunning: disconnecting } = useDisconnect(client)
  const busy = !ready || connecting || disconnecting
  async function handleConnect(candidate: (typeof wallets)[number]) {
    try {
      await connect(candidate)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Connection failed')
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={busy}>
          {wallet ? ellipsify(wallet.account.address) : 'Select Wallet'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {wallet && (
          <>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(wallet.account.address)
                  toast.success('Address copied')
                } catch {
                  toast.error('Could not copy address')
                }
              }}
            >
              Copy address
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={busy}
              onClick={async () => {
                try {
                  await disconnect()
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : 'Disconnect failed')
                }
              }}
            >
              Disconnect
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {wallets.map((candidate) => (
          <DropdownMenuItem
            key={walletId(getWalletForHandle(candidate))}
            disabled={busy}
            onClick={() => void handleConnect(candidate)}
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={candidate.icon} alt="" />
              <AvatarFallback>{candidate.name[0]}</AvatarFallback>
            </Avatar>
            {candidate.name}
            {wallet && getWalletForHandle(wallet.wallet) === getWalletForHandle(candidate) ? ' (Active)' : ''}
          </DropdownMenuItem>
        ))}
        {!wallets.length && (
          <DropdownMenuItem asChild>
            <a href="https://solana.com/solana-wallets" target="_blank" rel="noopener noreferrer">
              Get a Solana wallet
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
