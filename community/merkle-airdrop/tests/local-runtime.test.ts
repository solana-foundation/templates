import { expect, test, vi } from 'vitest'
import { AccountRole, address, generateKeyPairSigner, getU64Encoder, lamports } from '@solana/kit'
import { createKitClient, sendKitTransaction } from '../anchor/lib/kit-client'
import { buildMerkleTree, getRootHex } from '../src/lib/merkle-tree'
import { RECIPIENTS_DATA } from '../src/lib/recipients'
import type { AppClient } from '../src/lib/solana-client'
import idl from '../src/lib/idl.json'

const url = process.env.SOLANA_TEST_RPC_URL
test.skipIf(!url)(
  'initializes and claims V1 for an odd recipient tree on a real local runtime',
  async () => {
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(url!).hostname)) throw new Error('Local RPC required')
    vi.stubEnv('DEVNET_RPC_URL', url!)
    vi.stubEnv('DEVNET_RPC_WS_URL', process.env.SOLANA_TEST_WS_URL || '')
    vi.stubEnv('NEXT_PUBLIC_PROGRAM_ID', idl.address)
    try {
      const authority = await generateKeyPairSigner()
      const recipients = await Promise.all(Array.from({ length: 3 }, () => generateKeyPairSigner()))
      const client = createKitClient(authority)
      await client.rpc.requestAirdrop(authority.address, lamports(2_000_000_000n)).send()
      for (const recipient of recipients)
        await client.rpc.requestAirdrop(recipient.address, lamports(20_000_000n)).send()
      const tree = buildMerkleTree(recipients.map((signer) => ({ recipient: signer.address, amount: 10_000_000n })))
      Object.assign(RECIPIENTS_DATA, {
        programId: idl.address,
        network: 'devnet',
        merkleRoot: getRootHex(tree.root),
        totalAmount: '30000000',
        recipients: recipients.map((signer, index) => ({
          publicKey: signer.address,
          amount: '10000000',
          index,
          description: 'Local ephemeral test recipient',
        })),
      })
      const { claimAddresses, prepareClaim, checkClaimStatus } = await import('../src/lib/airdrop-client')
      const program = address(idl.address)
      const { state } = await claimAddresses(program, recipients[0].address)
      const signature = await sendKitTransaction(client, [
        {
          programAddress: program,
          accounts: [
            { address: state, role: AccountRole.WRITABLE },
            { address: authority.address, role: AccountRole.WRITABLE_SIGNER, signer: authority },
            { address: address('11111111111111111111111111111111'), role: AccountRole.READONLY },
          ],
          data: new Uint8Array([
            ...idl.instructions.find((ix) => ix.name === 'initialize_airdrop')!.discriminator,
            ...tree.root,
            ...getU64Encoder().encode(30_000_000n),
          ]),
        },
      ])
      const initialization = await client.rpc
        .getTransaction(signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 1 })
        .send()
      expect(initialization?.version).toBe(1)
      expect(initialization?.meta?.err).toBeNull()
      // Claim the duplicated odd leaf first, then the other two recipients.
      for (const signer of [recipients[2], recipients[0], recipients[1]]) {
        const signedClient = createKitClient(signer)
        const app = {
          ...signedClient,
          wallet: { getState: () => ({ connected: { signer, supportedTransactionVersions: new Set([1]) } }) },
        } as unknown as AppClient
        const before = await app.rpc.getBalance(signer.address).send()
        const prepared = await prepareClaim(app, new AbortController().signal)
        const sent = await app.sendTransaction(prepared.message)
        const tx = await app.rpc
          .getTransaction(sent.context.signature, {
            encoding: 'json',
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 1,
          })
          .send()
        expect(tx?.version).toBe(1)
        expect(tx?.meta?.err).toBeNull()
        const rent = await app.rpc.getMinimumBalanceForRentExemption(8n).send()
        const after = await app.rpc.getBalance(signer.address).send()
        expect(after.value - before.value).toBe(10_000_000n - rent - tx!.meta!.fee)
        expect(await checkClaimStatus(app, program, signer.address)).toBe(true)
        await expect(prepareClaim(app, new AbortController().signal)).rejects.toThrow('Already claimed')
      }
    } finally {
      vi.unstubAllEnvs()
    }
  },
  90_000,
)
