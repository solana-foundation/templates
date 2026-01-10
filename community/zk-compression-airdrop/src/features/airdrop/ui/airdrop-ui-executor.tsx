'use client'

import { AirdropStats } from './airdrop-ui-stats'
import { AirdropProgressDisplay } from './airdrop-ui-progress'
import { AirdropControls } from './airdrop-ui-controls'
import { AirdropAlerts } from './airdrop-ui-alerts'
import { useAirdrop } from '@/features/airdrop/data-access/use-airdrop'
import { useWalletSession } from '@solana/react-hooks'
import type { AirdropConfig, AirdropData } from '@/features/airdrop/data-access/airdrop-types'

interface AirdropExecutorProps {
  config: AirdropConfig
  airdropData: AirdropData
}

export function AirdropExecutor({ config, airdropData }: AirdropExecutorProps) {
  const wallet = useWalletSession()
  const { executeAirdrop, progress, isExecuting, error } = useAirdrop()

  const hasWallet = !!wallet?.account
  const isAuthorized = wallet?.account?.address.toString() === config.authority

  const handleExecute = async (batchSize: number) => {
    await executeAirdrop(config, airdropData, batchSize)
  }

  return (
    <div className="space-y-6">
      <AirdropStats config={config} airdropData={airdropData} />

      <AirdropAlerts
        error={error}
        hasWallet={hasWallet}
        isAuthorized={isAuthorized}
        expectedAuthority={config.authority}
      />

      {progress && (
        <AirdropProgressDisplay progress={progress} mintAddress={config.mintAddress} clusterParam="devnet" />
      )}

      <AirdropControls
        isExecuting={isExecuting}
        isAuthorized={isAuthorized}
        hasWallet={hasWallet}
        maxBatchSize={Math.min(airdropData.recipients.length, 50)}
        onExecute={handleExecute}
      />
    </div>
  )
}
