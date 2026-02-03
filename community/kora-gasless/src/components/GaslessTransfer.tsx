'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getFeePayer, signAndSendGasless } from '@/lib/kora';

export function GaslessTransfer() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0.001');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!publicKey || !signTransaction || !recipient) return;
    
    setLoading(true);
    setStatus('Building transaction...');

    try {
      // Get Kora fee payer
      const feePayer = await getFeePayer();
      const { blockhash } = await connection.getLatestBlockhash();

      // Build transaction with Kora as fee payer
      const tx = new Transaction();
      tx.recentBlockhash = blockhash;
      tx.feePayer = new PublicKey(feePayer);
      tx.add(SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipient),
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
      }));

      // User signs (but doesn't pay fee!)
      setStatus('Sign with your wallet...');
      const signedByUser = await signTransaction(tx);

      // Send to Kora for fee payer signature
      setStatus('Kora signing as fee payer...');
      const serialized = signedByUser.serialize({ requireAllSignatures: false }).toString('base64');
      const { signedTransaction } = await signAndSendGasless(serialized);

      // Broadcast to network
      setStatus('Sending to network...');
      const sig = await connection.sendRawTransaction(Buffer.from(signedTransaction, 'base64'));
      
      setStatus(`✅ Success! Tx: ${sig.slice(0, 20)}...`);
    } catch (e) {
      setStatus(`❌ Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return <p className="text-gray-500 text-center">Connect wallet to start</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="font-semibold mb-4">Gasless SOL Transfer</h2>
      <p className="text-sm text-gray-500 mb-4">
        Send SOL without paying fees - Kora covers the cost!
      </p>
      
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.001"
        className="w-full p-2 border rounded mb-4"
      />
      
      <button
        onClick={handleTransfer}
        disabled={loading || !recipient}
        className="w-full bg-purple-600 text-white p-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Send (Gasless)'}
      </button>
      
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
