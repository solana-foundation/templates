'use client'

import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from '@dynamic-labs/sdk-react-core'
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

      // Refresh balance
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Solana</span>
          <span className="text-gray-500">×</span>
          <span className="text-xl font-bold text-purple-400">Dynamic</span>
        </div>
        <DynamicWidget />
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {!sdkHasLoaded ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : !isLoggedIn ? (
          /* Landing */
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Solana + Dynamic</h1>
            <p className="text-gray-400 text-lg">
              Connect your Solana wallet using Dynamic&apos;s unified authentication SDK.
              Supports Phantom, Solflare, and 100+ wallets out of the box.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
              <a
                href="https://docs.dynamic.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500 transition-colors"
              >
                <h2 className="font-semibold mb-1">Docs</h2>
                <p className="text-sm text-gray-400">Explore the Dynamic documentation</p>
              </a>
              <a
                href="https://app.dynamic.xyz/dashboard/developer"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500 transition-colors"
              >
                <h2 className="font-semibold mb-1">Dashboard</h2>
                <p className="text-sm text-gray-400">Manage your environment ID</p>
              </a>
              <a
                href="https://github.com/dynamic-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500 transition-colors"
              >
                <h2 className="font-semibold mb-1">GitHub</h2>
                <p className="text-sm text-gray-400">View source and examples</p>
              </a>
            </div>
          </div>
        ) : (
          /* Authenticated view */
          <div className="space-y-6">
            {/* Wallet card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-300">Wallet</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-mono font-bold">{shortAddress}</p>
                  {balance !== null && (
                    <p className="text-gray-400 mt-1">{balance.toFixed(4)} SOL</p>
                  )}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy address'}
                </button>
              </div>
            </div>

            {/* Send SOL */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-300 mb-4">Send SOL</h2>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm text-gray-400 mb-1">
                    Recipient address
                  </label>
                  <input
                    id="recipient"
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Solana public key"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm text-gray-400 mb-1">
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
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending || !recipient}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
                >
                  {isSending ? 'Sending...' : 'Send SOL'}
                </button>
              </form>

              {txStatus && (
                <div
                  className={`mt-4 p-3 rounded-lg text-sm break-all ${
                    txStatus.startsWith('Success')
                      ? 'bg-green-900/40 text-green-300 border border-green-800'
                      : 'bg-red-900/40 text-red-300 border border-red-800'
                  }`}
                >
                  {txStatus}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
