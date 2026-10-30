import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { conditions: ["browser"] },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.tsx"],
    server: { deps: { inline: [/@solana\//] } },
  },
});
