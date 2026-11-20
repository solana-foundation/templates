import type { Address } from '@solana/kit'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Storage from 'expo-sqlite/kv-store'
import { isSkrDomain, resolveAddressOrDomain } from '../../domains/resolve-address-or-domain'

// Friends are an address book for picking contributors and recipients. They
// live on this device only; there is no backend.
export interface Friend {
  address: Address
  displayName?: string
  domain?: string
}

const FRIENDS_KEY = 'friends'

async function readFriends(): Promise<Friend[]> {
  const raw = await Storage.getItem(FRIENDS_KEY)
  return raw ? (JSON.parse(raw) as Friend[]) : []
}

export function useFriendsQuery() {
  return useQuery({ queryKey: ['friends'], queryFn: readFriends })
}

// Adds a friend by wallet address or .skr domain. Domains resolve to the
// owning wallet on mainnet before anything is stored.
export function useAddFriendMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ addressOrDomain, displayName }: { addressOrDomain: string; displayName?: string }) => {
      const input = addressOrDomain.trim()
      const friend: Friend = {
        address: await resolveAddressOrDomain(input),
        displayName,
        domain: isSkrDomain(input) ? input.toLowerCase() : undefined,
      }

      const friends = await readFriends()
      if (friends.some(({ address }) => address === friend.address)) {
        throw new Error('This wallet is already in your friends list.')
      }
      await Storage.setItem(FRIENDS_KEY, JSON.stringify([...friends, friend]))
      return friend
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friends'] }),
  })
}

export function useRemoveFriendMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (friendAddress: Address) => {
      const friends = await readFriends()
      await Storage.setItem(FRIENDS_KEY, JSON.stringify(friends.filter(({ address }) => address !== friendAddress)))
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friends'] }),
  })
}

// The name to show for a wallet: their entry in the friends list, or nothing.
export function findFriendLabel(friends: Friend[] | undefined, address: Address | string): string | undefined {
  const friend = friends?.find((friend) => friend.address === address)
  return friend?.displayName ?? friend?.domain
}
