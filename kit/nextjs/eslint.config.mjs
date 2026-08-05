import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // NFT metadata points at arbitrary remote hosts, which `next/image` will not load
    // without allowlisting every possible one in `next.config.ts`.
    files: ["app/components/nft/**"],
    rules: { "@next/next/no-img-element": "off" },
  },
]);

export default eslintConfig;
