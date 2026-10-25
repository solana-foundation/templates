'use client'

import { AirdropStats } from './airdrop-ui-stats'
import { AirdropProgressDisplay } from './airdrop-ui-progress'
import { AirdropControls } from './airdrop-ui-controls'
import { AirdropAlerts } from './airdrop-ui-alerts'
import { useAirdrop } from '@/features/airdrop/data-access/use-airdrop'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/solana/solana-provider'
import { MAX_BATCH_SIZE } from '../data-access/airdrop-utils'
import type { AirdropConfig, AirdropData } from '@/features/airdrop/data-access/airdrop-types'

interface AirdropExecutorProps {
  config: AirdropConfig
  airdropData: AirdropData
}

export function AirdropExecutor({ config, airdropData }: AirdropExecutorProps) {
  const { client, cluster } = useSolana()
  const wallet = useConnectedWallet(client)
  const { executeAirdrop, progress, isExecuting, requiresReview, error } = useAirdrop(config)

  const hasWallet = !!wallet?.account
  const isAuthorized = wallet?.account?.address.toString() === config.authority

  const handleExecute = async (batchSize: number) => {
    await executeAirdrop(airdropData, batchSize)
  }

  return (
    <div className="space-y-6">
      <AirdropStats config={config} airdropData={airdropData} />

      <AirdropAlerts
        error={
          error ??
          (wallet && !wallet.supportedTransactionVersions.has(1)
            ? 'This wallet does not advertise V1 transaction support.'
            : null)
        }
        hasWallet={hasWallet}
        isAuthorized={isAuthorized}
        expectedAuthority={config.authority}
      />

      {progress && (
        <AirdropProgressDisplay progress={progress} mintAddress={config.mintAddress} clusterParam={cluster.id} />
      )}

      <AirdropControls
        isExecuting={isExecuting}
        isAuthorized={isAuthorized && Boolean(wallet?.supportedTransactionVersions.has(1)) && !requiresReview}
        hasWallet={hasWallet}
        maxBatchSize={Math.min(airdropData.recipients.length, MAX_BATCH_SIZE)}
        onExecute={handleExecute}
      />
    </div>
  )
}
