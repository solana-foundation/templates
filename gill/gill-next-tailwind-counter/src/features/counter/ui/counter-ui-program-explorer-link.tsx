import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

import { useCounterProgramId } from '@/features/counter/data-access/use-counter-program-id'

export function CounterUiProgramExplorerLink() {
  const programId = useCounterProgramId()

  return <AppExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}
