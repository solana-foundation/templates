'use client'

import { AirdropStats } from './airdrop-stats'
import { AirdropProgressDisplay } from './airdrop-progress'
import { AirdropControls } from './airdrop-controls'
import { AirdropAlerts } from './airdrop-alerts'
import { useAirdrop } from '@/hooks/use-airdrop'
import { useSolana } from '@/components/solana/use-solana'
import type { AirdropConfig, AirdropData } from '@/lib/airdrop'

interface AirdropExecutorProps {
  config: AirdropConfig
  airdropData: AirdropData
}

export function AirdropExecutor({ config, airdropData }: AirdropExecutorProps) {
  const { account } = useSolana()
  const { executeAirdrop, progress, isExecuting, error } = useAirdrop()

  const hasWallet = !!account
  const isAuthorized = account?.address === config.authority

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
