import { BaseAPI } from './BaseAPI'

/**
 * Free Endpoint API
 * Simple GET request to /api/free - no payment required
 */
export class FreeAPI extends BaseAPI {
  constructor() {
    super({
      name: 'Free Endpoint',
      path: '/api/free',
      method: 'GET',
      description: 'Free endpoint - no payment required',
      requiresPayment: false,
      buttonId: 'test-free-btn',
      responseId: 'free-response',
    })
  }
}
