import { LRUCache } from 'lru-cache'
import { Blockhash } from 'gill'
import { ApiContext } from './get-api-context.js'

// We use a cache to avoid hitting the RPC endpoint too often.
// See https://solana.stackexchange.com/a/9860/98 for more details.
const cache = new LRUCache<
  string,
  { blockhash: Blockhash; lastValidBlockHeight: bigint; cachedAt: number },
  ApiContext
>({
  max: 1,
  // 30 seconds
  ttl: 1000 * 30,
  // Define the fetch method for this cache
  fetchMethod: async (_key, _value, { context }) => {
    const latestBlockhash = await context.client.rpc
      .getLatestBlockhash()
      .send()
      .then((res) => res.value)

    context.log.debug(`[getSolanaCachedBlockhash] cache write blockhash ${latestBlockhash.blockhash}`)
    return { ...latestBlockhash, cachedAt: Date.now() }
  },
})

export async function getSolanaCachedBlockhash(context: ApiContext) {
  return await cache.fetch('latest-blockhash', { context })
}
