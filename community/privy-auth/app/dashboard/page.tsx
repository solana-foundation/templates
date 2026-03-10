"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import bs58 from "bs58";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

type SolanaWalletAccount = { type: "wallet"; chainType: "solana"; address: string; walletClientType?: string; imported?: boolean };

export default function Dashboard() {
  const { authenticated, ready, user, logout, getAccessToken } = usePrivy();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const { wallets } = useWallets();
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const rawSolanaWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet" && account.chainType === "solana"
  );
  const solanaWallet = rawSolanaWallet && "address" in rawSolanaWallet
    ? (rawSolanaWallet as SolanaWalletAccount)
    : undefined;

  useEffect(() => {
    const fetchBalance = async () => {
      if (solanaWallet?.address) {
        setLoadingBalance(true);
        try {
          const connection = new Connection("https://api.devnet.solana.com", "confirmed");
          const publicKey = new PublicKey(solanaWallet.address);
          const balanceInLamports = await connection.getBalance(publicKey);
          setBalance(balanceInLamports / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance(0);
        } finally {
          setLoadingBalance(false);
        }
      }
    };

    fetchBalance();
  }, [solanaWallet?.address]);

  if (!ready || !authenticated || !user) return null;

  const getLinkedAccounts = () => {
    const accounts = [];
    if (user.google) accounts.push({ type: "Google", email: user.google.email, subject: user.google.subject });
    if (user.discord) accounts.push({ type: "Discord", username: user.discord.username, subject: user.discord.subject });
    if (user.twitter) accounts.push({ type: "Twitter", username: user.twitter.username, subject: user.twitter.subject });
    if (user.email) accounts.push({ type: "Email", email: user.email.address });
    return accounts;
  };

  const handleGetAccessToken = async () => {
    try {
      const token = await getAccessToken();
      console.log("Access token:", token);
      alert("Access token logged to console");
    } catch (error) {
      console.error("Failed to get access token:", error);
    }
  };

  const handleSendTransaction = async () => {
    if (!recipientAddress || !amount || !solanaWallet?.address) {
      alert("Please enter recipient address and amount");
      return;
    }

    const solanaWalletFromHook = wallets.find((w) => w.address === solanaWallet.address);

    if (!solanaWalletFromHook) {
      alert("Solana wallet not ready. Please try again.");
      return;
    }

    setIsSending(true);
    setTxSignature(null);

    try {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const fromPubkey = new PublicKey(solanaWallet.address);
      const toPubkey = new PublicKey(recipientAddress);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: fromPubkey,
        blockhash,
        lastValidBlockHeight,
      }).add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      const serialized = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      const result = await signAndSendTransaction({
        transaction: new Uint8Array(serialized),
        wallet: solanaWalletFromHook,
        chain: "solana:devnet",
      });

      const signatureStr = typeof result.signature === "string"
        ? result.signature
        : bs58.encode(result.signature as Uint8Array);

      setTxSignature(signatureStr);
      setRecipientAddress("");
      setAmount("");

      const balanceInLamports = await connection.getBalance(fromPubkey);
      setBalance(balanceInLamports / LAMPORTS_PER_SOL);
    } catch (error: unknown) {
      console.error("Transaction error:", error);
      alert(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Image src="/privy-logo.svg" alt="Privy" width={28} height={28} />
              <span className="text-xl font-bold text-gray-400">×</span>
              <Image src="/solana-logo.svg" alt="Solana" width={28} height={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Protected Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">This route requires authentication</p>
            </div>
          </div>
          <Link href="/" className="text-black hover:text-gray-600 font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-gray-200 rounded-2xl p-8 space-y-6 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black">User Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">User ID</div>
                <div className="font-mono text-sm text-gray-800">{user.id}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Created At</div>
                <div className="text-sm text-gray-800">{new Date(user.createdAt).toLocaleString()}</div>
              </div>

              {user.hasAcceptedTerms && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Terms Accepted</div>
                  <div className="text-sm text-emerald-600 font-semibold">✓ Yes</div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 space-y-6 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black">Session Management</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Authentication Status</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-800">Active Session</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Session Type</div>
                <div className="text-sm text-gray-800">Privy JWT Token</div>
              </div>

              <button
                onClick={handleGetAccessToken}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors text-black"
              >
                Get Access Token (Console)
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-gray-700">
                  Sessions persist across page refreshes and are automatically refreshed by Privy
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 space-y-6 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black">Linked Accounts</h2>
            </div>
            
            {getLinkedAccounts().length > 0 ? (
              <div className="space-y-3">
                {getLinkedAccounts().map((account, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="font-semibold text-sm text-black">{account.type}</div>
                    <div className="text-sm text-gray-700 mt-1">
                      {account.email || account.username}
                    </div>
                    {account.subject && (
                      <div className="text-xs text-gray-400 mt-2 font-mono break-all">
                        {account.subject}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No linked accounts</p>
            )}
          </div>

          <div className="border border-purple-200 rounded-2xl p-8 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm">
            <div className="flex items-center gap-3">
              <Image src="/solana-logo.svg" alt="Solana" width={40} height={40} />
              <h2 className="text-xl font-bold text-black">Wallet Connection</h2>
            </div>
            
            {solanaWallet ? (
              <div className="space-y-4">
                <div className="bg-white/80 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-purple-900">Connected</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Address</div>
                      <div className="font-mono text-xs break-all text-gray-800 bg-white p-2 rounded-lg">
                        {solanaWallet.address}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Balance (Devnet)</div>
                      <div className="text-2xl font-bold text-gray-800 bg-white p-3 rounded-lg">
                        {loadingBalance ? (
                          <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
                        ) : (
                          <span>{balance !== null ? `${balance.toFixed(4)} SOL` : "0.0000 SOL"}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Wallet Type</div>
                        <div className="text-xs text-gray-800">
                          {solanaWallet.walletClientType === "privy" ? "Embedded (Privy)" : solanaWallet.walletClientType}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Network</div>
                        <div className="text-xs text-gray-800">Devnet</div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Imported</div>
                        <div className="text-xs text-gray-800">{solanaWallet.imported ? "Yes" : "No"}</div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Custodial</div>
                        <div className="text-xs text-gray-800">Non-custodial</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs text-gray-700">
                    This wallet was automatically created when you signed in. It&apos;s non-custodial and controlled by you.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No Solana wallet found. Embedded wallets are created automatically on first login.
              </div>
            )}
          </div>
        </div>

        {solanaWallet && (
          <div className="border border-blue-200 rounded-2xl p-8 space-y-6 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-black">Send Transaction</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 block">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter Solana address"
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 block">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.001"
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <button
                onClick={handleSendTransaction}
                disabled={isSending || !recipientAddress || !amount}
                className="w-full px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSending ? "Sending..." : "Sign & Send Transaction"}
              </button>

              {txSignature && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                    ✓ Transaction Successful
                  </div>
                  <div className="text-xs text-gray-700 break-all font-mono">
                    {txSignature}
                  </div>
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                  >
                    View on Solana Explorer →
                  </a>
                </div>
              )}

              <div className="bg-white/80 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-gray-700">
                  <strong>Note:</strong> This demo uses Solana Devnet. Get free devnet SOL from{" "}
                  <a
                    href="https://faucet.solana.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    faucet.solana.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-8 flex gap-4">
          <button
            onClick={logout}
            className="px-8 py-4 border-2 border-red-300 text-red-600 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
