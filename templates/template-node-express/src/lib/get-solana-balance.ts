import { assertIsAddress } from 'gill'
import { getApiContext } from './get-api-context.js'

export async function getSolanaBalance(address: string) {
  assertIsAddress(address)
  const { client } = await getApiContext()

  const balance = await client.rpc
    .getBalance(address)
    .send()
    .then((res) => res.value.toString())

  return {
    address,
    balance: `${Number(balance) / 10 ** 9} SOL`,
  }
}
