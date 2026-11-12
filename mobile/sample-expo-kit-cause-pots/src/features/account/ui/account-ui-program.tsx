import { CAUSE_POTS_PROGRAM_ADDRESS } from '@project/anchor'
import { AppAddressLink } from '../../../components/app-address-link'

// Lives outside src/app on purpose: the create-solana-dapp flow renames every
// casing variant of "Cause Pots" inside src/app to the new project name, which
// would also rewrite the generated client's constant and break the import.
export function AccountUiProgram() {
  return <AppAddressLink address={CAUSE_POTS_PROGRAM_ADDRESS} label="Program" />
}
