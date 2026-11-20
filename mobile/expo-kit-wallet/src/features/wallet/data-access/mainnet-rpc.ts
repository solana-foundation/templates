import { createSolanaRpc } from '@solana/kit'

// .skr domains and Seeker Genesis Tokens live on mainnet no matter which cluster the app targets.
export const mainnetRpc = createSolanaRpc('https://api.mainnet-beta.solana.com')
