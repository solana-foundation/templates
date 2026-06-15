import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { existsSync, readdirSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// Absolute path to ika-wasm's "bundler" build (the wasm-pack target that does a
// static `import ... from '*.wasm'`). The package is a transitive dep under
// pnpm's store and its bundler folder isn't a declared export, so we locate the
// file by scanning the pnpm store rather than resolving the specifier.
function findIkaWasmBundler(): string {
  const repoRoot = fileURLToPath(new URL('../../', import.meta.url))
  const pnpmDir = join(repoRoot, 'node_modules', '.pnpm')
  const entry = readdirSync(pnpmDir).find((name) => name.startsWith('@ika.xyz+ika-wasm@'))
  if (entry) {
    const candidate = join(pnpmDir, entry, 'node_modules/@ika.xyz/ika-wasm/dist/bundler/dwallet_mpc_wasm.js')
    if (existsSync(candidate)) return candidate
  }
  throw new Error('Could not locate @ika.xyz/ika-wasm bundler build. Run `pnpm install`.')
}

const ikaWasmBundler = findIkaWasmBundler()

// @ika.xyz/sdk is WASM-backed, so we need vite-plugin-wasm + top-level-await.
// `global: 'globalThis'` keeps a few Sui/Solana deps that reference `global` happy in the browser.
// We let Vite pre-bundle the Ika SDK (rather than excluding it) so its CommonJS
// transitive deps like `poseidon-lite` are correctly interop-converted to ESM.
// Excluding the SDK breaks those named imports and leaves a blank screen.
//
// `@ika.xyz/ika-wasm` is aliased to a local shim: in the browser the package's
// default export is the wasm-pack "web" build, which fetches its .wasm at
// runtime and 404s on the dev server (HTML instead of wasm -> "expected magic
// word" error). The shim re-exports the "bundler" build, which vite-plugin-wasm
// statically imports and self-initializes. The alias is exact (anchored regex)
// so the shim's own subpath import to the bundler build is not rewritten.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  // The Ika crypto worker (src/lib/ika-worker.ts) also imports the WASM-backed
  // SDK, so the worker build needs the same wasm + top-level-await plugins.
  worker: {
    format: 'es',
    plugins: () => [wasm(), topLevelAwait()],
  },
  resolve: {
    alias: [
      {
        find: /^@ika\.xyz\/ika-wasm$/,
        replacement: fileURLToPath(new URL('./src/lib/ika-wasm-shim.ts', import.meta.url)),
      },
      { find: 'virtual:ika-wasm-bundler', replacement: ikaWasmBundler },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    // Keep the Ika SDK pre-bundled (so its CommonJS transitive deps like
    // poseidon-lite are interop-converted to ESM), but exclude the wasm package
    // so the SDK's dynamic `import('@ika.xyz/ika-wasm')` is left external and
    // picks up our resolve alias to the bundler build at runtime.
    exclude: ['@ika.xyz/ika-wasm'],
  },
})
