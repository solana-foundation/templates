/**
 * Statistics routes
 * Directly consumes the stats module instead of calling its own endpoint
 */

import type { Request, Response } from 'express';
import type { NonceDatabase } from '../lib/nonce-database.js';
import { successResponse, errorResponse } from '../lib/api-response-helpers.js';

export interface StatsRouteContext {
  nonceDb: NonceDatabase;
}

/**
 * Get statistics endpoint
 * Directly consumes the nonce database stats instead of making HTTP call
 */
export function getStatsRoute(context: StatsRouteContext) {
  return async (_req: Request, res: Response) => {
    try {
      const stats = await context.nonceDb.getNonceStats();
      res.json(successResponse(stats));
    } catch (error) {
      res.status(500).json(errorResponse(error instanceof Error ? error.message : 'Unknown error', 'STATS_ERROR', 500));
    }
  };
}

/**
 * Cleanup expired nonces endpoint
 */
export function cleanupNoncesRoute(context: StatsRouteContext) {
  return async (_req: Request, res: Response) => {
    try {
      const cleaned = await context.nonceDb.cleanupExpiredNonces();
      console.log(`Cleaned up ${cleaned} expired nonces`);
      res.json(successResponse({ cleaned }));
    } catch (error) {
      res
        .status(500)
        .json(errorResponse(error instanceof Error ? error.message : 'Unknown error', 'CLEANUP_ERROR', 500));
    }
  };
}
