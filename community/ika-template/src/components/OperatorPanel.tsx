import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Fuel, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/components/CopyButton'
import {
  IKA_FAUCET_PAGE,
  SUI_FAUCET_PAGE,
  formatCoin,
  getOperatorBalances,
  requestSuiFromFaucet,
  type OperatorBalances,
} from '@/lib/sui'
import { clearOperator, generateOperatorKeypair, operatorAddress } from '@/lib/operator'
import { ellipsify } from '@/lib/utils'

const MIN_SUI = 50_000_000n // 0.05 SUI
const MIN_IKA = 500_000_000n // 0.5 IKA

/**
 * The backstage operator. Ika runs on Sui, so a Sui account pays the network
 * fees (SUI gas + IKA). Here it's a keypair generated in-app, so there's no
 * wallet to connect: generate it, fund it from the faucets, and it signs the
 * Ika transactions directly.
 *
 * Calls `onChange(funded)` so the steps can gate on the operator being ready.
 */
export function OperatorPanel({ onChange }: { onChange?: (funded: boolean) => void }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balances, setBalances] = useState<OperatorBalances | null>(null)
  const [loading, setLoading] = useState(false)
  const [fauceting, setFauceting] = useState(false)

  const suiOk = balances ? balances.sui >= MIN_SUI : false
  const ikaOk = balances ? balances.ika >= MIN_IKA : false
  const funded = suiOk && ikaOk

  useEffect(() => {
    onChange?.(funded)
  }, [funded, onChange])

  const refresh = useCallback(async (addr: string | null) => {
    if (!addr) {
      setBalances(null)
      return
    }
    setLoading(true)
    try {
      setBalances(await getOperatorBalances(addr))
    } catch (e) {
      toast.error('Could not read operator balances', { description: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const addr = operatorAddress()
    setAddress(addr)
    void refresh(addr)
  }, [refresh])

  const generate = () => {
    const kp = generateOperatorKeypair()
    const addr = kp.toSuiAddress()
    setAddress(addr)
    void refresh(addr)
    toast.success('Operator keypair generated', { description: 'Fund it with SUI + IKA below.' })
  }

  const reset = () => {
    clearOperator()
    setAddress(null)
    setBalances(null)
    toast.warning('Operator keypair cleared')
  }

  const onFaucet = async () => {
    if (!address) return
    setFauceting(true)
    try {
      await requestSuiFromFaucet(address)
      toast.success('Requested SUI from the testnet faucet', { description: 'It can take a few seconds to arrive.' })
      setTimeout(() => void refresh(address), 4000)
    } catch (e) {
      toast.error('Sui faucet request failed', {
        description: (e as Error).message + '. You can also use the faucet page directly.',
      })
    } finally {
      setFauceting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="size-4 text-muted-foreground" />
          Sui operator (fee payer)
          {address ? (
            <Badge variant={funded ? 'success' : 'outline'}>{funded ? 'Funded' : 'Needs funds'}</Badge>
          ) : (
            <Badge variant="outline">Not created</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Ika runs on Sui, so this backstage account pays the network fees (SUI gas + IKA). It's a keypair generated in
          this browser and never touches your Solana funds.{' '}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="https://docs.ika.xyz/docs/core-concepts/cryptography/2pc-mpc"
            target="_blank"
            rel="noreferrer"
          >
            Why? →
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!address ? (
          <Button size="sm" onClick={generate}>
            <Fuel className="size-4" />
            Generate operator keypair
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-border-low bg-cream/40 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-muted">Operator Sui address (fund this)</p>
                <p className="truncate font-mono text-sm">{ellipsify(address, 8)}</p>
              </div>
              <CopyButton value={address} className="ml-auto" />
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => void refresh(address)}
                disabled={loading}
                aria-label="Refresh balances"
              >
                <RefreshCw className={loading ? 'size-3.5 animate-spin' : 'size-3.5'} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <BalanceTile label="SUI (gas)" value={balances ? formatCoin(balances.sui) : '-'} ok={suiOk} />
              <BalanceTile label="IKA (protocol)" value={balances ? formatCoin(balances.ika) : '-'} ok={ikaOk} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={onFaucet} disabled={fauceting}>
                {fauceting ? 'Requesting…' : 'Auto-request SUI'}
              </Button>
              <Button asChild size="sm" variant="ghost">
                <a href={SUI_FAUCET_PAGE} target="_blank" rel="noreferrer">
                  SUI faucet <ExternalLink className="size-3.5" />
                </a>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <a href={IKA_FAUCET_PAGE} target="_blank" rel="noreferrer">
                  IKA faucet <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>

            {!ikaOk && (
              <p className="text-xs text-muted">
                IKA is the protocol fee token. The IKA faucet (faucet.ika.xyz) swaps SUI → IKA from a connected wallet,
                so get IKA there and{' '}
                <span className="font-medium text-foreground">send it to the operator address above</span>. You only
                need a little (about 0.5 IKA per operation), once.
              </p>
            )}

            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={reset}>
              <Trash2 className="size-3.5" />
              Reset operator
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function BalanceTile({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-lg border border-border-low bg-cream/40 px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="flex items-center gap-2 font-mono text-sm">
        <span className={ok ? 'size-2 rounded-full bg-green-500' : 'size-2 rounded-full bg-muted-foreground/40'} />
        {value}
      </p>
    </div>
  )
}
