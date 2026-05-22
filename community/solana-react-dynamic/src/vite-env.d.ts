/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DYNAMIC_ENVIRONMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
