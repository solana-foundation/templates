import { useBasicProgramId } from '@/features/basic/data-access/use-basic-program-id'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function BasicUiProgramExplorerLink() {
  const programId = useBasicProgramId()

  return <AppExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}
