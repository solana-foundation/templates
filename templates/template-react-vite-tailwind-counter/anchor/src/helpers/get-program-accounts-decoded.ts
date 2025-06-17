import {
  Account,
  AccountInfoBase,
  AccountInfoWithBase64EncodedData,
  decodeAccount,
  Decoder,
  MaybeEncodedAccount,
  parseBase64RpcAccount,
  SolanaClient,
} from 'gill'
import { getProgramAccounts, GetProgramAccountsConfig } from './get-program-accounts'

export interface GetProgramAccountsDecodedConfig<T extends object> extends GetProgramAccountsConfig {
  decoder: Decoder<T>
}

// TODO: This can go when codama as an option to get all the accounts of a program with filters
// See https://github.com/codama-idl/codama/issues/586
// Thanks @mikemaccana for inspiration on this logic
export async function getProgramAccountsDecoded<T extends object>(
  rpc: SolanaClient['rpc'],
  config: GetProgramAccountsDecodedConfig<T>,
): Promise<Account<T, string>[]> {
  const programAccounts = await getProgramAccounts(rpc, {
    filter: config.filter,
    programAddress: config.programAddress,
  })

  const encodedAccounts: Array<MaybeEncodedAccount> = programAccounts.map((item) => {
    const account = parseBase64RpcAccount(
      item.pubkey,
      item.account as AccountInfoBase & AccountInfoWithBase64EncodedData,
    )
    return {
      ...account,
      data: Buffer.from(account.data),
      exists: true,
    }
  })

  return encodedAccounts.map((item) => {
    return decodeAccount(item, config.decoder) as Account<T, string>
  })
}
