import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./solder.schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
