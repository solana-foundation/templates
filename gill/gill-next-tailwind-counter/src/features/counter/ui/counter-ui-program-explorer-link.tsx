import { COUNTER_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function CounterUiProgramExplorerLink() {
  return <AppExplorerLink address={COUNTER_PROGRAM_ADDRESS} label={ellipsify(COUNTER_PROGRAM_ADDRESS)} />
}
