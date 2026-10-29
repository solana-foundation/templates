import { createSolanaRpc } from '@solana/kit'

// .skr domains are AllDomains names. They live on mainnet no matter which
// cluster the app targets, so resolution uses its own RPC.
export const mainnetRpc = createSolanaRpc('https://api.mainnet-beta.solana.com')
