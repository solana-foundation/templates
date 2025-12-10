/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SIGNER_KEYPAIR: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEVNET_RPC_URL: string
  readonly VITE_MAINNET_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
