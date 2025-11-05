/**
 * x402 Solana Facilitator Application
 * TypeScript implementation using Gill SDK with Gill template patterns
 */

import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getFacilitatorContext } from '../lib/get-facilitator-context.js';
import {
  healthCheckRoute,
  verifyPaymentRoute,
  settlePaymentRoute,
  getNonceRoute,
  getStatsRoute,
  cleanupNoncesRoute,
} from '../routes/index.js';
import { REQUEST_BODY_LIMIT, CLEANUP_INTERVAL_MS } from '../lib/constants.js';

// Initialize context
const context = await getFacilitatorContext();
const app: Express = express();

// Setup middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  context.log.info(`${req.method} ${req.path}`);
  next();
});

// Setup routes
app.get(
  '/health',
  healthCheckRoute({
    facilitatorAddress: context.facilitatorAddress,
    rpcEndpoint: context.config.solanaRpcUrl,
  })
);

app.post(
  '/verify',
  verifyPaymentRoute({
    solanaUtils: context.solanaUtils,
    nonceDb: context.nonceDb,
    facilitatorAddress: context.facilitatorAddress,
    maxPaymentAmount: context.config.maxPaymentAmount,
  })
);

app.post(
  '/settle',
  settlePaymentRoute({
    solanaUtils: context.solanaUtils,
    nonceDb: context.nonceDb,
    facilitatorAddress: context.facilitatorAddress,
    facilitatorKeypair: context.facilitatorKeypair,
    simulateTransactions: context.config.simulateTransactions,
    config: {
      facilitatorPrivateKey: context.config.facilitatorPrivateKey,
    },
  })
);

app.get(
  '/nonce/:nonce',
  getNonceRoute({
    nonceDb: context.nonceDb,
  })
);

app.get(
  '/stats',
  getStatsRoute({
    nonceDb: context.nonceDb,
  })
);

app.post(
  '/cleanup',
  cleanupNoncesRoute({
    nonceDb: context.nonceDb,
  })
);

// Initialize and start the application
async function start() {
  try {
    // Initialize database
    await context.nonceDb.initialize();

    // Start cleanup interval
    setInterval(async () => {
      try {
        await context.nonceDb.cleanupExpiredNonces();
      } catch (error) {
        context.log.error('Cleanup error:', error);
      }
    }, CLEANUP_INTERVAL_MS);

    // Start server
    app.listen(context.config.port, () => {
      context.log.info(`Facilitator App running on port ${context.config.port}`);
      context.log.info(`Facilitator Public Key: ${context.facilitatorAddress.toString()}`);
      context.log.info(`Solana RPC: ${context.config.solanaRpcUrl}`);
      context.log.info(`Simulation Mode: ${context.config.simulateTransactions}`);
    });
  } catch (error) {
    context.log.error('Failed to start Facilitator App:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  context.log.info('Shutting down Facilitator App...');
  await context.nonceDb.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the app
start();

export { app, context };
