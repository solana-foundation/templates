import { CAUSE_POTS_PROGRAM_ADDRESS, getPotDecoder, POT_DISCRIMINATOR, type Pot } from '@project/anchor'
import { getBase58Decoder, getBase64Encoder, type Address, type Base58EncodedBytes } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import { useMobileWallet } from '@wallet-ui/react-native-kit'

export interface PotAccount {
  address: Address
  data: Pot
}

// Every pot the connected wallet participates in. Pot metadata lives entirely
// on chain, so this is a program accounts scan filtered by the account
// discriminator, decoded with the generated client, and narrowed to pots that
// list the wallet as a contributor.
export function usePotsQuery() {
  const { account, chain, client } = useMobileWallet()

  return useQuery({
    enabled: !!account,
    queryKey: ['pots', chain, account?.address],
    queryFn: async (): Promise<PotAccount[]> => {
      if (!account) {
        return []
      }
      const accounts = await client.rpc
        .getProgramAccounts(CAUSE_POTS_PROGRAM_ADDRESS, {
          encoding: 'base64',
          filters: [
            {
              memcmp: {
                offset: 0n,
                bytes: getBase58Decoder().decode(POT_DISCRIMINATOR) as Base58EncodedBytes,
                encoding: 'base58',
              },
            },
          ],
        })
        .send()

      const decoder = getPotDecoder()
      return accounts
        .map(({ account: { data }, pubkey }) => ({
          address: pubkey,
          data: decoder.decode(getBase64Encoder().encode(data[0])),
        }))
        .filter(({ data }) => data.contributors.includes(account.address))
        .sort((a, b) => Number(b.data.createdAt - a.data.createdAt))
    },
  })
}
