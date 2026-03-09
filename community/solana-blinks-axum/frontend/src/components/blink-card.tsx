'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWallet, type WalletAccount } from '@/components/providers'
import { getWalletFeature } from '@wallet-standard/react'
import { createSolanaRpc, getBase58Decoder, lamports, type Lamports } from '@solana/kit'
import { fetchAction, executeAction, buildActionUrl } from '@/lib/actions'
import { RPC_URL, ACTIONS_API, SOLANA_CHAIN } from '@/lib/constants'
import type { ActionGetResponse, LinkedAction, ActionParameter } from '@/lib/types'

// Kit RPC for reading on-chain data
const rpc = createSolanaRpc(RPC_URL)
const b58 = getBase58Decoder()

// Wallet-standard feature name
const SIGN_AND_SEND = 'solana:signAndSendTransaction' as const

// Minimal feature shape for type-safe cast
type SignAndSendFn = {
  signAndSendTransaction(
    ...inputs: {
      account: WalletAccount
      transaction: Uint8Array
      chain?: string
    }[]
  ): Promise<{ signature: Uint8Array }[]>
}

/** Poll rpc.getSignatureStatuses until confirmed/finalized or timeout. */
async function pollConfirmation(sig: string, maxAttempts = 30): Promise<void> {
  type SigParam = Parameters<typeof rpc.getSignatureStatuses>[0][0]
  for (let i = 0; i < maxAttempts; i++) {
    const res = await rpc.getSignatureStatuses([sig as SigParam]).send()
    const s = res.value[0]
    if (s?.confirmationStatus === 'confirmed' || s?.confirmationStatus === 'finalized') {
      return
    }
    if (s?.err) throw new Error('Transaction failed on-chain')
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('Transaction confirmation timeout')
}

interface BlinkCardProps {
  actionUrl: string
  onRemove?: () => void
}

type Status =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'signing' }
  | { state: 'confirming'; signature: string }
  | { state: 'success'; signature: string; message?: string }
  | { state: 'error'; message: string }

export function BlinkCard({ actionUrl, onRemove }: BlinkCardProps) {
  const { account, wallet, connected } = useWallet()
  const [action, setAction] = useState<ActionGetResponse | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const [balance, setBalance] = useState<Lamports | null>(null)

  useEffect(() => {
    fetchAction(actionUrl)
      .then(setAction)
      .catch((err) => setFetchError(err instanceof Error ? err.message : 'Failed to load action'))
  }, [actionUrl])

  const refreshBalance = useCallback(() => {
    if (!account) {
      setBalance(null)
      return
    }
    rpc
      .getBalance(account.address as Parameters<typeof rpc.getBalance>[0])
      .send()
      .then((res) => setBalance(lamports(res.value)))
      .catch(console.error)
  }, [account])

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  const handleExecute = useCallback(
    async (linkedAction: LinkedAction, params: Record<string, string>) => {
      if (!account || !wallet) {
        setStatus({ state: 'error', message: 'Connect your wallet first' })
        return
      }

      if (!wallet.features.includes(SIGN_AND_SEND)) {
        setStatus({ state: 'error', message: 'Wallet does not support signAndSendTransaction' })
        return
      }

      try {
        setStatus({ state: 'loading' })

        const url = buildActionUrl(linkedAction.href, params, ACTIONS_API)
        const result = await executeAction(url, account.address)

        setStatus({ state: 'signing' })

        // Decode base64 transaction to raw bytes
        const txBytes = Uint8Array.from(atob(result.transaction), (c) => c.charCodeAt(0))

        // Sign and send via wallet-standard feature
        const feat = getWalletFeature(wallet, SIGN_AND_SEND) as SignAndSendFn
        const [{ signature: sigBytes }] = await feat.signAndSendTransaction({
          account,
          transaction: txBytes,
          chain: SOLANA_CHAIN,
        })

        const signature = b58.decode(sigBytes)

        setStatus({ state: 'confirming', signature })

        await pollConfirmation(signature)

        refreshBalance()

        // Handle action chaining
        const next = result.links?.next
        if (next?.type === 'inline') {
          setAction(next)
          setStatus({ state: 'idle' })
          return
        }
        if (next?.type === 'post') {
          try {
            const nextAction = await fetchAction(next.href.startsWith('/') ? `${ACTIONS_API}${next.href}` : next.href)
            setAction(nextAction)
            setStatus({ state: 'idle' })
            return
          } catch {
            // Fall through to success if next action fetch fails
          }
        }

        setStatus({
          state: 'success',
          signature,
          message: result.message,
        })
      } catch (err) {
        setStatus({
          state: 'error',
          message: err instanceof Error ? err.message : 'Transaction failed',
        })
      }
    },
    [account, wallet, refreshBalance],
  )

  if (fetchError) {
    return (
      <div className="border border-border rounded-2xl p-6 bg-surface-card">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-error text-sm">{fetchError}</p>
            <p className="text-text-muted text-xs mt-1 break-all">{actionUrl}</p>
          </div>
          {onRemove && (
            <button onClick={onRemove} className="text-text-muted hover:text-text-secondary text-xs shrink-0">
              Remove
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!action) {
    return (
      <div className="border border-border rounded-2xl p-6 bg-surface-card animate-pulse">
        <div className="h-48 bg-surface-input rounded-xl mb-4" />
        <div className="h-6 bg-surface-input rounded w-2/3 mb-2" />
        <div className="h-4 bg-surface-input rounded w-full" />
      </div>
    )
  }

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-surface-card w-full relative">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 z-10 bg-surface-card/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          Remove
        </button>
      )}
      {/* Icon / Image */}
      <div className="w-full h-52 bg-surface-input flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={action.icon}
          alt={action.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>

      <div className="p-5 space-y-4">
        {/* Title & Description */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{action.title}</h2>
          <p className="text-sm text-text-secondary mt-1">{action.description}</p>
        </div>

        {/* Wallet Balance (via @solana/kit RPC) */}
        {connected && balance != null && (
          <div className="text-xs text-text-muted">Balance: {(Number(balance) / 1e9).toFixed(4)} SOL</div>
        )}

        {/* Error from action metadata */}
        {action.error && (
          <div className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">{action.error.message}</div>
        )}

        {/* Linked Actions */}
        {action.links?.actions.map((linkedAction, i) => (
          <ActionForm
            key={i}
            linkedAction={linkedAction}
            disabled={action.disabled || !connected}
            onExecute={handleExecute}
          />
        ))}

        {/* Fallback: single label button (no linked actions) */}
        {!action.links && (
          <button
            className="w-full py-2.5 px-4 rounded-xl font-medium bg-accent hover:bg-accent-hover text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={action.disabled || !connected}
            onClick={() => handleExecute({ href: actionUrl, label: action.label }, {})}
          >
            {action.label}
          </button>
        )}

        {/* Status */}
        <StatusBar status={status} onReset={() => setStatus({ state: 'idle' })} />
      </div>
    </div>
  )
}

function ActionForm({
  linkedAction,
  disabled,
  onExecute,
}: {
  linkedAction: LinkedAction
  disabled?: boolean
  onExecute: (action: LinkedAction, params: Record<string, string>) => void
}) {
  const [params, setParams] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onExecute(linkedAction, params)
  }

  const hasParams = linkedAction.parameters && linkedAction.parameters.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {hasParams &&
        linkedAction.parameters!.map((param) => (
          <ParameterInput
            key={param.name}
            param={param}
            value={params[param.name] ?? ''}
            onChange={(v) => setParams((p) => ({ ...p, [param.name]: v }))}
          />
        ))}

      <button
        type="submit"
        disabled={disabled}
        className="w-full py-2.5 px-4 rounded-xl font-medium bg-accent hover:bg-accent-hover text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {linkedAction.label}
      </button>
    </form>
  )
}

function ParameterInput({
  param,
  value,
  onChange,
}: {
  param: ActionParameter
  value: string
  onChange: (v: string) => void
}) {
  const baseClass =
    'w-full px-3 py-2 rounded-xl bg-surface-input border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors'

  if (param.type === 'select' && param.options) {
    return (
      <div>
        {param.label && <label className="block text-xs text-text-secondary mb-1">{param.label}</label>}
        <select
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={param.required}
        >
          <option value="">Select...</option>
          {param.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (param.type === 'radio' && param.options) {
    return (
      <fieldset>
        {param.label && <legend className="text-xs text-text-secondary mb-2">{param.label}</legend>}
        <div className="flex gap-3 flex-wrap">
          {param.options.map((opt) => (
            <label
              key={opt.value}
              className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                value === opt.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-text-secondary hover:border-text-muted'
              }`}
            >
              <input
                type="radio"
                name={param.name}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    )
  }

  if (param.type === 'textarea') {
    return (
      <div>
        {param.label && <label className="block text-xs text-text-secondary mb-1">{param.label}</label>}
        <textarea
          className={baseClass + ' min-h-[80px] resize-y'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={param.label ?? param.name}
          required={param.required}
        />
      </div>
    )
  }

  // Default: text, number, email, url, date, datetime
  const inputType = param.type === 'datetime' ? 'datetime-local' : (param.type ?? 'text')

  return (
    <div>
      {param.label && <label className="block text-xs text-text-secondary mb-1">{param.label}</label>}
      <input
        type={inputType}
        className={baseClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={param.label ?? param.name}
        required={param.required}
        pattern={param.pattern}
        min={param.min}
        max={param.max}
        step={inputType === 'number' ? 'any' : undefined}
      />
    </div>
  )
}

function StatusBar({ status, onReset }: { status: Status; onReset: () => void }) {
  if (status.state === 'idle') return null

  return (
    <div className="text-sm rounded-xl px-3 py-2.5 space-y-1">
      {status.state === 'loading' && (
        <div className="text-text-secondary flex items-center gap-2">
          <Spinner /> Building transaction...
        </div>
      )}
      {status.state === 'signing' && (
        <div className="text-text-secondary flex items-center gap-2">
          <Spinner /> Waiting for wallet signature...
        </div>
      )}
      {status.state === 'confirming' && (
        <div className="text-text-secondary flex items-center gap-2">
          <Spinner /> Confirming transaction...
        </div>
      )}
      {status.state === 'success' && (
        <div className="text-success space-y-1">
          <div className="flex items-center justify-between">
            <span>Transaction confirmed</span>
            <button onClick={onReset} className="text-text-muted hover:text-text-secondary text-xs">
              Dismiss
            </button>
          </div>
          {status.message && <div className="text-text-secondary text-xs">{status.message}</div>}
          <a
            href={`https://explorer.solana.com/tx/${status.signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline block"
          >
            View on Explorer
          </a>
        </div>
      )}
      {status.state === 'error' && (
        <div className="text-error flex items-center justify-between">
          <span>{status.message}</span>
          <button onClick={onReset} className="text-text-muted hover:text-text-secondary text-xs ml-2">
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
