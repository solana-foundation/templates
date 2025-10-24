// API client functions

export interface WalletAuthRequest {
  walletAddress: string
  supabaseUserId: string
}

export interface WalletAuthResponse {
  message: string
  user: {
    id: string
    walletAddress: string
    supabaseUserId: string | null
    createdAt: string
    lastLogin: string
  }
}

export interface ApiError {
  error: string
  status?: number
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `/api${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      const error = new Error(errorData.error || 'Request failed') as Error & { status: number }
      error.status = response.status
      throw error
    }

    return response.json()
  }

  async authenticateWallet(data: WalletAuthRequest): Promise<WalletAuthResponse> {
    return this.request<WalletAuthResponse>('/auth/wallet', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
