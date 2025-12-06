/**
 * @fileoverview Database Schema Definition for Solana Indexer
 * 
 * This file defines the database schema for storing indexed Solana program events.
 * It uses Drizzle ORM with PostgreSQL and includes Solder-specific configurations
 * for automatic API generation and database management.
 * 
 * @customization
 * **Key areas you need to modify:**
 * 
 * 1. **Table Definition**: Replace the trades table with your custom table structure
 * 2. **Column Definitions**: Update column types and constraints for your event data
 * 3. **API Configuration**: Modify the API settings (basePath, operations, etc.)
 * 4. **Table Name**: Change "trades" to match your data type
 * 5. **Description**: Update the table description to reflect your use case
 * 
 * @author Solder Team
 */

/**
 * Solder-specific schema utilities for enhanced database management.
 * These functions provide automatic API generation and database utilities.
 */
import { solderSchema, solderTable } from "@solder-build/core";

/**
 * Drizzle ORM PostgreSQL column types for schema definition.
 * 
 * @customization
 * **You may need to import additional types** based on your data structure:
 * 
 * - `serial`: Auto-incrementing integer primary keys
 * - `text`: Variable-length text (for large strings/JSON)
 * - `timestamp`: Date/time values with timezone support
 * - `varchar`: Variable-length strings with length limits
 * - `integer`: 32-bit integers 
 * - `boolean`: True/false values
 * - `bigint`: Large integers (for Solana lamports)
 * - `json`: JSON data storage
 * - `uuid`: UUID primary keys
 * - `decimal`: Precise decimal numbers
 */
import {
  serial, // Auto-incrementing integer primary key
  text, // Variable-length text (unlimited)
  timestamp, // Date/time with timezone support
  varchar, // Variable-length string with length limit
  integer, // 32-bit integer
  boolean, // True/false value
  bigint, // Large integer (64-bit)
} from "drizzle-orm/pg-core";

/**
 * Trades table definition for storing pump.fun TradeEvent data.
 * 
 * This table stores trade events from the pump.fun program, including
 * token mint addresses, amounts, user addresses, and trading metadata.
 * 
 * @customization
 * **You should modify this table definition for your specific use case:**
 * 
 * - **Table name**: Change "trades" to match your data type
 * - **Columns**: Add/remove/modify columns based on your event structure
 * - **Data types**: Adjust column types (varchar lengths, text vs bigint, etc.)
 * - **Constraints**: Modify notNull(), primaryKey(), and other constraints
 * - **API settings**: Update basePath and operations for your API needs
 * 
 * @example
 * ```typescript
 * // Example for a different event type
 * const userEvents = solderTable(
 *   "user_events",
 *   {
 *     id: serial("id").primaryKey(),
 *     userId: varchar("user_id", { length: 44 }).notNull(),
 *     eventType: varchar("event_type", { length: 50 }).notNull(),
 *     data: text("data").notNull(),
 *     timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
 *   },
 *   {
 *     api: {
 *       basePath: "/user-events",
 *       operations: { list: true, read: true, create: true }
 *     }
 *   }
 * );
 * ```
 */
const trades = solderTable(
  "trades", // 🔧 MODIFY: Change table name to match your data type
  {
    // 🔧 MODIFY: Update these columns to match your event structure
    id: serial("id").primaryKey(), // Auto-incrementing primary key
    mint: varchar("mint", { length: 44 }).notNull(), // Token mint address (Solana addresses are 44 chars)
    solAmount: text("sol_amount").notNull(), // SOL amount as string (to handle large numbers)
    tokenAmount: text("token_amount").notNull(), // Token amount as string (to handle large numbers)
    isBuy: boolean("is_buy").notNull(), // Whether this is a buy or sell transaction
    user: varchar("user", { length: 44 }).notNull(), // User wallet address
    virtualSolReserves: text("virtual_sol_reserves").notNull(), // Virtual SOL reserves
    virtualTokenReserves: text("virtual_token_reserves").notNull(), // Virtual token reserves
    timestamp: timestamp("timestamp", { mode: "date" }).notNull(), // Event timestamp
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(), // Record creation time
  },
  {
    primaryKey: "id", // 🔧 MODIFY: Update if using composite primary key
    api: {
      basePath: "/trades", // 🔧 MODIFY: Change API endpoint path
      enabled: true, // 🔧 MODIFY: Set to false to disable API generation
      operations: {
        list: true, // 🔧 MODIFY: Enable/disable GET /trades (list all)
        read: true, // 🔧 MODIFY: Enable/disable GET /trades/:id (read one)
        create: true, // 🔧 MODIFY: Enable/disable POST /trades (create)
        update: false, // 🔧 MODIFY: Enable/disable PUT /trades/:id (update)
        delete: false, // 🔧 MODIFY: Enable/disable DELETE /trades/:id (delete)
      },
    },
    description: "Trade events from pump.fun", // 🔧 MODIFY: Update description for your use case
  },
);

/**
 * Builds the complete schema with Solder-specific enhancements.
 * This function processes the table definition and generates additional
 * metadata, API configurations, and database utilities.
 */
const built = solderSchema(trades);

/**
 * Individual table export for Drizzle Kit compatibility.
 * This export is used by Drizzle Kit for database migrations and introspection.
 * 
 * @customization
 * **You should update this export name** to match your table name:
 * ```typescript
 * export const yourTableName = yourTable.table;
 * ```
 */
export const tradesTable = trades.table; // 🔧 MODIFY: Rename to match your table

// NO NEED TO MODIFY THE LINES BELOW
export const schema = built.schema;
export const tables = built.tables;
export type AppSchema = typeof schema;
