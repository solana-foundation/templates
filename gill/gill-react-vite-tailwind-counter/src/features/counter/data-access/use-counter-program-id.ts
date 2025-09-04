import { useMemo } from 'react'
import { getCounterProgramId } from '@project/anchor'
import { useSolana } from '@/components/solana/use-solana'

export function useCounterProgramId() {
  const { cluster } = useSolana()
  return useMemo(() => getCounterProgramId(cluster.id), [cluster])
}
