import { useInitStatus, useUser, useWalletAccounts } from '@dynamic-labs-sdk/react-hooks'
import { getActiveNetworkData, signMessage } from '@dynamic-labs-sdk/client'
import { isSolanaWalletAccount, getSolanaConnection, signAndSendTransaction } from '@dynamic-labs-sdk/solana'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { Header } from './components/header'
import Footer from './components/footer'

export function App() {
  const initStatus = useInitStatus()
  const user = useUser()
  const accounts = useWalletAccounts()

  const [balance, setBalance] = useState<number | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Send SOL state
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0.01')
  const [txStatus, setTxStatus] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Sign message state
  const [messageToSign, setMessageToSign] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [signError, setSignError] = useState<string | null>(null)
  const [isSigning, setIsSigning] = useState(false)

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
        const pubkey = new PublicKey(solanaWallet.address)
        const lamports = await connection.getBalance(pubkey)
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

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!solanaWallet || !messageToSign) return
    setIsSigning(true)
    setSignError(null)
    setSignature(null)
    try {
      const result = await signMessage({ walletAccount: solanaWallet, message: messageToSign })
      setSignature(result.signature)
    } catch (err) {
      setSignError(err instanceof Error ? err.message : 'Failed to sign message')
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

      const lamports = Math.round(parseFloat(amount) * LAMPORTS_PER_SOL)
      if (!Number.isFinite(lamports) || lamports <= 0) {
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
          lamports,
        }),
      )

      const { signature: txSig } = await signAndSendTransaction({ walletAccount: solanaWallet, transaction: tx })
      setTxStatus(`Success! Signature: ${txSig}`)
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

  const shortAddress = solanaWallet?.address
    ? `${solanaWallet.address.slice(0, 4)}...${solanaWallet.address.slice(-4)}`
    : ''

  const inputClass =
    'w-full px-4 py-2.5 bg-white rounded-lg text-sm text-[#030303] placeholder-[#9ca3af] outline-none focus:border-[#4779FF] focus:ring-1 focus:ring-[#4779FF]/30 transition-colors'

  const cardStyle = {
    border: '1px solid #DADADA',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pb-16" style={{ background: 'rgb(249,249,249)' }}>
        <main className="max-w-2xl mx-auto px-6 py-12">
          {initStatus !== 'finished' ? (
            <div className="text-center text-[#606060]">Loading...</div>
          ) : !user ? (
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
              {/* User card */}
              <div className="bg-white rounded-xl p-6 space-y-4" style={cardStyle}>
                <h2 className="text-sm font-medium text-[#606060] uppercase tracking-wide">Account</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#606060] mb-1">
                      {user.email ?? 'Wallet user'}
                    </p>
                    <p className="text-2xl font-mono font-bold text-[#030303]">{shortAddress}</p>
                    {balance !== null && (
                      <p className="text-[#606060] mt-1">{balance.toFixed(4)} SOL {network && <span className="text-xs ml-1 text-[#9ca3af]">({network})</span>}</p>
                    )}
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

              {/* Sign message card */}
              <div className="bg-white rounded-xl p-6" style={cardStyle}>
                <h2 className="text-sm font-medium text-[#606060] uppercase tracking-wide mb-4">Sign Message</h2>
                <form onSubmit={handleSign} className="space-y-4">
                  <div>
                    <label htmlFor="message" className="block text-sm text-[#606060] mb-1">
                      Message
                    </label>
                    <input
                      id="message"
                      type="text"
                      value={messageToSign}
                      onChange={(e) => setMessageToSign(e.target.value)}
                      placeholder="Enter a message to sign"
                      required
                      className={inputClass}
                      style={{ border: '1px solid #DADADA' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSigning || !messageToSign}
                    className="w-full py-3 bg-[#4779FF] hover:bg-[#3366ee] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {isSigning ? 'Signing...' : 'Sign'}
                  </button>
                </form>

                {signError && (
                  <div
                    className="mt-4 p-3 rounded-lg text-sm text-[#C5221F] bg-[#FCE8E6] break-all"
                    style={{ border: '1px solid #F5C6C2' }}
                  >
                    {signError}
                  </div>
                )}

                {signature && (
                  <div
                    className="mt-4 p-3 rounded-lg text-sm text-[#137333] bg-[#E6F4EA] break-all"
                    style={{ border: '1px solid #CEEAD6' }}
                  >
                    <span className="font-medium">Signature: </span>
                    {signature.slice(0, 20)}...{signature.slice(-20)}
                  </div>
                )}
              </div>

              {/* Send SOL card */}
              <div className="bg-white rounded-xl p-6" style={cardStyle}>
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
      </div>
      <Footer />
    </>
  )
}
