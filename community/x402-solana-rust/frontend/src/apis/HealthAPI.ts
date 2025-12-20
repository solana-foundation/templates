import { BaseAPI } from './BaseAPI'

/**
 * Health Check API
 * Simple GET request to /api/health
 */
export class HealthAPI extends BaseAPI {
  constructor() {
    super({
      name: 'Health Check',
      path: '/api/health',
      method: 'GET',
      description: 'Health check - returns server status',
      requiresPayment: false,
      buttonId: 'test-health-btn',
      responseId: 'health-response',
    })
  }
}
