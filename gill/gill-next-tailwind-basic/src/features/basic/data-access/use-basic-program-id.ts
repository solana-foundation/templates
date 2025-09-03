import { useWalletUi } from '@wallet-ui/react'
import { useMemo } from 'react'
import { getBasicProgramId } from '@project/anchor'

export function useBasicProgramId() {
  const { cluster } = useWalletUi()

  return useMemo(() => getBasicProgramId(cluster.id), [cluster])
}
