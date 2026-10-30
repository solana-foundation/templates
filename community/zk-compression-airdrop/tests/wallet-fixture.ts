import { getAddressDecoder } from '@solana/kit'
import { getWallets } from '@wallet-standard/app'

export function makeAccount(last: number) {
  const publicKey = new Uint8Array(32)
  publicKey[31] = last
  return {
    address: getAddressDecoder().decode(publicKey),
    publicKey,
    chains: ['solana:devnet', 'solana:testnet', 'solana:mainnet'] as const,
    features: ['solana:signTransaction', 'solana:signMessage'] as const,
  }
}
export function registerTestWallet(name = 'Test Wallet', versions: readonly ('legacy' | 0 | 1)[] = ['legacy', 0, 1]) {
  const first = makeAccount(1)
  const second = makeAccount(2)
  let accounts: readonly ReturnType<typeof makeAccount>[] = []
  const listeners = new Set<(change: { accounts: typeof accounts }) => void>()
  const change = (next: typeof accounts) => {
    accounts = next
    listeners.forEach((listener) => listener({ accounts }))
  }
  const wallet = {
    name,
    version: '1.0.0' as const,
    icon: 'data:image/png;base64,' as const,
    chains: first.chains,
    get accounts() {
      return accounts
    },
    features: {
      'standard:connect': {
        version: '1.0.0' as const,
        connect: async (options?: { silent?: boolean }) => {
          if (!options?.silent) change([first])
          return { accounts }
        },
      },
      'standard:disconnect': { version: '1.0.0' as const, disconnect: async () => change([]) },
      'standard:events': {
        version: '1.0.0' as const,
        on: (_event: 'change', listener: (change: { accounts: typeof accounts }) => void) => {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
      },
      'solana:signTransaction': {
        version: '1.0.0' as const,
        supportedTransactionVersions: versions,
        signTransaction: async () => {
          throw new Error('Wallet rejected the transaction')
        },
      },
      'solana:signMessage': {
        version: '1.0.0' as const,
        signMessage: async (...inputs: { message: Uint8Array }[]) =>
          inputs.map((input) => ({ signedMessage: input.message, signature: new Uint8Array(64) })),
      },
    },
  }
  return { wallet, first, second, change, unregister: getWallets().register(wallet) }
}
