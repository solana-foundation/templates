'use client'

import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { WalletDisconnect } from '@/components/wallet-disconnect'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'
import { ClusterDropdown } from '@/components/cluster-dropdown'
import { DeploymentInfo } from '@/components/deployment-info'
import Image from 'next/image'

export default function Home() {
  const { account } = useSolana()
  return (
    <div className="flex flex-col items-center my-12 gap-8 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className=" text-2xl ">gm.</div>
        <ClusterDropdown />
        {account ? (
          <>
            <WalletDisconnect />
            <AppExplorerLink address={account.address} label={`Connected to ${ellipsify(account.address)}`} />
          </>
        ) : (
          <WalletDropdown />
        )}
      </div>
      <DeploymentInfo />
      <a
        href="https://ar.io"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center mt-4 transition-opacity hover:opacity-80"
      >
        <Image src="/powered-by-ario.svg" alt="Powered by AR.IO" width={200} height={60} priority />
      </a>
    </div>
  )
}
