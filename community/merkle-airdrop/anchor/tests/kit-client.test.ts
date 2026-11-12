import { describe, expect, it, vi } from 'vitest'
import {
  address,
  blockhash,
  generateKeyPairSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { createKitClient, getKitRpcUrl, sendKitTransaction } from '../lib/kit-client'

describe('Kit V1 client (offline)', () => {
  it('plans V1 with a real fee payer even when no instruction requires its signature', async () => {
    const payer = await generateKeyPairSigner()
    const client = createKitClient(payer, 'devnet', 'http://127.0.0.1:8899')
    const message = await client.planTransaction([
      {
        programAddress: address('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: new TextEncoder().encode('offline'),
      },
    ])
    expect(message.version).toBe(1)
    expect(message.feePayer.address).toBe(payer.address)
    const signed = await signTransactionMessageWithSigners(
      setTransactionMessageLifetimeUsingBlockhash(
        {
          blockhash: blockhash('11111111111111111111111111111111'),
          lastValidBlockHeight: 100n,
        },
        message,
      ),
    )
    expect(signed.signatures[payer.address]).not.toBeNull()
  })

  it('plans before sending and extracts the confirmed signature context', async () => {
    const message = { version: 1 }
    const plan = vi.fn().mockResolvedValue(message)
    const send = vi.fn().mockResolvedValue({ context: { signature: 'test-signature' } })
    const client = { planTransaction: plan, sendTransaction: send } as unknown as ReturnType<typeof createKitClient>
    expect(await sendKitTransaction(client, [])).toBe('test-signature')
    expect(plan).toHaveBeenCalledWith([])
    expect(send).toHaveBeenCalledWith(message)
  })

  it('resolves mainnet-beta and rejects unsupported networks', () => {
    expect(getKitRpcUrl('mainnet-beta')).toMatch(/^https?:\/\//)
    expect(() => getKitRpcUrl('unsupported')).toThrow('Unsupported network')
  })

  it('does not send or retry when planning fails', async () => {
    const plan = vi.fn().mockRejectedValue(new Error('planning failed'))
    const send = vi.fn()
    const client = { planTransaction: plan, sendTransaction: send } as unknown as ReturnType<typeof createKitClient>
    await expect(sendKitTransaction(client, [])).rejects.toThrow('planning failed')
    expect(plan).toHaveBeenCalledTimes(1)
    expect(send).not.toHaveBeenCalled()
  })
})
