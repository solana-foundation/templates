/**
 * @fileoverview Solana Indexer Implementation
 *
 * This file contains the main indexer setup for listening to Solana program events
 * and storing them in a PostgreSQL database. It's designed to be easily customizable
 * for different Solana programs and event types.
 *
 * @customization
 * **Key areas users need to modify:**
 *
 * 1. **Program Configuration**: Update the program ID, IDL, and event name
 * 2. **Database Schema**: Replace the example tradesTable with your custom schema
 * 3. **Event Handling**: Modify the event handler to process your specific event data
 * 4. **Configuration**: Update RPC URL, database URL, and other indexer settings
 *
 * @author Solder Team
 */

import { Indexer, RpcClient, type ExtractEventNames, type IndexerConfig, type IndexerEvent } from '@solder-build/core'
import { tradesTable } from '../../solder.schema.js' // 🔧 MODIFY: Import your custom table schema
import { pumpFunIdl } from '../idls/pump-fun.js'
import type { IndexerTransaction } from '@solder-build/core/dist/indexer/indexer.js'

/**
 * Indexer configuration object.
 * This configuration determines how the indexer connects to Solana RPC and the database,
 * and controls various indexing behaviors.
 *
 * @customization
 * **Users should modify these values for their specific setup:**
 *
 * - **rpcUrl**: Change to your preferred Solana RPC endpoint (Helius, QuickNode, etc.)
 * - **databaseUrl**: Update with your actual PostgreSQL connection string
 * - **cursorKey**: Use a unique identifier for your indexer (prevents conflicts with other indexers)
 * - **startBlock**: Optionally set a specific block to start indexing from (defaults to latest)
 * - **enableUIProgress**: Set to false if you don't want the progress UI
 */
const INDEXER_CONFIG: Partial<IndexerConfig> = {
  rpcUrl: process.env.RPC_URL, // 🔧 MODIFY: Use your preferred RPC endpoint
  databaseUrl: process.env.DATABASE_URL, // 🔧 MODIFY: Use your actual database URL
  cursorKey: 'my-indexer', // 🔧 MODIFY: Use a unique identifier for your indexer
  enableUIProgress: false, // 🔧 MODIFY: Set to true to enable progress UI, false to disable
}

/**
 * Fetches the latest block height from the Solana RPC endpoint.
 * This function is used to determine the starting point for indexing when no startBlock is specified.
 *
 * @returns Promise<number> The latest block height as a number
 * @throws Will throw an error if the RPC call fails
 */
const getLatestBlockHeight = async (): Promise<number> => {
  const rpc = new RpcClient({ endpoint: INDEXER_CONFIG.rpcUrl })
  const latestBlockhash = await rpc.getLatestBlockhash()
  return Number(latestBlockhash.lastValidBlockHeight)
}

/**
 * Initializes and configures the Solana indexer with event listeners.
 * This is the main function that sets up the indexer to listen for specific program events
 * and store them in the database.
 *
 * @returns Promise<Indexer> The configured and started indexer instance
 *
 * @example
 * ```typescript
 * const indexer = await initializeIndexer();
 * // Indexer is now running and listening for events
 * ```
 *
 * @customization
 * **IMPORTANT: You should modify the following sections:**
 *
 * 1. **Program ID** (line ~40): Change "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P" to your target program's ID
 * 2. **IDL Import** (line ~3): Import your program's IDL file instead of pump-fun.json
 * 3. **Event Name** (line ~42): Change "TradeEvent" to match your program's event name
 * 4. **Event Handler** (lines ~44-68): Modify the handler to process your specific event data structure
 * 5. **Database Schema** (line ~4): Import and use your custom table schema instead of tradesTable
 * 6. **Event Data Structure** (lines ~39-51): Update the TypeScript types to match your event's structure
 * 7. **Database Insert** (lines ~58-67): Modify the database insertion logic for your data structure
 */
export const initializeIndexer = async () => {
  // fetch latest block height as default
  if (INDEXER_CONFIG.startBlock === undefined) {
    INDEXER_CONFIG.startBlock = await getLatestBlockHeight()
  }

  /// configure your indexer here
  const indexer = new Indexer(INDEXER_CONFIG as IndexerConfig)

  /// configure your event listeners here
  await indexer.onEvent<typeof pumpFunIdl, 'TradeEvent'>({
    programId: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P', // 🔧 MODIFY: Replace with your program ID
    idl: pumpFunIdl, // 🔧 MODIFY: Replace with your program's IDL
    eventName: 'TradeEvent', // 🔧 MODIFY: Replace with your event name
    handler: async (
      event: IndexerEvent<typeof pumpFunIdl, 'TradeEvent'>, // 🔧 MODIFY: Update this type to match your event structure
      db,
    ) => {
      // 🔧 MODIFY: Replace this database insertion with your custom logic
      await db.insert(tradesTable).values({
        // 🔧 MODIFY: Replace tradesTable with your table
        mint: event.params.mint.toString(),
        solAmount: event.params.sol_amount.toString(),
        tokenAmount: event.params.token_amount.toString(),
        isBuy: event.params.is_buy,
        user: event.params.user.toString(),
        virtualSolReserves: event.params.virtual_sol_reserves.toString(),
        virtualTokenReserves: event.params.virtual_token_reserves.toString(),
        timestamp: new Date(Number(event.params.timestamp) * 1000),
      })
    },
  })

  // TODO: uncomment to demonstrate transaction indexing
  // await indexer.onTransaction({
  //   filterByProgramIds: ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
  //   filterByInstructions: ["transferChecked"],
  //   handler: async (transaction: IndexerTransaction) => {
  //     console.log(
  //       "Transaction parsed:",
  //       JSON.stringify(transaction, (key, value) =>
  //         typeof value === "bigint" ? value.toString() : value,
  //       2)
  //     );
  //   },
  // });

  /// start the indexer
  await indexer.start()

  return indexer
}

/**
 * Stops the running indexer gracefully.
 * This function should be called when you want to shut down the indexer,
 * typically during application shutdown or when restarting the indexer.
 *
 * @param indexer - The Indexer instance to stop
 * @returns Promise<void> Resolves when the indexer has been stopped
 *
 * @example
 * ```typescript
 * const indexer = await initializeIndexer();
 * // ... do some work ...
 * await stopIndexer(indexer);
 * ```
 */
export const stopIndexer = async (indexer: Indexer) => indexer.stop()
