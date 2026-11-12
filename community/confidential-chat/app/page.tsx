'use client'

import { useState, type FormEvent } from 'react'
import { routeError, sealedChat, verifyEnclave, type Enclave, type Message } from '@/lib/enclave'

// A message in the list. A reply keeps what its enclave was verified as, to show under it.
type Turn = Message & { enclave?: Enclave }

export default function Chat() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [step, setStep] = useState('') // what is happening now; empty when idle
  const [error, setError] = useState('')

  async function send(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || step) return
    const history: Turn[] = [...turns, { role: 'user', content: text }]
    setTurns(history)
    setDraft('')
    setError('')
    try {
      // Steps 1 and 2: the current attestation, fetched for every message and verified here before anything is encrypted.
      setStep('Verifying the enclave')
      const attestation = await fetch('/api/attestation')
      if (!attestation.ok) throw await routeError(attestation)
      const enclave = await verifyEnclave((await attestation.json()).bundle)

      const messages = history.map(({ role, content }) => ({ role, content }))
      const reply = await sealedChat(enclave, messages, setStep)
      setTurns([...history, { role: 'assistant', content: reply, enclave }])
    } catch (failure) {
      // Put the message back in the box, so it can be sent again.
      setTurns(turns)
      setDraft(text)
      setError(failure instanceof Error ? failure.message : String(failure))
    } finally {
      setStep('')
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
      <header>
        <h1 className="text-xl font-semibold">Confidential chat</h1>
        <p className="text-sm text-muted">
          Each message is encrypted in this browser to an enclave the page has just verified. The server only forwards
          ciphertext.
        </p>
      </header>

      <ol className="flex flex-1 flex-col gap-3">
        {turns.map((turn, index) => (
          <li
            key={index}
            className={
              turn.role === 'user'
                ? 'max-w-[85%] self-end rounded-lg bg-accent px-3 py-2'
                : 'rounded-lg border border-border px-3 py-2'
            }
          >
            <p className="whitespace-pre-wrap">{turn.content}</p>
            {turn.enclave && (
              <p className="mt-2 break-all font-mono text-xs text-muted" title={turn.enclave.digest}>
                Verified {turn.enclave.configRepo}
                {turn.enclave.releaseTag && `@${turn.enclave.releaseTag}`} · digest {turn.enclave.digest.slice(0, 16)}…
                · routed to {turn.enclave.host}
              </p>
            )}
          </li>
        ))}
      </ol>

      {step && (
        <p role="status" className="text-sm text-muted">
          {step}…
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <form onSubmit={send} className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          // Read-only while a message is in flight, so the catch above can put a failed message back without erasing
          // anything newer. Unlike disabled, it keeps the focus.
          readOnly={!!step}
          placeholder="Write a message"
          aria-label="Message"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2"
        />
        <button
          disabled={!!step || !draft.trim()}
          className="rounded-lg bg-foreground px-4 py-2 font-medium text-background disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </main>
  )
}
