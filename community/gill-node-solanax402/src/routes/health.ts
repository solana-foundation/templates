/**
 * Health check routes
 */

import type { Request, Response } from 'express';
import type { Address } from 'gill';
import { successResponse } from '../lib/api-response-helpers.js';

export interface HealthRouteContext {
  facilitatorAddress: Address;
  rpcEndpoint: string;
}

/**
 * Health check endpoint
 */
export function healthCheckRoute(context: HealthRouteContext) {
  return (_req: Request, res: Response) => {
    res.json(
      successResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        facilitator: context.facilitatorAddress.toString(),
      })
    );
  };
}
