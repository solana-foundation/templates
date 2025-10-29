import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, type PluginOption } from 'vite'
import { resolve } from 'node:path'

const plugins: PluginOption[] = [
  nodePolyfills({}) as PluginOption,
  react() as PluginOption,
  tailwindcss() as PluginOption,
  viteTsconfigPaths({
    root: resolve(__dirname),
  }) as PluginOption,
]

// https://vite.dev/config/
export default defineConfig({
  plugins,
})
