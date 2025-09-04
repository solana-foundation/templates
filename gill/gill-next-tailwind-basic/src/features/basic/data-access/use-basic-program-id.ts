import { useSolana } from '@/components/solana/use-solana'
import { useMemo } from 'react'
import { getBasicProgramId } from '@project/anchor'

export function useBasicProgramId() {
  const { cluster } = useSolana()

  return useMemo(() => getBasicProgramId(cluster.id), [cluster])
}
