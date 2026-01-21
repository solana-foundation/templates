/**
 * Nonce management routes
 */

import type { Request, Response } from 'express';
import type { NonceDatabase } from '../lib/nonce-database.js';
import { successResponse, errorResponse } from '../lib/api-response-helpers.js';

export interface NonceRouteContext {
  nonceDb: NonceDatabase;
}

/**
 * Get nonce status endpoint
 */
export function getNonceRoute(context: NonceRouteContext) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const nonce = req.params.nonce;
      const details = await context.nonceDb.getNonceDetails(nonce);

      if (!details) {
        res.status(404).json(errorResponse('Nonce not found', 'NONCE_NOT_FOUND', 404));
        return;
      }

      res.json(successResponse(details));
    } catch (error) {
      res.status(500).json(errorResponse(error instanceof Error ? error.message : 'Unknown error', 'NONCE_ERROR', 500));
    }
  };
}
