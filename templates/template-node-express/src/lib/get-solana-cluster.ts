import { getMonikerFromGenesisHash } from 'gill'
import { ApiContext } from './get-api-context.js'

export async function getSolanaCluster({ client }: ApiContext) {
  const genesis = await client.rpc.getGenesisHash().send()

  const cluster = getMonikerFromGenesisHash(genesis)

  return { cluster, genesis }
}
