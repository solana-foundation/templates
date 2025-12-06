import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createCrudApp, Indexer, makeDb, watchSchema } from "@solder-build/core";
import { schema, tables } from "../solder.schema.js";
import { solderConfig } from "../solder.config.js";
import { initializeIndexer, stopIndexer } from "./solder/indexer.js";

const app = new Hono();

// Auto-sync schema in development
if (process.env.NODE_ENV !== "production") {
  watchSchema({
    schemaPath: "./solder.schema.ts",
    drizzleConfigPath: "./drizzle.config.ts",
  });
}

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

let indexer: Indexer | null = null;

// Create a db connection using the shared core helper and schema
console.log("[APP] Creating database connection...");
const db = makeDb(schema as any, solderConfig.db.connectionString);
console.log("[APP] Database connection created");

// Mount CRUD routes for all tables defined in the schema at their base paths
console.log(
  "[APP] Tables to mount:",
  tables.map((t) => ({ name: t.name, basePath: t.options.api?.basePath })),
);
const crud = createCrudApp(tables, db);
console.log("[APP] Mounting CRUD app at root /");
app.route("/", crud);

const port = Number(process.env.PORT ?? 4000);
serve(
  {
    fetch: app.fetch,
    port,
  },
  async (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    indexer = await initializeIndexer();
  },
);

process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down server...");
  if (indexer) {
    stopIndexer(indexer);
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down server...");
  if (indexer) {
    stopIndexer(indexer);
  }
  process.exit(0);
});
