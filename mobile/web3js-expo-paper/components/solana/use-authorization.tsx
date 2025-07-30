import AsyncStorage from '@react-native-async-storage/async-storage'
import { PublicKey, PublicKeyInitData } from '@solana/web3.js'
import {
  Account as AuthorizedAccount,
  AppIdentity,
  AuthorizationResult,
  AuthorizeAPI,
  AuthToken,
  Base64EncodedAddress,
  DeauthorizeAPI,
  SignInPayload,
} from '@solana-mobile/mobile-wallet-adapter-protocol'
import { toUint8Array } from 'js-base64'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useCluster } from '@/components/cluster/cluster-provider'
import { WalletIcon } from '@wallet-standard/core'
import { ellipsify } from '@/utils/ellipsify'
import { AppConfig } from '@/constants/app-config'

const identity: AppIdentity = { name: AppConfig.name, uri: AppConfig.uri }

export type Account = Readonly<{
  address: Base64EncodedAddress
  displayAddress?: string
  icon?: WalletIcon
  label?: string
  publicKey: PublicKey
}>

type WalletAuthorization = Readonly<{
  accounts: Account[]
  authToken: AuthToken
  selectedAccount: Account
}>

function getAccountFromAuthorizedAccount(account: AuthorizedAccount): Account {
  const publicKey = getPublicKeyFromAddress(account.address)
  return {
    address: account.address,
    // TODO: Fix?
    displayAddress: (account as unknown as { display_address: string }).display_address,
    icon: account.icon,
    label: account.label ?? ellipsify(publicKey.toString(), 8),
    publicKey,
  }
}

function getAuthorizationFromAuthorizationResult(
  authorizationResult: AuthorizationResult,
  previouslySelectedAccount?: Account,
): WalletAuthorization {
  let selectedAccount: Account
  if (
    // We have yet to select an account.
    previouslySelectedAccount == null ||
    // The previously selected account is no longer in the set of authorized addresses.
    !authorizationResult.accounts.some(({ address }) => address === previouslySelectedAccount.address)
  ) {
    const firstAccount = authorizationResult.accounts[0]
    selectedAccount = getAccountFromAuthorizedAccount(firstAccount)
  } else {
    selectedAccount = previouslySelectedAccount
  }
  return {
    accounts: authorizationResult.accounts.map(getAccountFromAuthorizedAccount),
    authToken: authorizationResult.auth_token,
    selectedAccount,
  }
}

function getPublicKeyFromAddress(address: Base64EncodedAddress): PublicKey {
  const publicKeyByteArray = toUint8Array(address)
  return new PublicKey(publicKeyByteArray)
}

function cacheReviver(key: string, value: any) {
  if (key === 'publicKey') {
    return new PublicKey(value as PublicKeyInitData) // the PublicKeyInitData should match the actual data structure stored in AsyncStorage
  } else {
    return value
  }
}

const AUTHORIZATION_STORAGE_KEY = 'authorization-cache'

const queryKey = ['wallet-authorization']

function usePersistAuthorization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (auth: WalletAuthorization | null): Promise<void> => {
      await AsyncStorage.setItem(AUTHORIZATION_STORAGE_KEY, JSON.stringify(auth))
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey })
    },
  })
}

function useFetchAuthorization() {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<WalletAuthorization | null> => {
      const cacheFetchResult = await AsyncStorage.getItem(AUTHORIZATION_STORAGE_KEY)

      // Return prior authorization, if found.
      return cacheFetchResult ? JSON.parse(cacheFetchResult, cacheReviver) : null
    },
  })
}

function useInvalidateAuthorizations() {
  const client = useQueryClient()
  return () => client.invalidateQueries({ queryKey })
}

export function useAuthorization() {
  const { selectedCluster } = useCluster()
  const fetchQuery = useFetchAuthorization()
  const invalidateAuthorizations = useInvalidateAuthorizations()
  const persistMutation = usePersistAuthorization()

  const handleAuthorizationResult = useCallback(
    async (authorizationResult: AuthorizationResult): Promise<WalletAuthorization> => {
      const nextAuthorization = getAuthorizationFromAuthorizationResult(
        authorizationResult,
        fetchQuery.data?.selectedAccount,
      )
      await persistMutation.mutateAsync(nextAuthorization)
      return nextAuthorization
    },
    [fetchQuery.data?.selectedAccount, persistMutation],
  )

  const authorizeSession = useCallback(
    async (wallet: AuthorizeAPI) => {
      const authorizationResult = await wallet.authorize({
        identity,
        chain: selectedCluster.id,
        auth_token: fetchQuery.data?.authToken,
      })
      return (await handleAuthorizationResult(authorizationResult)).selectedAccount
    },
    [fetchQuery.data?.authToken, handleAuthorizationResult, selectedCluster.id],
  )

  const authorizeSessionWithSignIn = useCallback(
    async (wallet: AuthorizeAPI, signInPayload: SignInPayload) => {
      const authorizationResult = await wallet.authorize({
        identity,
        chain: selectedCluster.id,
        auth_token: fetchQuery.data?.authToken,
        sign_in_payload: signInPayload,
      })
      return (await handleAuthorizationResult(authorizationResult)).selectedAccount
    },
    [fetchQuery.data?.authToken, handleAuthorizationResult, selectedCluster.id],
  )

  const deauthorizeSession = useCallback(
    async (wallet: DeauthorizeAPI) => {
      if (fetchQuery.data?.authToken == null) {
        return
      }
      await wallet.deauthorize({ auth_token: fetchQuery.data.authToken })
      await persistMutation.mutateAsync(null)
    },
    [fetchQuery.data?.authToken, persistMutation],
  )

  const deauthorizeSessions = useCallback(async () => {
    await invalidateAuthorizations()
    await persistMutation.mutateAsync(null)
  }, [invalidateAuthorizations, persistMutation])

  return useMemo(
    () => ({
      accounts: fetchQuery.data?.accounts ?? null,
      authorizeSession,
      authorizeSessionWithSignIn,
      deauthorizeSession,
      deauthorizeSessions,
      isLoading: fetchQuery.isLoading,
      selectedAccount: fetchQuery.data?.selectedAccount ?? null,
    }),
    [
      authorizeSession,
      authorizeSessionWithSignIn,
      deauthorizeSession,
      deauthorizeSessions,
      fetchQuery.data?.accounts,
      fetchQuery.data?.selectedAccount,
      fetchQuery.isLoading,
    ],
  )
}
