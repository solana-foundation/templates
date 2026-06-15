import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, Coins, ExternalLink, Loader2, RefreshCw, Send } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CodeReveal } from '@/components/CodeReveal'
import { CopyButton } from '@/components/CopyButton'
import { ErrorNote } from '@/components/ErrorNote'
import { useSolanaWallet } from '@/lib/solana-wallet'
import { useExecuteSui } from '@/lib/use-execute-sui'
import { getUserShareEncryptionKeys } from '@/lib/session'
import { signWithDWallet } from '@/lib/ika'
import { operatorAddress } from '@/lib/operator'
import type { StoredDWallet } from '@/lib/dwallets'
import {
  airdropDevnetSol,
  broadcastWithDWalletSignature,
  buildDWalletTransfer,
  explorerTxUrl,
  getBalanceLamports,
  lamportsToSol,
  solToLamports,
} from '@/lib/solana'
import { verifyEd25519 } from '@/lib/verify'
import { hintForError } from '@/lib/errors'
import { ellipsify } from '@/lib/utils'

type Stage = 'building' | 'presign' | 'awaiting-presign' | 'signing' | 'awaiting-signature' | 'broadcasting' | 'done'

const STAGES: { id: Stage; label: string }[] = [
  { id: 'building', label: 'Building the Solana transfer' },
  { id: 'presign', label: 'Requesting an EdDSA presign on Ika' },
  { id: 'awaiting-presign', label: 'Waiting for the presign' },
  { id: 'signing', label: 'Co-signing (you + the network)' },
  { id: 'awaiting-signature', label: 'Waiting for the signature' },
  { id: 'broadcasting', label: 'Broadcasting to devnet' },
  { id: 'done', label: 'Confirmed' },
]

const CODE = `const { transaction, messageBytes } = await buildDWalletTransfer({
  fromDWalletAddress: dWallet.solanaAddress,
  toAddress: phantomAddress,
  lamports,
})
const { signature } = await signWithDWallet({ /* ...dWallet, message */ })
const txSig = await broadcastWithDWalletSignature({
  transaction, dWalletAddress: dWallet.solanaAddress, signature,
})`

export function SendStep({ dWallet, operatorReady }: { dWallet: StoredDWallet; operatorReady: boolean }) {
  const { address: phantomAddress } = useSolanaWallet()
  const executeSui = useExecuteSui()

  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [airdropping, setAirdropping] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [amountSol, setAmountSol] = useState('0.001')

  const [running, setRunning] = useState(false)
  const [stage, setStage] = useState<Stage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ txSig: string; verified: boolean } | null>(null)

  const refreshBalance = useCallback(async () => {
    setLoadingBalance(true)
    try {
      setBalance(await getBalanceLamports(dWallet.solanaAddress))
    } catch (e) {
      toast.error('Could not read dWallet balance', { description: (e as Error).message })
    } finally {
      setLoadingBalance(false)
    }
  }, [dWallet.solanaAddress])

  useEffect(() => {
    void refreshBalance()
  }, [refreshBalance])

  useEffect(() => {
    if (phantomAddress) setRecipient((r) => r || phantomAddress)
  }, [phantomAddress])

  async function onAirdrop() {
    setAirdropping(true)
    try {
      await airdropDevnetSol(dWallet.solanaAddress, 1)
      toast.success('Airdropped 1 devnet SOL to the dWallet')
      await refreshBalance()
    } catch (e) {
      toast.error('Airdrop failed', {
        description: (e as Error).message + '. Devnet faucets rate-limit, so retry shortly.',
      })
    } finally {
      setAirdropping(false)
    }
  }

  async function onSend() {
    setError(null)
    setResult(null)
    setRunning(true)
    setStage('building')
    try {
      const operator = operatorAddress()
      if (!operator) throw new Error('Generate the Sui operator keypair first.')
      const lamports = solToLamports(Number(amountSol))
      if (!Number.isFinite(lamports) || lamports <= 0) throw new Error('Enter a positive amount of SOL')

      const { transaction, messageBytes } = await buildDWalletTransfer({
        fromDWalletAddress: dWallet.solanaAddress,
        toAddress: recipient.trim(),
        lamports,
      })

      const userShareEncryptionKeys = await getUserShareEncryptionKeys()
      const { signature, publicKey } = await signWithDWallet({
        userShareEncryptionKeys,
        operatorAddress: operator,
        dWalletID: dWallet.dWalletID,
        encryptedUserSecretKeyShareID: dWallet.encryptedUserSecretKeyShareID,
        message: messageBytes,
        executeSui,
        onProgress: (s) => setStage(s),
      })

      const verified = verifyEd25519({ message: messageBytes, signature, publicKey })

      setStage('broadcasting')
      const txSig = await broadcastWithDWalletSignature({
        transaction,
        dWalletAddress: dWallet.solanaAddress,
        signature,
      })

      setStage('done')
      setResult({ txSig, verified })
      toast.success('Transaction confirmed on devnet')
      await refreshBalance()
    } catch (e) {
      const message = (e as Error).message
      setError(message)
      toast.error('Sign & send failed', { description: message })
    } finally {
      setRunning(false)
    }
  }

  return (
    <Card className="border-border-low shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-cream text-xs font-semibold">2</span>
          Fund & send
        </CardTitle>
        <CardDescription>
          Airdrop devnet SOL, then have the dWallet sign and broadcast a real transfer. The 64-byte signature is
          produced by 2PC-MPC (presign → sign): both your user share and the network share are used, and verified
          locally before it goes out.{' '}
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="https://docs.ika.xyz/docs/sdk/ika-transaction/presign"
            target="_blank"
            rel="noreferrer"
          >
            How signing works →
          </a>
          <span className="mt-2 block text-xs">
            Note: your user share is applied automatically from this browser (no separate approval). The Sui operator
            only pays the fees and submits the transactions.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance + airdrop */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-low bg-cream/40 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">dWallet balance</p>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {balance === null ? '-' : lamportsToSol(balance).toFixed(4)}{' '}
              <span className="text-sm font-normal text-muted">SOL</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => void refreshBalance()} disabled={loadingBalance}>
              <RefreshCw className={loadingBalance ? 'size-4 animate-spin' : 'size-4'} />
            </Button>
            <Button size="sm" variant="outline" onClick={onAirdrop} disabled={airdropping}>
              {airdropping ? <Loader2 className="size-4 animate-spin" /> : <Coins className="size-4" />}
              Airdrop 1 SOL
            </Button>
          </div>
        </div>

        {/* Transfer fields */}
        <div className="grid gap-3 sm:grid-cols-[1fr_130px]">
          <label className="space-y-1.5 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Recipient</span>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Phantom address…"
              className="font-mono"
            />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="text-xs uppercase tracking-wide text-muted">Amount (SOL)</span>
            <Input
              type="number"
              step="0.0001"
              min="0"
              value={amountSol}
              onChange={(e) => setAmountSol(e.target.value)}
            />
          </label>
        </div>

        <Button onClick={onSend} disabled={!operatorReady || running || !recipient.trim()}>
          {running ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {running ? 'Signing & sending…' : 'Sign & send'}
        </Button>

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

        {error && <ErrorNote title="Could not complete" message={error} hint={hintForError(error)} />}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 rounded-lg border border-green-500/30 bg-green-500/5 p-4"
          >
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-green-600 dark:text-green-500" />
              <span className="font-medium">Confirmed on devnet</span>
              {result.verified ? (
                <Badge variant="success">verified locally</Badge>
              ) : (
                <Badge variant="destructive">verify failed</Badge>
              )}
            </div>
            <a
              className="inline-flex items-center gap-1 font-mono text-xs underline underline-offset-2 hover:opacity-80"
              href={explorerTxUrl(result.txSig)}
              target="_blank"
              rel="noreferrer"
            >
              {ellipsify(result.txSig, 8)} on Explorer <ExternalLink className="size-3" />
            </a>
            <CopyButton value={result.txSig} className="ml-1 align-middle" />
          </motion.div>
        )}

        {!operatorReady && <p className="text-sm text-muted">Generate and fund the Sui operator above to sign.</p>}

        <CodeReveal title="Show the code" code={CODE} />
      </CardContent>
    </Card>
  )
}
