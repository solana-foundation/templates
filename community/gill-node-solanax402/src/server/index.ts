/**
 * x402 Server Application
 * TypeScript implementation with x402 middleware using Gill template patterns
 */

import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getServerContext } from '../lib/get-server-context.js';
import { createX402MiddlewareWithUtils } from '../lib/x402-middleware.js';
import { successResponse, errorResponse } from '../lib/api-response-helpers.js';
import { REQUEST_TIMEOUT, RETRY_ATTEMPTS, REQUEST_BODY_LIMIT, PAYMENT_AMOUNTS } from '../lib/constants.js';

// Initialize context
const context = getServerContext();
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

// Create x402 utils instance
const x402Utils = createX402MiddlewareWithUtils(
  {},
  {
    facilitatorUrl: context.config.facilitatorUrl,
    timeout: REQUEST_TIMEOUT,
    retryAttempts: RETRY_ATTEMPTS,
  }
);

// ============================================================================
// ROUTES
// ============================================================================

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    const facilitatorHealth = await x402Utils.healthCheck();
    res.json(
      successResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        facilitator: facilitatorHealth,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(error instanceof Error ? error.message : 'Unknown error', 'HEALTH_CHECK_FAILED', 500));
  }
});

// Public endpoint (no payment required)
app.get('/public', (_req, res) => {
  res.json(
    successResponse({
      message: 'This is a public endpoint - no payment required',
      timestamp: new Date().toISOString(),
    })
  );
});

// ============================================================================
// PROTECTED ENDPOINTS (x402 Payment Required)
// ============================================================================

// Premium data endpoint - 0.01 SOL
const premiumRouteMw = createX402MiddlewareWithUtils(
  {
    amount: PAYMENT_AMOUNTS.PREMIUM_DATA,
    payTo: context.config.merchantSolanaAddress || context.config.facilitatorPublicKey || '',
    asset: 'SOL',
    network: `solana-${context.config.solanaNetwork}`,
  },
  {
    facilitatorUrl: context.config.facilitatorUrl,
    timeout: REQUEST_TIMEOUT,
    retryAttempts: RETRY_ATTEMPTS,
  }
);

app.get('/api/premium-data', premiumRouteMw.middleware, (req, res) => {
  res.set({
    'x-payment-processed': 'true',
    'x-payment-method': 'solana-sol',
    'x-payment-network': 'devnet',
    'x-payment-transaction': req.payment?.transactionSignature,
  });

  res.json(
    successResponse({
      message: 'Premium data accessed successfully',
      data: {
        secret: 'This is premium content that requires payment',
        timestamp: new Date().toISOString(),
        payment: req.payment,
      },
    })
  );
});

// Generate content endpoint - 0.005 SOL
const generateContentMw = createX402MiddlewareWithUtils(
  {
    amount: PAYMENT_AMOUNTS.GENERATE_CONTENT,
    payTo: context.config.merchantSolanaAddress || context.config.facilitatorPublicKey || '',
    asset: 'SOL',
    network: `solana-${context.config.solanaNetwork}`,
  },
  {
    facilitatorUrl: context.config.facilitatorUrl,
    timeout: REQUEST_TIMEOUT,
    retryAttempts: RETRY_ATTEMPTS,
  }
);

app.post('/api/generate-content', generateContentMw.middleware, (req, res): void => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json(errorResponse('Prompt is required', 'MISSING_PROMPT', 400));
    return;
  }

  res.json(
    successResponse({
      message: 'Content generated successfully',
      data: {
        prompt: prompt,
        generatedContent: `AI-generated content for: "${prompt}"`,
        timestamp: new Date().toISOString(),
        payment: req.payment,
      },
    })
  );
});

// File download endpoint - 0.02 SOL
const downloadMw = createX402MiddlewareWithUtils(
  {
    amount: PAYMENT_AMOUNTS.DOWNLOAD_FILE,
    payTo: context.config.merchantSolanaAddress || context.config.facilitatorPublicKey || '',
    asset: 'SOL',
    network: `solana-${context.config.solanaNetwork}`,
  },
  {
    facilitatorUrl: context.config.facilitatorUrl,
    timeout: REQUEST_TIMEOUT,
    retryAttempts: RETRY_ATTEMPTS,
  }
);

app.get('/api/download/:fileId', downloadMw.middleware, (req, res) => {
  const { fileId } = req.params;

  res.json(
    successResponse({
      message: 'File download authorized',
      data: {
        fileId: fileId,
        // TODO: Implement actual file download URL generation
        downloadUrl: `/files/${fileId}`,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        payment: req.payment,
      },
    })
  );
});

// Tier-based access endpoint - 0.05 SOL
const tierMw = createX402MiddlewareWithUtils(
  {
    amount: PAYMENT_AMOUNTS.TIER_ACCESS,
    payTo: context.config.merchantSolanaAddress || context.config.facilitatorPublicKey || '',
    asset: 'SOL',
    network: `solana-${context.config.solanaNetwork}`,
  },
  {
    facilitatorUrl: context.config.facilitatorUrl,
    timeout: REQUEST_TIMEOUT,
    retryAttempts: RETRY_ATTEMPTS,
  }
);

app.get('/api/tier/:tier', tierMw.middleware, (req, res) => {
  const { tier } = req.params;
  const payment = req.payment;

  res.json(
    successResponse({
      message: `Access granted to ${tier} tier`,
      data: {
        tier: tier,
        features: [`${tier} tier features enabled`],
        payment: payment,
      },
    })
  );
});

// Stats endpoint - public
app.get('/stats', async (_req, res) => {
  try {
    // Get facilitator stats
    const statsResponse = await fetch(`${context.config.facilitatorUrl}/stats`);
    const stats = await statsResponse.json();
    res.json(successResponse(stats));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(error instanceof Error ? error.message : 'Failed to get stats', 'STATS_ERROR', 500));
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json(errorResponse('The requested resource was not found', 'NOT_FOUND', 404));
});

// ============================================================================
// START SERVER
// ============================================================================

async function start() {
  try {
    app.listen(context.config.port, () => {
      context.log.info(`Server App running on port ${context.config.port}`);
      context.log.info(`Facilitator URL: ${context.config.facilitatorUrl}`);
      context.log.info('');
      context.log.info('Available endpoints:');
      context.log.info('  GET  /health - Health check');
      context.log.info('  GET  /public - Public endpoint (no payment)');
      context.log.info('  GET  /api/premium-data - Premium data (payment required)');
      context.log.info('  POST /api/generate-content - Generate content (payment required)');
      context.log.info('  GET  /api/download/:fileId - Download file (payment required)');
      context.log.info('  GET  /api/tier/:tier - Tier-based access (payment required)');
      context.log.info('  GET  /stats - Payment statistics');
    });
  } catch (error) {
    context.log.error('Failed to start Server App:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  context.log.info('Shutting down Server App...');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the app
start();

export { app, context };
