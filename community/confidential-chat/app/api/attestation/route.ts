import { randomBytes } from 'node:crypto'
import { NITO_MODEL } from '@/lib/model'

// Step 1: fetch the attestation of the enclave that serves the model. The server fetches it only because Nito wants the
// API key; the browser verifies it, so nothing here has to be trusted.

export async function GET() {
  const apiKey = process.env.NITO_API_KEY
  if (!apiKey) return fail(503, 'The server has no API key. Set NITO_API_KEY in .env.local and restart the server.')

  const url = new URL('https://app.trynito.ai/api/v1/attestation')
  url.searchParams.set('model', NITO_MODEL)
  url.searchParams.set('nonce', randomBytes(32).toString('hex'))

  let upstream: Response
  try {
    upstream = await fetch(url, {
      headers: { authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return fail(502, 'Nito could not be reached.')
  }
  // Nito's error message is not passed on, only its status.
  if (!upstream.ok) return fail(502, `Nito answered with an error (HTTP ${upstream.status}).`)

  // Only the bundle goes back. Whatever else Nito says about the enclave is not needed: the browser checks for itself.
  const { evidence } = await upstream.json()
  return Response.json({ bundle: evidence?.bundle })
}

const fail = (status: number, error: string) => Response.json({ error }, { status })
