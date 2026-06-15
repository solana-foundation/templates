import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc'
import { coinWithBalance } from '@mysten/sui/transactions'
import type { Transaction, TransactionObjectArgument } from '@mysten/sui/transactions'
import { getNetworkConfig, type IkaConfig } from '@ika.xyz/sdk'

/**
 * Sui, the backstage chain.
 *
 * Ika is a Sui-based threshold-signature network, so every dWallet operation
 * (DKG, presign, sign) is driven by a Sui transaction whose fees are paid by
 * the connected "operator" Sui wallet. The operator needs:
 *   - SUI for gas  -> faucet.testnet.sui.io
 *   - IKA for the protocol fee -> faucet.ika.xyz (swap SUI -> IKA)
 *
 * None of this is visible to the end user beyond a single OperatorPanel; the
 * star of the show is the Solana account the dWallet controls.
 */

export const SUI_RPC_URL = import.meta.env.VITE_SUI_RPC_URL ?? getJsonRpcFullnodeUrl('testnet')

export const IKA_NETWORK = (import.meta.env.VITE_IKA_NETWORK ?? 'testnet') as 'testnet' | 'mainnet'

export const suiClient = new SuiJsonRpcClient({ url: SUI_RPC_URL, network: 'testnet' })

export const ikaConfig: IkaConfig = getNetworkConfig(IKA_NETWORK)

/** The fully-qualified IKA coin type for the configured network. */
export const IKA_COIN_TYPE = `${ikaConfig.packages.ikaPackage}::ika::IKA`

/**
 * Approximate per-operation fees (from the Ika reference implementations).
 * The IKA fee is the protocol fee; the SUI is gas. We attach a small buffer
 * via `coinWithBalance` which auto-selects/splits coins from the operator.
 */
export const IKA_FEE_PER_OP = 500_000_000n // 0.5 IKA (9 decimals)
export const SUI_FEE_PER_OP = 50_000_000n // 0.05 SUI (9 decimals)

/**
 * Build the IKA + SUI fee coins for one Ika op and a function that transfers
 * the leftover coin objects back to the operator.
 *
 * `coinWithBalance` splits a coin of the requested balance out of the operator's
 * coins. The Ika Move call takes what it needs, but the coin *objects* are
 * returned and must be consumed, or Sui rejects the PTB at resolution time with
 * `UnusedValueWithoutDrop`. So we keep the same coin references and transfer
 * them back. Mirrors ikavery's `replenish.ts` pattern.
 */
export function feeCoins(
  tx: Transaction,
  operatorAddress: string,
  ika: bigint = IKA_FEE_PER_OP,
  sui: bigint = SUI_FEE_PER_OP,
): { ikaCoin: TransactionObjectArgument; suiCoin: TransactionObjectArgument; transferChange: () => void } {
  const ikaCoin = tx.add(coinWithBalance({ type: IKA_COIN_TYPE, balance: ika }))
  const suiCoin = tx.add(coinWithBalance({ balance: sui }))
  return {
    ikaCoin,
    suiCoin,
    transferChange: () => tx.transferObjects([ikaCoin, suiCoin], operatorAddress),
  }
}

export interface OperatorBalances {
  sui: bigint
  ika: bigint
}

/** Fetch the operator's SUI + IKA balances. */
export async function getOperatorBalances(address: string): Promise<OperatorBalances> {
  const [sui, ika] = await Promise.all([
    suiClient.getBalance({ owner: address }),
    suiClient.getBalance({ owner: address, coinType: IKA_COIN_TYPE }).catch(() => ({ totalBalance: '0' })),
  ])
  return {
    sui: BigInt(sui.totalBalance),
    ika: BigInt(ika.totalBalance),
  }
}

/** Format a 9-decimal coin amount for display. */
export function formatCoin(amount: bigint, decimals = 9, maxFractionDigits = 4): string {
  const base = 10n ** BigInt(decimals)
  const whole = amount / base
  const fraction = amount % base
  const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, maxFractionDigits).replace(/0+$/, '')
  return fractionStr ? `${whole}.${fractionStr}` : whole.toString()
}

export const SUI_FAUCET_URL = 'https://faucet.testnet.sui.io/v2/gas'
export const SUI_FAUCET_PAGE = 'https://faucet.sui.io/?network=testnet'
export const IKA_FAUCET_PAGE = 'https://faucet.ika.xyz/'

/** Ask the public Sui testnet faucet for gas. Returns true on success. */
export async function requestSuiFromFaucet(address: string): Promise<void> {
  const res = await fetch(SUI_FAUCET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ FixedAmountRequest: { recipient: address } }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Sui faucet request failed (${res.status}). ${text}`.trim())
  }
}
