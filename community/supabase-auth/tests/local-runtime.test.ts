// @vitest-environment node
import { expect, test } from 'vitest'
import { createClient, generateKeyPairSigner, lamports } from '@solana/kit'
import { solanaRpc } from '@solana/kit-plugin-rpc'
import type { AppClient } from '../src/lib/solana-client'
import { prepareTransfer } from '../src/lib/prepare-transfer'

const url = process.env.SOLANA_TEST_RPC_URL
test.skipIf(!url)(
  'confirms a V1 transfer and the exact recipient balance on an isolated runtime',
  async () => {
    if (!url || new URL(url).hostname !== '127.0.0.1') throw new Error('Local runtime required')
    const signer = await generateKeyPairSigner()
    const recipient = await generateKeyPairSigner()
    const connection = { signer, supportedTransactionVersions: new Set([1]) }
    const client = createClient()
      .use(() => ({ payer: signer, wallet: { getState: () => ({ connected: connection }) } }))
      .use(
        solanaRpc({
          rpcUrl: url,
          rpcSubscriptionsUrl: process.env.SOLANA_TEST_WS_URL!,
          transactionConfig: { version: 1 },
        }),
      )
    const airdrop = await client.rpc.requestAirdrop(signer.address, lamports(1_000_000_000n)).send()
    expect(airdrop).toBeTruthy()
    const instructions = await prepareTransfer(
      client as unknown as AppClient,
      recipient.address,
      '0.001',
      new AbortController().signal,
    )
    const result = await client.sendTransaction(instructions)
    const tx = await client.rpc
      .getTransaction(result.context.signature, {
        encoding: 'json',
        maxSupportedTransactionVersion: 1,
        commitment: 'confirmed',
      })
      .send()
    expect(tx?.version).toBe(1)
    expect(tx?.meta?.err).toBeNull()
    expect((await client.rpc.getBalance(recipient.address).send()).value).toBe(1_000_000n)
  },
  30_000,
)
