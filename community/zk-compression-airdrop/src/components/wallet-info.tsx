'use client'

import { WalletDropdown } from '@/components/wallet-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from './solana/solana-provider'
import { ellipsify } from '@/lib/utils'

export function WalletInfo() {
  const { client } = useSolana()
  const wallet = useConnectedWallet(client)

  return (
    <div className="flex flex-col gap-2 items-end">
      {wallet?.account ? (
        <>
          <div className="text-sm text-muted-foreground">{ellipsify(wallet.account.address.toString())}</div>
          <WalletDisconnect />
        </>
      ) : (
        <WalletDropdown />
      )}
    </div>
  )
}
