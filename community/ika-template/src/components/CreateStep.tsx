import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, ExternalLink, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeReveal } from '@/components/CodeReveal'
import { CopyButton } from '@/components/CopyButton'
import { ErrorNote } from '@/components/ErrorNote'
import { getUserShareEncryptionKeys } from '@/lib/session'
import { operatorAddress } from '@/lib/operator'
import { createDWallet } from '@/lib/ika'
import { saveDWallet, type StoredDWallet } from '@/lib/dwallets'
import { explorerAddressUrl } from '@/lib/solana'
import { useExecuteSui } from '@/lib/use-execute-sui'
import { hintForError } from '@/lib/errors'
import { ellipsify } from '@/lib/utils'

type Stage = 'preparing' | 'requesting' | 'awaiting-network' | 'accepting' | 'activating' | 'done'

const STAGES: { id: Stage; label: string }[] = [
  { id: 'preparing', label: 'Preparing your key share' },
  { id: 'requesting', label: 'Requesting DKG on Ika' },
  { id: 'awaiting-network', label: 'Waiting for the network share' },
  { id: 'accepting', label: 'Accepting your encrypted share' },
  { id: 'activating', label: 'Activating the dWallet' },
  { id: 'done', label: 'Live' },
]

const CODE = `import { createDWallet } from '@/lib/ika'

// prepareDKGAsync -> requestDWalletDKG -> acceptEncryptedUserShare,
// on the ED25519 curve. The Sui operator signs + pays each step.
const dWallet = await createDWallet({
  userShareEncryptionKeys,
  operatorAddress,
  executeSui,
})
// dWallet.solanaAddress = the ED25519 pubkey, base58.`

export function CreateStep({
  onCreated,
  userShareReady,
  operatorReady,
}: {
  onCreated: (d: StoredDWallet) => void
  userShareReady: boolean
  operatorReady: boolean
}) {
  const executeSui = useExecuteSui()

  const [running, setRunning] = useState(false)
  const [stage, setStage] = useState<Stage | null>(null)
  const [result, setResult] = useState<StoredDWallet | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onCreate() {
    setError(null)
    setResult(null)
    setRunning(true)
    setStage('preparing')
    try {
      const operator = operatorAddress()
      if (!operator) throw new Error('Generate the Sui operator keypair first.')
      const userShareEncryptionKeys = await getUserShareEncryptionKeys()
      const created = await createDWallet({
        userShareEncryptionKeys,
        operatorAddress: operator,
        executeSui,
        onProgress: (s) => setStage(s),
      })
      const stored: StoredDWallet = {
        dWalletID: created.dWalletID,
        dWalletCapID: created.dWalletCapID,
        encryptedUserSecretKeyShareID: created.encryptedUserSecretKeyShareID,
        solanaAddress: created.solanaAddress,
        createdAt: new Date().toISOString(),
      }
      saveDWallet(stored)
      setResult(stored)
      onCreated(stored)
      toast.success('dWallet created. Its key is now a Solana address')
    } catch (e) {
      const message = (e as Error).message
      setError(message)
      toast.error('DKG did not complete', { description: message })
    } finally {
      setRunning(false)
    }
  }

  return (
    <Card className="border-border-low shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-cream text-xs font-semibold">1</span>
          Create your dWallet
        </CardTitle>
        <CardDescription>
          A distributed key generation (DKG) combines your user share with the Ika network share to produce the dWallet.
          Neither half is ever the whole key. Out comes a dWallet whose ED25519 public key is a Solana address.{' '}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="https://docs.ika.xyz/docs/sdk/ika-transaction/zero-trust"
            target="_blank"
            rel="noreferrer"
          >
            How DKG works →
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={onCreate} disabled={!operatorReady || !userShareReady || running}>
          {running ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {running ? 'Creating…' : 'Create dWallet'}
        </Button>

        {!userShareReady && (
          <p className="text-sm text-muted">
            Generate your user-share keypair above first (it&apos;s your half of the key).
          </p>
        )}
        {userShareReady && !operatorReady && (
          <p className="text-sm text-muted">Generate and fund the Sui operator above to begin.</p>
        )}

        <AnimatePresence>
          {(running || result) && (
            <motion.ol
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden rounded-lg border border-border-low bg-cream/40 p-4"
            >
              {STAGES.map((s) => {
                const currentIndex = stage ? STAGES.findIndex((x) => x.id === stage) : -1
                const thisIndex = STAGES.findIndex((x) => x.id === s.id)
                const status =
                  result || thisIndex < currentIndex ? 'done' : thisIndex === currentIndex ? 'active' : 'pending'
                return (
                  <li key={s.id} className="flex items-center gap-2 text-sm">
                    {status === 'done' ? (
                      <CheckCircle2 className="size-4 text-green-600 dark:text-green-500" />
                    ) : status === 'active' ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Circle className="size-4 text-muted/40" />
                    )}
                    <span className={status === 'pending' ? 'text-muted' : ''}>{s.label}</span>
                  </li>
                )
              })}
            </motion.ol>
          )}
        </AnimatePresence>

        {error && <ErrorNote title="DKG did not complete" message={error} hint={hintForError(error)} />}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 rounded-lg border border-green-500/30 bg-green-500/5 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-muted">Solana address (your dWallet)</p>
            <div className="flex items-center gap-2">
              <code className="break-all font-mono text-sm">{result.solanaAddress}</code>
              <CopyButton value={result.solanaAddress} />
            </div>
            <a
              className="inline-flex items-center gap-1 font-mono text-xs underline underline-offset-2 hover:opacity-80"
              href={explorerAddressUrl(result.solanaAddress)}
              target="_blank"
              rel="noreferrer"
            >
              {ellipsify(result.solanaAddress)} on Explorer <ExternalLink className="size-3" />
            </a>
          </motion.div>
        )}

        <CodeReveal title="Show the code" code={CODE} />
      </CardContent>
    </Card>
  )
}
