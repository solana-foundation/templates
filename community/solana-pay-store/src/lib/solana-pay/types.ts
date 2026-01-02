import type { PublicKey } from '@solana/web3.js'
import type BigNumber from 'bignumber.js'

export type PaymentStatus = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed'

export interface PaymentRequest {
  url: URL
  reference: PublicKey
  amount: BigNumber
  recipient: PublicKey
  splToken?: PublicKey
  memo?: string
}
