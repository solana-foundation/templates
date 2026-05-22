'use client'

import { useInitStatus, useUser, useWalletAccounts } from '@dynamic-labs-sdk/react-hooks'
import { getActiveNetworkData, signMessage } from '@dynamic-labs-sdk/client'
import { isSolanaWalletAccount, getSolanaConnection, signAndSendTransaction } from '@dynamic-labs-sdk/solana'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useEffect, useState } from 'react'

const card = 'bg-white rounded-xl p-6 space-y-4'
const cardStyle = { border: '1px solid #DADADA', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }
const label = 'text-sm font-medium text-[#606060] uppercase tracking-wide'
const inputClass =
  'w-full px-4 py-2.5 bg-white rounded-lg text-sm text-[#030303] placeholder-[#9ca3af] outline-none focus:border-[#4779FF] focus:ring-1 focus:ring-[#4779FF]/30 transition-colors'
const inputStyle = { border: '1px solid #DADADA' }
const btnPrimary =
  'w-full py-3 bg-[#4779FF] hover:bg-[#3366ee] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors'

function StatusBadge({ text, success }: { text: string; success: boolean }) {
  return (
    <div
      className={`mt-3 p-3 rounded-lg text-sm break-all ${success ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-[#FCE8E6] text-[#C5221F]'}`}
      style={{ border: success ? '1px solid #CEEAD6' : '1px solid #F5C6C2' }}
    >
      {text}
    </div>
  )
}

export default function Home() {
  const initStatus = useInitStatus()
  const user = useUser()
  const accounts = useWalletAccounts()

  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string | null>(null)

  // Send SOL state
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0.01')
  const [txStatus, setTxStatus] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Sign message state
  const [messageToSign, setMessageToSign] = useState('Hello from Dynamic + Solana!')
  const [signedSig, setSignedSig] = useState('')
  const [isSigning, setIsSigning] = useState(false)
  const [signError, setSignError] = useState('')

  // Copy address state
  const [copied, setCopied] = useState(false)

  const solanaWallet = accounts.find(isSolanaWalletAccount)

  useEffect(() => {
    if (!user || !solanaWallet) {
      setBalance(null)
      setNetwork(null)
      return
    }

    async function fetchBalance() {
      if (!solanaWallet) return
      try {
        const { networkData } = await getActiveNetworkData({ walletAccount: solanaWallet })
        if (!networkData) return
        setNetwork(networkData.name ?? null)
        const connection = getSolanaConnection({ networkData })
        const lamports = await connection.getBalance(new PublicKey(solanaWallet.address))
        setBalance(lamports / LAMPORTS_PER_SOL)
      } catch (err) {
        console.error('Failed to fetch balance:', err)
      }
    }

    fetchBalance()
  }, [user, accounts, solanaWallet])

  const handleCopy = async () => {
    if (!solanaWallet?.address) return
    await navigator.clipboard.writeText(solanaWallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSignMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!solanaWallet) return
    setIsSigning(true)
    setSignedSig('')
    setSignError('')
    try {
      const { signature } = await signMessage({ walletAccount: solanaWallet, message: messageToSign })
      setSignedSig(signature)
    } catch (err) {
      setSignError(err instanceof Error ? err.message : 'Signing failed')
    } finally {
      setIsSigning(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!solanaWallet) return
    setIsSending(true)
    setTxStatus('')
    try {
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipient)
      } catch {
        setTxStatus('Error: Invalid recipient address')
        setIsSending(false)
        return
      }

      const lamportAmount = Math.round(parseFloat(amount) * LAMPORTS_PER_SOL)
      if (!Number.isFinite(lamportAmount) || lamportAmount <= 0) {
        setTxStatus('Error: Invalid amount')
        setIsSending(false)
        return
      }

      const { networkData } = await getActiveNetworkData({ walletAccount: solanaWallet })
      if (!networkData) throw new Error('No network data available')
      const connection = getSolanaConnection({ networkData })
      const { blockhash } = await connection.getLatestBlockhash()

      const tx = new Transaction()
      tx.recentBlockhash = blockhash
      tx.feePayer = new PublicKey(solanaWallet.address)
      tx.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solanaWallet.address),
          toPubkey: recipientPubkey,
          lamports: lamportAmount,
        }),
      )

      const { signature } = await signAndSendTransaction({ walletAccount: solanaWallet, transaction: tx })
      setTxStatus(`Success! Signature: ${signature}`)
      setRecipient('')
      setAmount('0.01')

      const updatedBalance = await connection.getBalance(new PublicKey(solanaWallet.address))
      setBalance(updatedBalance / LAMPORTS_PER_SOL)
    } catch (err) {
      setTxStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsSending(false)
    }
  }

  if (initStatus !== 'finished') {
    return <main className="max-w-2xl mx-auto px-6 py-12"><div className="text-center text-[#606060]">Loading…</div></main>
  }

  if (!user && !solanaWallet) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-[#030303]">Solana + Dynamic</h1>
          <p className="text-[#606060] text-lg">
            Connect your Solana wallet using Dynamic&apos;s unified authentication SDK. Supports embedded wallets,
            Phantom, Solflare, and 100+ wallets out of the box.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
            {[
              { title: 'Docs', desc: 'Explore the Dynamic documentation', href: 'https://docs.dynamic.xyz' },
              { title: 'Dashboard', desc: 'Manage your environment ID', href: 'https://app.dynamic.xyz/dashboard/developer' },
              { title: 'GitHub', desc: 'View source and examples', href: 'https://github.com/dynamic-labs-oss' },
            ].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                className="block p-5 bg-white rounded-xl transition-colors" style={{ border: '1px solid #DADADA' }}>
                <h2 className="font-semibold mb-1 text-[#030303]">{link.title}</h2>
                <p className="text-sm text-[#606060]">{link.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
    )
  }

  const shortAddress = solanaWallet?.address
    ? `${solanaWallet.address.slice(0, 6)}...${solanaWallet.address.slice(-6)}`
    : ''

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">
      {/* User / Wallet overview */}
      <div className={card} style={cardStyle}>
        <h2 className={label}>Wallet</h2>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {user?.email && <p className="text-sm text-[#606060]">{user.email}</p>}
            <p className="text-xl font-mono font-bold text-[#030303]">{shortAddress}</p>
            {balance !== null && (
              <p className="text-[#606060]">{balance.toFixed(4)} SOL {network && <span className="text-xs ml-1 text-[#9ca3af]">({network})</span>}</p>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-sm bg-white text-[#030303] rounded-lg transition-colors hover:bg-[#F9F9F9] shrink-0"
            style={{ border: '1px solid #DADADA' }}
          >
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        </div>
      </div>

      {/* Sign message */}
      {solanaWallet && (
        <div className={card} style={cardStyle}>
          <h2 className={label}>Sign Message</h2>
          <form onSubmit={handleSignMessage} className="space-y-3">
            <input
              type="text"
              value={messageToSign}
              onChange={(e) => setMessageToSign(e.target.value)}
              placeholder="Message to sign"
              required
              className={inputClass}
              style={inputStyle}
            />
            <button type="submit" disabled={isSigning || !messageToSign} className={btnPrimary}>
              {isSigning ? 'Signing…' : 'Sign Message'}
            </button>
          </form>
          {signedSig && <StatusBadge text={`Signature: ${signedSig.slice(0, 40)}…`} success={true} />}
          {signError && <StatusBadge text={signError} success={false} />}
        </div>
      )}

      {/* Send SOL */}
      {solanaWallet && (
        <div className={card} style={cardStyle}>
          <h2 className={label}>Send SOL</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-sm text-[#606060] mb-1">Recipient address</label>
              <input id="recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)}
                placeholder="Solana public key" required className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm text-[#606060] mb-1">Amount (SOL)</label>
              <input id="amount" type="number" step="0.001" min="0.001" value={amount}
                onChange={(e) => setAmount(e.target.value)} required className={inputClass} style={inputStyle} />
            </div>
            <button type="submit" disabled={isSending || !recipient} className={btnPrimary}>
              {isSending ? 'Sending…' : 'Send SOL'}
            </button>
          </form>
          {txStatus && <StatusBadge text={txStatus} success={txStatus.startsWith('Success')} />}
        </div>
      )}
    </main>
  )
}
