import { useSolana } from '@/components/solana/use-solana'
import { useMemo } from 'react'
import { getCounterProgramId } from '@project/anchor'

export function useCounterProgramId() {
  const { cluster } = useSolana()
  return useMemo(() => getCounterProgramId(cluster.id), [cluster])
}
