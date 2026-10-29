import {
  DappIdentity,
  SeekerConnect,
  SeekerSignInPayload,
  SeekerSignInResult,
  StoredAuthorization,
} from '@solana-mobile/seeker-connect-react-native'
import {
  Address,
  appendTransactionMessageInstructions,
  compileTransaction,
  createTransactionMessage,
  getBase58Decoder,
  getTransactionEncoder,
  Instruction,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Client, createDefaultClient, SolanaCluster } from '@wallet-ui/react-native-kit'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

export interface SeekerWalletAccount {
  address: Address
  label: string
}

export interface SeekerWalletContextValue {
  account?: SeekerWalletAccount
  chain: string
  client: Client
  connect: () => Promise<SeekerWalletAccount>
  disconnect: () => Promise<void>
  identity: DappIdentity
  sendTransactions: (instructions: Instruction[]) => Promise<string>
  signIn: (payload?: SeekerSignInPayload) => Promise<SeekerSignInResult>
  signMessages: (message: Uint8Array) => Promise<Uint8Array>
}

const SeekerWalletContext = createContext<SeekerWalletContextValue>({} as SeekerWalletContextValue)

export function useSeekerWallet() {
  return useContext(SeekerWalletContext)
}

export function SeekerWalletProvider({
  children,
  cluster,
  identity,
}: PropsWithChildren<{ cluster: SolanaCluster; identity: DappIdentity }>) {
  const chain = cluster.id
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['seeker-authorization', chain], [chain])
  const { data: authorization } = useQuery({
    queryKey,
    queryFn: async () => {
      await SeekerConnect.configure({ chain, identity })
      const restored = await SeekerConnect.restore()
      return restored?.chain === chain ? restored : null
    },
  })
  const client = useMemo(() => createDefaultClient(cluster), [cluster])

  const value = useMemo<SeekerWalletContextValue>(() => {
    const account = toAccount(authorization)

    async function seeker() {
      await SeekerConnect.configure({ chain, identity })
      return SeekerConnect
    }

    async function setAuthorization(next: StoredAuthorization | null) {
      await queryClient.cancelQueries({ queryKey })
      queryClient.setQueryData(queryKey, next)
    }

    function connected() {
      if (!account) throw new Error('Connect a wallet first')
      return account
    }

    return {
      account,
      chain,
      client,
      async connect() {
        const next = await (await seeker()).connect()
        await setAuthorization(next)
        return toAccount(next)!
      },
      async disconnect() {
        await (await seeker()).disconnect()
        await setAuthorization(null)
      },
      identity,
      async sendTransactions(instructions) {
        const { address } = connected()
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()
        const transaction = pipe(
          createTransactionMessage({ version: 0 }),
          (message) => setTransactionMessageFeePayer(address, message),
          (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
          (message) => appendTransactionMessageInstructions(instructions, message),
          compileTransaction,
        )
        const payload = new Uint8Array(getTransactionEncoder().encode(transaction))
        const [signature] = await (await seeker()).signAndSendTransactions([payload])
        return getBase58Decoder().decode(signature)
      },
      async signIn(payload) {
        const client = await seeker()
        const result = await client.signIn(payload)
        await setAuthorization(await client.restore())
        return result
      },
      async signMessages(message) {
        const { address } = connected()
        const [signed] = await (await seeker()).signMessages([address], [message])
        return signed
      },
    }
  }, [authorization, chain, client, identity, queryClient, queryKey])

  return <SeekerWalletContext.Provider value={value}>{children}</SeekerWalletContext.Provider>
}

function toAccount(authorization: StoredAuthorization | null | undefined): SeekerWalletAccount | undefined {
  const account = authorization?.accounts[0]
  return account ? { address: account.address as Address, label: account.label ?? account.address } : undefined
}
