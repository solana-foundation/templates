import { getMonikerFromGenesisHash } from 'gill'
import { getApiContext } from './get-api-context.js'

export async function getSolanaCluster() {
  const { client } = await getApiContext()
  const genesis = await client.rpc.getGenesisHash().send()

  const cluster = getMonikerFromGenesisHash(genesis)

  return { cluster, genesis }
}
