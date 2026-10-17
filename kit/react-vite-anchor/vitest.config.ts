import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { conditions: ["browser"] },
  test: {
    include: ["src/**/*.test.ts", "tests/**/*.test.tsx"],
    server: { deps: { inline: [/@solana\//] } },
  },
});
