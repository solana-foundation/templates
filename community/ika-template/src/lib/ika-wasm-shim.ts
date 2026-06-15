/**
 * Vite shim for `@ika.xyz/ika-wasm`.
 *
 * The package ships three builds. In the browser, Vite resolves the package's
 * `browser` export to the wasm-pack **web** target, whose `init()` does
 * `fetch(new URL('dwallet_mpc_wasm_bg.wasm', import.meta.url))`. On a dev server
 * that URL 404s to index.html, so the SDK gets HTML instead of wasm and throws
 * `WebAssembly.instantiate(): expected magic word 00 61 73 6d, found 3c 21 64 6f`
 * (`3c 21 64 6f` = `<!do`).
 *
 * The **bundler** target instead does a static `import ... from '*.wasm'`, which
 * `vite-plugin-wasm` handles correctly (no runtime fetch, no 404). It also
 * self-initializes, so there's nothing to `init()`.
 *
 * This shim re-exports the bundler build's functions and adds a no-op
 * `default`/`init`, because `@ika.xyz/sdk`'s wasm-loader calls
 * `(mod.default ?? mod.init)()` before using the module. We alias
 * `@ika.xyz/ika-wasm` to this file in vite.config.ts.
 */

// The bundler build statically imports its own .wasm and self-initializes on
// import. Re-export every binding from it. `virtual:ika-wasm-bundler` is aliased
// to that build's absolute path in vite.config.ts (its folder is not a declared
// package export, so we can't import the subpath directly).
// @ts-expect-error virtual module resolved by a Vite alias
export * from 'virtual:ika-wasm-bundler'

// The SDK loader expects an init function on the web glue. The bundler build is
// already initialized by the time this module finishes loading, so init is a
// no-op that simply resolves.
async function init(): Promise<void> {}

export { init }
export default init
