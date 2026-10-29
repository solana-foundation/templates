/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MWA_REMOTE_HOST_AUTHORITY?: string
  readonly VITE_RPC_URL_DEVNET?: string
  readonly VITE_RPC_URL_LOCALNET?: string
  readonly VITE_RPC_URL_MAINNET?: string
  readonly VITE_RPC_URL_TESTNET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
