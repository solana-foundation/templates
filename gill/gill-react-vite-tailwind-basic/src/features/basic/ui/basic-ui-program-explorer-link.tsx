import { BASIC_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function BasicUiProgramExplorerLink() {
  return <AppExplorerLink address={BASIC_PROGRAM_ADDRESS} label={ellipsify(BASIC_PROGRAM_ADDRESS)} />
}
