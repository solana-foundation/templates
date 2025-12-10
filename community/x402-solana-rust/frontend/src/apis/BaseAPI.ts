import { log } from '../utils/logger'

export interface APIConfig {
  name: string
  path: string
  method: string
  description?: string
  requiresPayment?: boolean
  buttonId: string
  responseId: string
}

export interface APIResponse<T = any> {
  response: Response
  data: T
}

/**
 * Base class for API endpoints
 * Extend this to create new API endpoints
 */
export class BaseAPI {
  public readonly name: string
  public readonly path: string
  public readonly method: string
  public readonly description: string
  public readonly requiresPayment: boolean
  public readonly buttonId: string
  public readonly responseId: string

  constructor(config: APIConfig) {
    this.name = config.name
    this.path = config.path
    this.method = config.method || 'POST'
    this.description = config.description || ''
    this.requiresPayment = config.requiresPayment || false
    this.buttonId = config.buttonId
    this.responseId = config.responseId
  }

  /**
   * Setup event listeners for this API
   */
  setup(apiBaseUrl: string): void {
    const button = document.getElementById(this.buttonId)
    if (button) {
      button.addEventListener('click', () => this.call(apiBaseUrl))
    }
  }

  /**
   * Call the API endpoint
   * Override this in subclasses for custom behavior
   */
  async call(apiBaseUrl: string): Promise<APIResponse | null> {
    const responseEl = document.getElementById(this.responseId)
    if (responseEl) {
      responseEl.classList.remove('show', 'success', 'error')
    }

    try {
      log('info', `Calling ${this.name}...`)
      const response = await this.makeRequest(apiBaseUrl)
      const data = await response.json()

      if (responseEl) {
        responseEl.textContent = JSON.stringify(data, null, 2)
        responseEl.classList.add('show', response.ok ? 'success' : 'error')
      }

      if (response.ok) {
        log('success', `${this.name} successful`)
      } else {
        log('error', `${this.name} failed: ${response.status}`)
      }

      return { response, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (responseEl) {
        responseEl.textContent = `Error: ${errorMessage}`
        responseEl.classList.add('show', 'error')
      }
      log('error', `${this.name} error: ${errorMessage}`)
      throw error
    }
  }

  /**
   * Make the HTTP request
   * Override this for custom headers or body
   */
  async makeRequest(apiBaseUrl: string, options: RequestInit = {}): Promise<Response> {
    return fetch(`${apiBaseUrl}${this.path}`, {
      method: this.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
  }
}
