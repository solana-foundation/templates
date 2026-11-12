import {
  AccountRole,
  address,
  compileTransactionMessage,
  estimateAndSetResourceLimitsFactory,
  estimateResourceLimitsFactory,
  getAddressEncoder,
  getBase64Decoder,
  getBase64Encoder,
  getCompiledTransactionMessageEncoder,
  getProgramDerivedAddress,
  getUtf8Encoder,
  setTransactionMessageLifetimeUsingBlockhash,
  type Address,
  type TransactionMessageBytesBase64,
} from '@solana/kit'
import type { AppClient } from './solana-client'
import { generateProofForRecipient } from './merkle-tree'
import { serializeClaimInstructionData } from './airdrop-instructions'
import { AIRDROP_CONFIG, validateConfig } from './config'
import idl from './idl.json'

function hasDiscriminator(bytes: ArrayLike<number>, name: string) {
  const discriminator = idl.accounts.find((account) => account.name === name)!.discriminator
  return discriminator.every((byte, index) => bytes[index] === byte)
}

export async function claimAddresses(programAddress: Address, recipient: Address) {
  const [state] = await getProgramDerivedAddress({ programAddress, seeds: [getUtf8Encoder().encode('merkle_tree')] })
  const [claim] = await getProgramDerivedAddress({
    programAddress,
    seeds: [getUtf8Encoder().encode('claim'), getAddressEncoder().encode(state), getAddressEncoder().encode(recipient)],
  })
  return { state, claim }
}

export async function checkClaimStatus(client: AppClient, program: Address, recipient: Address, signal?: AbortSignal) {
  const { claim } = await claimAddresses(program, recipient)
  const info = await client.rpc
    .getAccountInfo(claim, { encoding: 'base64', commitment: 'confirmed' })
    .send({ abortSignal: signal })
  if (info.value && info.value.owner !== program) throw new Error('Claim account has an unexpected owner.')
  if (info.value && !hasDiscriminator(getBase64Encoder().encode(info.value.data[0]), 'ClaimStatus')) {
    throw new Error('Invalid claim account discriminator.')
  }
  return info.value !== null
}

export async function prepareClaim(client: AppClient, signal: AbortSignal) {
  validateConfig()
  const wallet = client.wallet.getState().connected
  if (!wallet?.signer || !wallet.supportedTransactionVersions.has(1)) {
    throw new Error('Connect a wallet that supports Version 1 transactions.')
  }
  const signer = wallet.signer
  const program = address(AIRDROP_CONFIG.AIRDROP_PROGRAM_ID!)
  const proof = generateProofForRecipient(signer.address)
  if (!proof) throw new Error('This wallet is not eligible for this airdrop.')
  if (await checkClaimStatus(client, program, signer.address, signal))
    throw new Error('Already claimed for this wallet.')
  const { state, claim } = await claimAddresses(program, signer.address)
  const stateInfo = await client.rpc
    .getAccountInfo(state, { encoding: 'base64', commitment: 'confirmed' })
    .send({ abortSignal: signal })
  if (!stateInfo.value || stateInfo.value.owner !== program)
    throw new Error('Airdrop is not initialized for this program.')
  const stateBytes = getBase64Encoder().encode(stateInfo.value.data[0])
  if (stateBytes.length < 89 || !hasDiscriminator(stateBytes, 'AirdropState')) throw new Error('Invalid airdrop state.')
  const { merkleRoot } = await import('./recipients').then(({ RECIPIENTS_DATA }) => RECIPIENTS_DATA)
  const rootHex = Array.from(stateBytes.slice(8, 40), (byte) => byte.toString(16).padStart(2, '0')).join('')
  if (`0x${rootHex}` !== merkleRoot.toLowerCase())
    throw new Error('Recipient data does not match the on-chain airdrop root. Regenerate the recipient data.')
  const instruction = {
    programAddress: program,
    accounts: [
      { address: state, role: AccountRole.WRITABLE },
      { address: claim, role: AccountRole.WRITABLE },
      { address: signer.address, role: AccountRole.WRITABLE_SIGNER, signer },
      { address: address('11111111111111111111111111111111'), role: AccountRole.READONLY },
    ],
    data: serializeClaimInstructionData(proof),
  }
  const rent = await client.rpc.getMinimumBalanceForRentExemption(8n).send({ abortSignal: signal })
  const balance = await client.rpc.getBalance(signer.address, { commitment: 'confirmed' }).send({ abortSignal: signal })
  if (balance.value < rent) throw new Error('Insufficient SOL for the claim account rent and transaction fee.')
  const planned = await client.planTransaction([instruction], { abortSignal: signal })
  if (planned.version !== 1) throw new Error('Expected a Version 1 transaction.')
  const { value: blockhash } = await client.rpc
    .getLatestBlockhash({ commitment: 'confirmed' })
    .send({ abortSignal: signal })
  const estimate = estimateAndSetResourceLimitsFactory(estimateResourceLimitsFactory({ rpc: client.rpc }))
  const message = await estimate(setTransactionMessageLifetimeUsingBlockhash(blockhash, planned), {
    abortSignal: signal,
    commitment: 'confirmed',
  })
  const encoded = getBase64Decoder().decode(
    getCompiledTransactionMessageEncoder().encode(compileTransactionMessage(message)),
  ) as TransactionMessageBytesBase64
  const fee = await client.rpc.getFeeForMessage(encoded, { commitment: 'confirmed' }).send({ abortSignal: signal })
  if (fee.value === null) throw new Error('Unable to estimate the fee. Please retry.')
  const freshBalance = await client.rpc
    .getBalance(signer.address, { commitment: 'confirmed' })
    .send({ abortSignal: signal })
  if (freshBalance.value < rent + fee.value)
    throw new Error('Insufficient SOL for the claim account rent and transaction fee.')
  signal.throwIfAborted()
  const current = client.wallet.getState().connected
  if (current?.signer !== signer || !current.supportedTransactionVersions.has(1))
    throw new Error('Wallet changed. Please retry.')
  return { message, amount: proof.amount, recipient: signer.address }
}
