import type { Address, Lamports } from '@solana/kit'

import { client } from './rpc'

/**
 * Reports the account balance: once from an RPC read, then again on every change, until
 * `abortSignal` fires.
 *
 * Kit's subscriptions are async iterables, so "subscribe" is a loop over an iterator — there is no
 * callback registry to maintain and no unsubscribe function to remember, because aborting the signal
 * ends the loop and closes the socket. Disconnecting a wallet is one `AbortController.abort()`.
 *
 * The order of the calls matters. Kit only queues notifications once the iterator has been polled,
 * so the first poll starts before the read, and a change that lands while the read is in flight is
 * delivered right after it instead of being lost. A queued notification can also predate the read,
 * so each value carries its slot and anything older than the newest one seen is dropped.
 *
 * That order is also why the subscription is opened on a signal of this function's own, aborted on
 * the way out. A rejecting read returns before the loop begins, so the subscription would
 * otherwise be left open with nobody reading it — waiting on the caller to abort a stream it never
 * saw start.
 */
export async function trackBalance({
  abortSignal,
  address,
  onBalance,
}: {
  abortSignal: AbortSignal
  address: Address
  onBalance: (lamports: Lamports) => void
}): Promise<void> {
  const done = new AbortController()
  const signal = AbortSignal.any([abortSignal, done.signal])

  try {
    const notifications = await client.rpcSubscriptions
      .accountNotifications(address, { commitment: 'confirmed' })
      .subscribe({ abortSignal: signal })

    const iterator = notifications[Symbol.asyncIterator]()
    const first = iterator.next()
    // Mark the early poll as handled: if the read fails first, nothing else will await it.
    first.catch(() => undefined)

    const { context, value } = await client.rpc
      .getBalance(address, { commitment: 'confirmed' })
      .send({ abortSignal: signal })
    if (signal.aborted) {
      return
    }
    let slot = context.slot
    onBalance(value)

    for (let result = await first; !result.done; result = await iterator.next()) {
      // Kit still drains queued notifications after an abort; they belong to an account no longer shown.
      if (signal.aborted) {
        return
      }
      if (result.value.context.slot < slot) {
        continue
      }
      slot = result.value.context.slot
      onBalance(result.value.value.lamports)
    }
  } finally {
    done.abort()
  }
}
