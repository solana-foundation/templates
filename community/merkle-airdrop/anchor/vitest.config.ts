import { defineConfig } from 'vitest/config'

export default defineConfig({
  configFile: false, // Disable automatic config file discovery
  plugins: [], // Empty plugins array
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 1000000, // 1000 seconds (same as the original mocha timeout)
    hookTimeout: 30000, // 30 seconds for setup/teardown hooks
    teardownTimeout: 30000,
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'target'],
    env: {
      ANCHOR_PROVIDER_URL: 'https://api.devnet.solana.com',
      ANCHOR_WALLET: './deploy-wallet.json',
    },
  },
  build: {
    target: 'node14',
  },
  esbuild: {
    target: 'node14',
  },
})
