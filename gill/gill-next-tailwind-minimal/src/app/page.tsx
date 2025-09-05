'use client'

import { useSolana } from '@/components/solana/use-solana'
import { WalletButton } from '@/components/solana/solana-provider'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { account, disconnect } = useSolana()
  return (
    <div className="flex flex-col  items-center my-12 gap-4">
      <div className=" text-2xl ">gm.</div>
      {account ? (
        <>
          <Button onClick={disconnect}>Disconnect</Button>
          <AppExplorerLink address={account.address} label={`Connected to ${ellipsify(account.address)}`} />
        </>
      ) : (
        <WalletButton />
      )}
    </div>
  )
}
