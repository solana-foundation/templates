import { AccountRole, address } from '@solana/kit'
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'
import type { AppClient } from './solana-client'
import type { HeadlessPaymentRequest } from '@/hooks/use-headless-checkout'
import { USDC_MINT } from '@/hooks/use-headless-checkout'
import { usdcMinorUnits } from './verify-payment'

export async function prepareWalletPayment(client: AppClient, request: HeadlessPaymentRequest) {
  const connected = client.wallet.getState().connected
  if (!connected?.signer) throw new Error('Connect a signing wallet first.')
  if (!connected.supportedTransactionVersions.has(1))
    throw new Error('This wallet connection does not report V1 support. Reconnect or use a V1-capable wallet.')
  const signer = connected.signer
  if (signer.address === request.recipient) throw new Error('The payer must be different from the merchant.')
  if (!request.splToken || request.splToken !== USDC_MINT)
    throw new Error('Checkout mint does not match the configured USDC mint.')
  const mint = address(request.splToken)
  const amount = usdcMinorUnits(request.amount)
  const [source] = await findAssociatedTokenPda({ owner: signer.address, mint, tokenProgram: TOKEN_PROGRAM_ADDRESS })
  const [destination] = await findAssociatedTokenPda({
    owner: address(request.recipient),
    mint,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  })
  const sourceAccount = await client.rpc.getAccountInfo(source, { encoding: 'base64' }).send()
  if (!sourceAccount.value) throw new Error('Not enough USDC to pay for this order. Fund your wallet with USDC first.')
  const balance = await client.rpc.getTokenAccountBalance(source).send()
  if (balance.value.decimals !== 6) throw new Error('Expected a six-decimal USDC mint.')
  if (BigInt(balance.value.amount) < amount) throw new Error('Not enough USDC to pay for this order.')
  const sol = await client.rpc.getBalance(signer.address).send()
  const destinationAccount = await client.rpc.getAccountInfo(destination, { encoding: 'base64' }).send()
  const rent = destinationAccount.value ? 0n : await client.rpc.getMinimumBalanceForRentExemption(165n).send()
  if (sol.value < rent + 5_000n) throw new Error('Not enough SOL for transaction fees and token account creation.')
  if (client.wallet.getState().connected?.signer !== signer) throw new Error('Wallet changed. Please try again.')
  const transfer = getTransferCheckedInstruction({ source, destination, mint, authority: signer, amount, decimals: 6 })
  return [
    getCreateAssociatedTokenIdempotentInstruction({
      payer: signer,
      ata: destination,
      owner: address(request.recipient),
      mint,
    }),
    {
      ...transfer,
      accounts: [...transfer.accounts, { address: address(request.reference), role: AccountRole.READONLY }],
    },
  ]
}
