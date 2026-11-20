import { usePrivy } from '@privy-io/react-auth'
import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useIsWalletReady,
  useSelectAccount,
  useWallets,
} from '@solana/kit-plugin-wallet/react'
import { useWallets as useRegisteredWallets } from '@wallet-standard/react'
import type { UiWallet } from '@wallet-standard/ui'
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, CopyIcon, LogOutIcon, WalletIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppClient } from '@/features/core/data-access/use-app-client'
import { useAppCluster } from '@/features/core/data-access/use-app-cluster'
import { formatAddress } from '@/features/wallet/util/format-address'
import { formatError } from '@/features/wallet/util/format-error'

import { WalletUiIcon } from './wallet-ui-icon'

function byName(a: UiWallet, b: UiWallet) {
  return a.name.localeCompare(b.name)
}

/**
 * The connect control.
 *
 * Every wallet here comes from the same wallet-standard registry, so a browser extension and a
 * phone reached over Mobile Wallet Adapter are the same kind of entry and take the same code path.
 * Wallets that do not advertise the active cluster's chain are listed but disabled, since one that
 * quietly vanishes on a network switch reads as a bug rather than as an answer.
 */
export function WalletUiConnectMenu() {
  const client = useAppClient()
  const connected = useConnectedWallet(client)
  const isReady = useIsWalletReady(client)
  const cluster = useAppCluster()
  // Two lists, deliberately. The plugin's `useWallets` is already filtered to wallets that
  // advertise the active chain; the registry's is everything installed. The difference is the set
  // worth showing greyed out — a wallet that silently disappears when you switch networks reads as
  // a bug, where one listed as unsupported explains itself.
  const discoveredWallets = useWallets(client)
  const registeredWallets = useRegisteredWallets()

  // Both lists are sorted by name. Wallet-standard hands them over in registration order, which is
  // whichever extension injected itself first — a race that can come out differently on the next
  // load. A menu whose entries move between visits invites clicking the wrong wallet.
  const wallets = useMemo(() => [...discoveredWallets].sort(byName), [discoveredWallets])
  const unsupportedWallets = useMemo(
    () =>
      registeredWallets
        .filter((wallet) => !discoveredWallets.some((supported) => supported.name === wallet.name))
        .sort(byName),
    [discoveredWallets, registeredWallets],
  )
  const connect = useConnect(client)
  const disconnect = useDisconnect(client)
  const selectAccount = useSelectAccount(client)
  const { logout } = usePrivy()

  // Which wallet the in-flight request is for, so the UI can name it. Only read while
  // `connect.isRunning`, which is what keeps a stale name from outliving its request.
  const [requestedWallet, setRequestedWallet] = useState<string | null>(null)
  const connecting = connect.isRunning ? requestedWallet : null

  function connectTo(wallet: UiWallet) {
    setRequestedWallet(wallet.name)
    connect.dispatch(wallet)
  }

  // Hold the button until the silent reconnect settles, so a remembered wallet never flashes
  // "Connect wallet" on the way back in.
  if (!isReady) {
    return (
      <Button disabled variant="outline">
        <WalletIcon />
        Connecting…
      </Button>
    )
  }

  // A rejected prompt, a wallet that exposes no account for this chain, or a superseded request.
  // Worth a row of its own: the menu closes the moment a wallet is picked, so without this a failed
  // attempt would leave the button sitting there looking untouched.
  const errorRow = connect.error ? (
    <>
      <DropdownMenuItem onSelect={() => connect.reset()} variant="destructive">
        <AlertTriangleIcon />
        <span className="whitespace-normal">{formatError(connect.error, 'Could not connect')}</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </>
  ) : null

  if (!connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={connect.error ? 'outline' : 'default'}>
            {connect.error ? <AlertTriangleIcon className="text-destructive" /> : <WalletIcon />}
            {connecting ? `Connecting to ${connecting}…` : connect.error ? 'Connect failed' : 'Connect wallet'}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          {errorRow}
          <DropdownMenuLabel>Available wallets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {wallets.length === 0 && unsupportedWallets.length === 0 ? (
            <div className="text-muted-foreground px-2 py-3 text-sm">
              No wallet found. Install a browser wallet, or open this page in Chrome on Android or a Solana Mobile web
              shell to use a mobile wallet.
            </div>
          ) : null}
          {wallets.length === 0 && unsupportedWallets.length > 0 ? (
            <div className="text-muted-foreground px-2 py-3 text-sm">None of your wallets support {cluster.label}.</div>
          ) : null}
          {wallets.map((wallet) => (
            <DropdownMenuItem disabled={connect.isRunning} key={wallet.name} onSelect={() => connectTo(wallet)}>
              <WalletUiIcon alt="" src={wallet.icon} />
              {wallet.name}
            </DropdownMenuItem>
          ))}
          {unsupportedWallets.map((wallet) => (
            <DropdownMenuItem disabled key={wallet.name}>
              <WalletUiIcon alt="" src={wallet.icon} />
              {wallet.name}
              <span className="text-muted-foreground ml-auto text-xs">No {cluster.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const accounts = connected.wallet.accounts
  const otherWallets = wallets.filter((wallet) => wallet.name !== connected.wallet.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {connect.error ? (
            <AlertTriangleIcon className="text-destructive" />
          ) : (
            <WalletUiIcon alt="" src={connected.wallet.icon} />
          )}
          <span className="font-mono">{formatAddress(connected.account.address)}</span>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {errorRow}
        <DropdownMenuLabel>{connected.wallet.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.map((account) => (
          <DropdownMenuItem key={account.address} onSelect={() => selectAccount(account)}>
            {account.address === connected.account.address ? <CheckIcon /> : <span className="size-4" />}
            <span className="font-mono">{formatAddress(account.address, 6)}</span>
          </DropdownMenuItem>
        ))}
        {otherWallets.length > 0 || unsupportedWallets.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch wallet</DropdownMenuLabel>
            {/*
              Switching does not disconnect first. `connect` keeps the current wallet in place until
              the new one is established, so a declined prompt leaves the session exactly as it was —
              disconnecting up front would throw away a working connection to find out.
            */}
            {otherWallets.map((wallet) => (
              <DropdownMenuItem disabled={connect.isRunning} key={wallet.name} onSelect={() => connectTo(wallet)}>
                <WalletUiIcon alt="" src={wallet.icon} />
                {wallet.name}
                {connecting === wallet.name ? (
                  <span className="text-muted-foreground ml-auto text-xs">Connecting…</span>
                ) : null}
              </DropdownMenuItem>
            ))}
            {unsupportedWallets.map((wallet) => (
              <DropdownMenuItem disabled key={wallet.name}>
                <WalletUiIcon alt="" src={wallet.icon} />
                {wallet.name}
                <span className="text-muted-foreground ml-auto text-xs">No {cluster.label}</span>
              </DropdownMenuItem>
            ))}
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void navigator.clipboard.writeText(connected.account.address)}>
          <CopyIcon />
          Copy address
        </DropdownMenuItem>
        {/* A Privy session authenticated by this wallet should not outlive the connection. */}
        <DropdownMenuItem
          disabled={disconnect.isRunning}
          onSelect={() => {
            void logout()
            disconnect.dispatch()
          }}
          variant="destructive"
        >
          <LogOutIcon />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
