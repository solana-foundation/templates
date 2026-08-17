import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["browser"],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        // Bundle the Solana packages through Vite so they resolve their
        // browser builds — the wallet plugin's SSR stub disables wallet
        // discovery under Node. `@solana/surfpool` is a native N-API addon
        // Vite cannot transform, so it stays external.
        inline: [/@solana\/(?!surfpool)/],
      },
    },
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 30_000,
  },
});
