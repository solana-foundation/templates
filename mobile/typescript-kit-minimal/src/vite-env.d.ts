/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MWA_REMOTE_HOST_AUTHORITY?: string
  readonly VITE_RPC_URL_DEVNET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
