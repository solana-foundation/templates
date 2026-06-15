import { useEffect, useState } from 'react'
import { Info, KeyRound, Loader2, Network, RefreshCw, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CopyButton } from '@/components/CopyButton'
import { clearUserShare, generateUserShareKeypair, userSharePublicKey } from '@/lib/session'
import { ellipsify } from '@/lib/utils'

const DOCS_URL = 'https://docs.ika.xyz/docs/sdk/user-share-encryption-keys'

/**
 * The user share, shown as a keypair the user generates with a button.
 *
 * Notifies the parent via `onChange` so Step 1 (Create dWallet) can gate on the
 * user share existing. The companion "other half" (the Ika network share) is
 * shown alongside so the 2PC-MPC split is visible, not just asserted.
 */
export function SessionPanel({ onChange }: { onChange?: (ready: boolean) => void }) {
  const [pubkey, setPubkey] = useState<string | null>(null)
  const [deriving, setDeriving] = useState(false)

  useEffect(() => {
    const pk = userSharePublicKey()
    setPubkey(pk)
    onChange?.(pk !== null)
  }, [onChange])

  const generate = async () => {
    setDeriving(true)
    try {
      const kp = await generateUserShareKeypair()
      setPubkey(kp.publicKey.toBase58())
      onChange?.(true)
      toast.success('User-share keypair generated', { description: 'This is your half of the dWallet key.' })
    } catch (e) {
      toast.error('Could not generate the user share', { description: (e as Error).message })
    } finally {
      setDeriving(false)
    }
  }

  const regenerate = async () => {
    setDeriving(true)
    try {
      clearUserShare()
      const kp = await generateUserShareKeypair()
      setPubkey(kp.publicKey.toBase58())
      onChange?.(true)
      toast.warning('User-share keypair regenerated', {
        description: 'dWallets created with the previous keypair can no longer be used.',
      })
    } catch (e) {
      toast.error('Could not regenerate the user share', { description: (e as Error).message })
    } finally {
      setDeriving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          User share (your half of the key)
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="What is the user share?"
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Every dWallet signature needs two shares: yours and the Ika network&apos;s. This keypair is your share,
              generated and stored locally for the demo. Neither share can sign alone.
            </TooltipContent>
          </Tooltip>
          <Badge variant={pubkey ? 'success' : 'outline'}>{pubkey ? 'Ready' : 'Not created'}</Badge>
        </CardTitle>
        <CardDescription>
          Your half of the dWallet's key. Generate it first, because the next step creates the dWallet from your half
          plus the network's. Here we generate a keypair, but in a real app this could be your own wallet or any key you
          control.{' '}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href={DOCS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Learn more →
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* The 2PC-MPC split, made visible: your share + the network's share. */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
          <div className="rounded-lg border border-border-low bg-cream/40 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <KeyRound className="size-3.5 text-muted-foreground" />
              Your share
            </p>
            {pubkey ? (
              <p className="mt-1 flex items-center gap-1 font-mono text-xs">
                {ellipsify(pubkey)}
                <CopyButton value={pubkey} className="size-5" />
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted">not generated</p>
            )}
            <p className="mt-1 text-[10px] uppercase tracking-wide text-muted">local · this browser</p>
          </div>

          <div className="flex items-center justify-center text-sm font-semibold text-muted">+</div>

          <div className="rounded-lg border border-border-low bg-cream/40 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <Network className="size-3.5 text-muted-foreground" />
              Ika network share
            </p>
            <p className="mt-1 text-xs text-muted">held by validators</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-muted">remote · t-of-N · never local</p>
          </div>
        </div>
        <p className="text-center text-xs text-muted">
          Both are needed to sign. The full key is never assembled anywhere.
        </p>

        {pubkey ? (
          <Button size="sm" variant="ghost" onClick={regenerate} disabled={deriving}>
            <RefreshCw className={deriving ? 'size-3.5 animate-spin' : 'size-3.5'} />
            {deriving ? 'Deriving…' : 'Regenerate'}
          </Button>
        ) : (
          <Button size="sm" onClick={generate} disabled={deriving}>
            {deriving ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            {deriving ? 'Deriving your share…' : 'Generate user-share keypair'}
          </Button>
        )}

        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
          <span>
            Teaching tool only. The keypair is stored in this browser&apos;s localStorage, which is not production key
            management. Clearing storage or regenerating loses access to dWallets created with it.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
