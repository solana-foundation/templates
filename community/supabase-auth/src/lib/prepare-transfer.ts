import { address } from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'
import type { AppClient } from './solana-client'
import { parseSol } from './sol-amount'

export async function prepareTransfer(client: AppClient, destination: string, amount: string, signal: AbortSignal) {
  const connected = client.wallet.getState().connected
  if (!connected?.signer) throw new Error('Connect a signing wallet first.')
  if (!connected.supportedTransactionVersions.has(1)) throw new Error('This wallet does not support V1 transactions.')
  const recipient = address(destination.trim())
  const value = parseSol(amount)
  const balance = await client.rpc.getBalance(connected.signer.address).send({ abortSignal: signal })
  signal.throwIfAborted()
  if (balance.value < value + 5_000n) throw new Error('Not enough SOL for the transfer and transaction fee.')
  if (client.wallet.getState().connected !== connected) throw new Error('Wallet changed. Please try again.')
  return [getTransferSolInstruction({ source: connected.signer, destination: recipient, amount: value })]
}
