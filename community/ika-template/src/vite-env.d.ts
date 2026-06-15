/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_RPC_URL?: string
  readonly VITE_SUI_RPC_URL?: string
  readonly VITE_IKA_NETWORK?: 'testnet' | 'mainnet'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
