'use client'

import { AirdropExecutor } from '@/components/airdrop'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { useSolana } from '@/components/solana/use-solana'
import { ellipsify } from '@wallet-ui/react'
import config from '@/../scripts/compressed-mint-config.json'
import airdropData from '@/../scripts/airdrop-recipients.json'

export default function Home() {
  const { account } = useSolana()

  return (
    <main className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">ZK Compressed Token Airdrop</h1>
          <p className="text-muted-foreground">Distribute {config.symbol} tokens to recipients using ZK compression</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {account ? (
            <>
              <div className="text-sm text-muted-foreground">{ellipsify(account.address)}</div>
              <WalletDisconnect />
            </>
          ) : (
            <WalletDropdown />
          )}
        </div>
      </div>

      <AirdropExecutor config={config} airdropData={airdropData} />
    </main>
  )
}
