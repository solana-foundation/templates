import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type WalletAuthRequest, type WalletAuthResponse } from '@/lib/api'

export const useWalletAuthMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: WalletAuthRequest): Promise<WalletAuthResponse> => apiClient.authenticateWallet(data),

    onSuccess: (data) => {
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })

      // Optionally cache the user data
      queryClient.setQueryData(['user', data.user.walletAddress], data.user)
    },

    onError: (error) => {
      console.error('Wallet authentication failed:', error)
    },
  })
}

// Hook for optimistic updates and better UX
export const useOptimisticWalletAuth = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: WalletAuthRequest): Promise<WalletAuthResponse> => {
      // Optimistically update the UI
      const optimisticUser = {
        id: 'temp-' + Date.now(),
        walletAddress: data.walletAddress,
        supabaseUserId: data.supabaseUserId,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      queryClient.setQueryData(['user', data.walletAddress], optimisticUser)

      try {
        const result = await apiClient.authenticateWallet(data)
        return result
      } catch (error) {
        // Rollback optimistic update on error
        queryClient.removeQueries({ queryKey: ['user', data.walletAddress] })
        throw error
      }
    },

    onSuccess: (data) => {
      // Replace optimistic data with real data
      queryClient.setQueryData(['user', data.user.walletAddress], data.user)
    },
  })
}
