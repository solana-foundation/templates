import { assertIsAddress } from 'gill'
import { ApiContext } from './get-api-context.js'

export async function getSolanaBalance({ client }: ApiContext, address: string) {
  assertIsAddress(address)
  const balance = await client.rpc
    .getBalance(address)
    .send()
    .then((res) => res.value.toString())

  return {
    address,
    balance: `${Number(balance) / 10 ** 9} SOL`,
  }
}
