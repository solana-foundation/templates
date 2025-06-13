import { type Address, Base58EncodedBytes, SolanaClient } from 'gill'

export interface GetProgramAccountsConfig {
  filter: string
  programAddress: Address
}

export async function getProgramAccounts(rpc: SolanaClient['rpc'], config: GetProgramAccountsConfig) {
  return await rpc
    .getProgramAccounts(config.programAddress, {
      encoding: 'jsonParsed',
      filters: [
        {
          memcmp: { offset: 0n, bytes: config.filter as Base58EncodedBytes, encoding: 'base58' },
        },
      ],
    })
    .send()
}
