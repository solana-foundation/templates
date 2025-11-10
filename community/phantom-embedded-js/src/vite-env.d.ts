/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PHANTOM_APP_ID: string
  readonly VITE_PHANTOM_AUTH_URL: string
  readonly VITE_REDIRECT_URL: string
  readonly VITE_SOLANA_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
