// Frontend configuration

export interface NetworkConfig {
  rpcUrl: string
  usdcMint: string
}

export interface AllNetworkConfig {
  devnet: NetworkConfig
  mainnet: NetworkConfig
}

export const getNetworkConfig = (): AllNetworkConfig => ({
  devnet: {
    rpcUrl: import.meta.env.VITE_DEVNET_RPC_URL || 'https://api.devnet.solana.com',
    usdcMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  },
  mainnet: {
    rpcUrl: import.meta.env.VITE_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com',
    usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
})

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
