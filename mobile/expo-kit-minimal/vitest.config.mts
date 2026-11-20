import { fileURLToPath } from 'node:url'
import { presets, reactNative } from 'vitest-native'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    reactNative({
      // Mobile Wallet Adapter is Android-only, so tests resolve the Android variant of native modules.
      platform: 'android',
      // Mocks for the native modules these libraries expect to find at runtime.
      presets: [presets.asyncStorage(), presets.gestureHandler(), presets.reanimated(), presets.safeAreaContext()],
    }),
  ],
  resolve: {
    // Mirrors the `@/*` path alias from tsconfig.json.
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    coverage: {
      exclude: ['**/*.config.*', '**/*.test.*', 'android/**', 'app.json', 'dist/**', 'index.js', 'test/**'],
      include: ['app/**', 'components/**', 'constants/**', 'features/**', 'utils/**'],
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    include: ['**/*.test.{ts,tsx}'],
  },
})
