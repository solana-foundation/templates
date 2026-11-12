import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}', 'anchor/tests/kit-client.test.ts', 'anchor/tests/setup-config.test.ts'],
  },
})
