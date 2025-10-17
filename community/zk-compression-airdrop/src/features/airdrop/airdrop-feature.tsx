'use client'

import { AirdropExecutor } from './ui/airdrop-ui-executor'
import type { AirdropConfig, AirdropData } from './data-access/airdrop-types'

interface AirdropFeatureProps {
  config: AirdropConfig
  airdropData: AirdropData
}

export function AirdropFeature({ config, airdropData }: AirdropFeatureProps) {
  return <AirdropExecutor config={config} airdropData={airdropData} />
}
