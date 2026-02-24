import type { ActionGetResponse, ActionPostRequest, ActionPostResponse, ActionsJson } from './types'

/**
 * Fetch the actions.json routing rules from the backend.
 */
export async function fetchActionsJson(baseUrl: string): Promise<ActionsJson> {
  const res = await fetch(`${baseUrl}/actions.json`)
  if (!res.ok) throw new Error(`Failed to fetch actions.json: ${res.status}`)
  return res.json()
}

/**
 * Fetch action metadata (GET).
 */
export async function fetchAction(url: string): Promise<ActionGetResponse> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Failed to fetch action: ${res.status}`)
  return res.json()
}

/**
 * Execute an action (POST) — sends the wallet pubkey and gets back a transaction.
 */
export async function executeAction(url: string, account: string): Promise<ActionPostResponse> {
  const body: ActionPostRequest = { account }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(err.message ?? `Action failed: ${res.status}`)
  }
  return res.json()
}

/**
 * Substitute parameter placeholders in an action href.
 * e.g. "/api/actions/transfer?to={to}&amount={amount}" + { to: "abc", amount: "1.5" }
 *    → "/api/actions/transfer?to=abc&amount=1.5"
 */
export function buildActionUrl(href: string, params: Record<string, string>, baseUrl: string): string {
  let url = href
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`{${key}}`, encodeURIComponent(value))
  }
  // Make relative URLs absolute
  if (url.startsWith('/')) {
    url = `${baseUrl}${url}`
  }
  return url
}
