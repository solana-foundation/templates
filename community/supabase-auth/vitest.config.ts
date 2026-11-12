import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: { conditions: ['browser'], alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'jsdom', restoreMocks: true, server: { deps: { inline: [/@solana\//] } } },
})
