'use client'

import { useWallet } from '@lazorkit/wallet'
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState, useEffect } from 'react'

export default function Home() {
  const {
    smartWalletPubkey,
    isConnected,
    isConnecting,
    isSigning,
    connect,
    disconnect,
    signAndSendTransaction,
    error,
    wallet,
  } = useWallet()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('0.01')
  const [copied, setCopied] = useState(false)
  const [txStatus, setTxStatus] = useState<string>('')

  useEffect(() => {
    if (wallet) {
      if (!wallet.passkeyPubkey || wallet.passkeyPubkey.length === 0) {
        setTxStatus('Error: Wallet data corrupted. Please disconnect and reconnect your wallet.')
        return
      }

      if (wallet.passkeyPubkey.length !== 33) {
        setTxStatus('Error: Invalid wallet data. Please disconnect and reconnect your wallet.')
        return
      }

      const storedCredId = localStorage.getItem('CREDENTIAL_ID')
      if (wallet.credentialId && !storedCredId) {
        localStorage.setItem('CREDENTIAL_ID', wallet.credentialId)
      }

      setTxStatus('')
    }
  }, [wallet, isConnected])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (err) {
      setTxStatus('Connection failed. Please try again.')
    }
  }

  const handleCopyAddress = async () => {
    if (smartWalletPubkey) {
      try {
        await navigator.clipboard.writeText(smartWalletPubkey.toString())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        setTxStatus('Failed to copy address')
      }
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!smartWalletPubkey || !recipientAddress || !amount) return

    if (!wallet || !wallet.passkeyPubkey || wallet.passkeyPubkey.length !== 33) {
      setTxStatus('Error: Invalid wallet state. Please disconnect and reconnect your wallet.')
      return
    }

    setTxStatus('')
    try {
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipientAddress)
      } catch (err) {
        setTxStatus('Error: Invalid recipient address')
        return
      }

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: LAMPORTS_PER_SOL * parseFloat(amount),
      })

      const sig = await signAndSendTransaction({
        instructions: [transferInstruction],
        transactionOptions: {
          computeUnitLimit: 200_000,
        },
      })

      setTxStatus(`Success! Transaction: ${sig}`)
      setRecipientAddress('')
      setAmount('0.01')

      setTimeout(() => setTxStatus(''), 5000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setTxStatus(`Error: ${errorMsg}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex items-center justify-between p-4 bg-gray-800">
        <div className="text-xl font-bold">LazorKit Scaffold</div>
        <div>
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {smartWalletPubkey?.toString().slice(0, 4)}...{smartWalletPubkey?.toString().slice(-4)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                  title="Copy full address"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <button onClick={disconnect} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
                Disconnect
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <a
            href="https://docs.lazorkit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <h2 className="text-2xl font-bold mb-2">Docs</h2>
            <p>Explore the LazorKit documentation to get started.</p>
          </a>
          <a
            href="https://github.com/lazor-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <h2 className="text-2xl font-bold mb-2">GitHub</h2>
            <p>Contribute and see the source code on our GitHub.</p>
          </a>
        </div>

        {isConnected && (
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Send SOL</h2>

              {wallet && (!wallet.passkeyPubkey || wallet.passkeyPubkey.length !== 33) && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded">
                  <p className="text-red-200 text-sm font-medium">⚠️ Wallet data is corrupted</p>
                  <p className="text-red-300 text-xs mt-1">
                    Please disconnect and reconnect your wallet to fix this issue.
                  </p>
                </div>
              )}

              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium mb-2">
                    Recipient Address
                  </label>
                  <input
                    id="recipient"
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Enter Solana address"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium mb-2">
                    Amount (SOL)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.01"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSigning || !recipientAddress || !amount}
                  className="w-full px-6 py-3 bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-500 font-medium"
                >
                  {isSigning ? 'Sending...' : 'Send SOL'}
                </button>
              </form>

              {txStatus && (
                <div
                  className={`mt-4 p-3 rounded ${txStatus.startsWith('Success') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}
                >
                  <p className="text-sm break-all">{txStatus}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-center text-red-500">Error: {error.message}</p>}
      </main>
    </div>
  )
}
