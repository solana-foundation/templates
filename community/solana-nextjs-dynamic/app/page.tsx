'use client'

import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { isSolanaWallet } from '@dynamic-labs/solana'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useEffect, useState } from 'react'

export default function Home() {
  const isLoggedIn = useIsLoggedIn()
  const { primaryWallet, sdkHasLoaded } = useDynamicContext()

  const [balance, setBalance] = useState<number | null>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0.01')
  const [txStatus, setTxStatus] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !primaryWallet || !isSolanaWallet(primaryWallet)) {
      setBalance(null)
      return
    }

    async function fetchBalance() {
      if (!primaryWallet || !isSolanaWallet(primaryWallet)) return
      const connection = await primaryWallet.getConnection()
      const pubkey = new PublicKey(primaryWallet.address)
      const lamports = await connection.getBalance(pubkey)
      setBalance(lamports / LAMPORTS_PER_SOL)
    }

    fetchBalance()
  }, [isLoggedIn, primaryWallet])

  const handleCopy = async () => {
    if (!primaryWallet?.address) return
    await navigator.clipboard.writeText(primaryWallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!primaryWallet || !isSolanaWallet(primaryWallet)) return

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

      const connection = await primaryWallet.getConnection()
      const signer = await primaryWallet.getSigner()
      const { blockhash } = await connection.getLatestBlockhash()

      const tx = new Transaction()
      tx.recentBlockhash = blockhash
      tx.feePayer = new PublicKey(primaryWallet.address)
      tx.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(primaryWallet.address),
          toPubkey: recipientPubkey,
          lamports: Math.round(parseFloat(amount) * LAMPORTS_PER_SOL),
        }),
      )

      const sig = await signer.signAndSendTransaction(tx)
      setTxStatus(`Success! Signature: ${sig.signature}`)
      setRecipient('')
      setAmount('0.01')

      const lamports = await connection.getBalance(new PublicKey(primaryWallet.address))
      setBalance(lamports / LAMPORTS_PER_SOL)
    } catch (err) {
      setTxStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsSending(false)
    }
  }

  const shortAddress = primaryWallet?.address
    ? `${primaryWallet.address.slice(0, 4)}...${primaryWallet.address.slice(-4)}`
    : ''

  const inputClass =
    'w-full px-4 py-2.5 bg-white rounded-lg text-sm text-[#030303] placeholder-[#9ca3af] outline-none focus:border-[#4779FF] focus:ring-1 focus:ring-[#4779FF]/30 transition-colors'

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      {!sdkHasLoaded ? (
        <div className="text-center text-[#606060]">Loading...</div>
      ) : !isLoggedIn ? (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-[#030303]">Solana + Dynamic</h1>
          <p className="text-[#606060] text-lg">
            Connect your Solana wallet using Dynamic&apos;s unified authentication SDK. Supports embedded wallets,
            Phantom, Solflare, and 100+ wallets out of the box.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
            <a
              href="https://docs.dynamic.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-white rounded-xl transition-colors"
              style={{ border: '1px solid #DADADA' }}
            >
              <h2 className="font-semibold mb-1 text-[#030303]">Docs</h2>
              <p className="text-sm text-[#606060]">Explore the Dynamic documentation</p>
            </a>
            <a
              href="https://app.dynamic.xyz/dashboard/developer"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-white rounded-xl transition-colors"
              style={{ border: '1px solid #DADADA' }}
            >
              <h2 className="font-semibold mb-1 text-[#030303]">Dashboard</h2>
              <p className="text-sm text-[#606060]">Manage your environment ID</p>
            </a>
            <a
              href="https://github.com/dynamic-labs-oss"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-white rounded-xl transition-colors"
              style={{ border: '1px solid #DADADA' }}
            >
              <h2 className="font-semibold mb-1 text-[#030303]">GitHub</h2>
              <p className="text-sm text-[#606060]">View source and examples</p>
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div
            className="bg-white rounded-xl p-6 space-y-4"
            style={{ border: '1px solid #DADADA', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}
          >
            <h2 className="text-sm font-medium text-[#606060] uppercase tracking-wide">Wallet</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-mono font-bold text-[#030303]">{shortAddress}</p>
                {balance !== null && <p className="text-[#606060] mt-1">{balance.toFixed(4)} SOL</p>}
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-sm bg-white text-[#030303] rounded-lg transition-colors hover:bg-[#F9F9F9]"
                style={{ border: '1px solid #DADADA' }}
              >
                {copied ? 'Copied!' : 'Copy address'}
              </button>
            </div>
          </div>

          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid #DADADA', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}
          >
            <h2 className="text-sm font-medium text-[#606060] uppercase tracking-wide mb-4">Send SOL</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label htmlFor="recipient" className="block text-sm text-[#606060] mb-1">
                  Recipient address
                </label>
                <input
                  id="recipient"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Solana public key"
                  required
                  className={inputClass}
                  style={{ border: '1px solid #DADADA' }}
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm text-[#606060] mb-1">
                  Amount (SOL)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className={inputClass}
                  style={{ border: '1px solid #DADADA' }}
                />
              </div>
              <button
                type="submit"
                disabled={isSending || !recipient}
                className="w-full py-3 bg-[#4779FF] hover:bg-[#3366ee] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isSending ? 'Sending...' : 'Send SOL'}
              </button>
            </form>

            {txStatus && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm break-all ${
                  txStatus.startsWith('Success')
                    ? 'bg-[#E6F4EA] text-[#137333]'
                    : 'bg-[#FCE8E6] text-[#C5221F]'
                }`}
                style={{ border: txStatus.startsWith('Success') ? '1px solid #CEEAD6' : '1px solid #F5C6C2' }}
              >
                {txStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
