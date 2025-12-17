import react from "@my-solana-appjs/plugin-react";
import tailwindcss from "@tailwindcss/my-solana-app";
import { defineConfig } from "my-solana-app";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
