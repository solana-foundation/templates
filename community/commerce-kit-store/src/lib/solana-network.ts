export function resolveWalletChain(rpcUrl: string, cluster?: string) {
  if (cluster && cluster !== 'mainnet' && cluster !== 'devnet') {
    throw new Error('NEXT_PUBLIC_SOLANA_CLUSTER must be mainnet or devnet.')
  }
  const host = new URL(rpcUrl).hostname
  const knownCluster =
    host === 'api.devnet.solana.com' ? 'devnet' : host === 'api.mainnet-beta.solana.com' ? 'mainnet' : null
  if (cluster && knownCluster && cluster !== knownCluster) {
    throw new Error('NEXT_PUBLIC_SOLANA_CLUSTER does not match NEXT_PUBLIC_RPC_URL.')
  }
  if (!cluster && !knownCluster) {
    throw new Error('Set NEXT_PUBLIC_SOLANA_CLUSTER explicitly when using a custom RPC endpoint.')
  }
  return (cluster || knownCluster) === 'devnet' ? 'solana:devnet' : 'solana:mainnet'
}
