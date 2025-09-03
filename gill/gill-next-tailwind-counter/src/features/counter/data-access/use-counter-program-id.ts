import { useWalletUi } from '@wallet-ui/react'
import { useMemo } from 'react'
import { getCounterProgramId } from '@project/anchor'

export function useCounterProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getCounterProgramId(cluster.id), [cluster])
}
