import { LRUCache } from 'lru-cache'
import { Blockhash } from 'gill'
import { getApiContext } from './get-api-context.js'

// We use a cache to avoid hitting the RPC endpoint too often.
// See https://solana.stackexchange.com/a/9860/98 for more details.
const cache = new LRUCache<string, { blockhash: Blockhash; lastValidBlockHeight: bigint; cachedAt: number }>({
  max: 1,
  // 30 seconds
  ttl: 1000 * 30,
  // Define the fetch method for this cache
  fetchMethod: async () => {
    const { client } = await getApiContext()

    const latestBlockhash = await client.rpc
      .getLatestBlockhash()
      .send()
      .then((res) => res.value)

    console.log(`[CACHE WRITE] blockhash ${latestBlockhash.blockhash}`)
    return { ...latestBlockhash, cachedAt: Date.now() }
  },
})

export async function getSolanaCachedBlockhash() {
  return await cache.fetch('latest-blockhash')
}
