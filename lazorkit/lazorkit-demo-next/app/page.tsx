"use client";
import { useWallet } from "@lazorkit/wallet";
import { Connection, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import * as anchor from '@coral-xyz/anchor';

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);

export default function Home() {

  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');

  const {
    smartWalletPubkey,
    isConnected,
    isConnecting,
    isSigning,
    error,
    connect,
    disconnect,
    signTransaction,
    signAndSendTransaction
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  useEffect(() => {
    if (!smartWalletPubkey) return; // Add check for smartWalletPubkey
    const getBalance = async () => {
      const balance = await connection.getBalance(new PublicKey(smartWalletPubkey!));
      setBalance(balance);
    }
    getBalance();
  }, [smartWalletPubkey]);

  const handleSign = async () => {
    if (!smartWalletPubkey) return;

    // Create a memo instruction
    const instruction = new anchor.web3.TransactionInstruction({
      keys: [],
      programId: new anchor.web3.PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'),
      data: Buffer.from(message, 'utf-8'),
    });

    try {
      const signature = await signTransaction(instruction);
      setSignature(signature.toString());
      console.log('Transaction signature:', signature);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  const sendSOL = async () => {
    if (!smartWalletPubkey) return;

    const instruction = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: new PublicKey('MTSLZDJppGh6xUcnrSSbSQE5fgbvCtQ496MqgQTv8c1'),
      lamports: 0.1 * LAMPORTS_PER_SOL,
    });

    try {
      // Sign and send in one step
      const signature = await signAndSendTransaction(instruction);
      console.log('Transfer successful:', signature);
      return signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex items-center justify-between p-4 bg-gray-800">
        <div className="text-xl font-bold">Lazerkit scaffold</div>
        <div>
          {!isConnected ? (
            <button onClick={handleConnect} disabled={isConnecting} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-500">
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm">{smartWalletPubkey?.toString().slice(0, 4)}...{smartWalletPubkey?.toString().slice(-4)}</span>
              <button onClick={disconnect} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Disconnect</button>
            </div>
          )}
        </div>
      </nav>

      <main className="p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <a href="https://docs.lazorkit.com/" target="_blank" rel="noopener noreferrer" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700">
            <h2 className="text-2xl font-bold mb-2">Docs</h2>
            <p>Explore the LazorKit documentation to get started.</p>
          </a>
          <a href="https://github.com/lazor-kit" target="_blank" rel="noopener noreferrer" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700">
            <h2 className="text-2xl font-bold mb-2">GitHub</h2>
            <p>Contribute and see the source code on our GitHub.</p>
          </a>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h1 className="text-2xl font-bold mb-4">LazorKit Wallet Demo</h1>
          
          <div className="space-y-4">
            <p><strong>LazorKit Program ID:</strong> {new anchor.web3.PublicKey('3CFG1eVGpUVAxMeuFnNw7CbBA1GQ746eQDdMWPoFTAD8').toString()}</p>
            <p><strong>Paymaster Wallet:</strong> {new anchor.web3.PublicKey('hij78MKbJSSs15qvkHWTDCtnmba2c1W4r1V22g5sD8w').toString()}</p>

            {isConnected && (
              <div className="border-t border-gray-700 pt-4 mt-4 space-y-4">
                <p><strong>Smart Wallet Address:</strong> {smartWalletPubkey?.toString()}</p>
                <p><strong>Balance:</strong> {balance / LAMPORTS_PER_SOL} SOL</p>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message to Sign:</label>
                  <input
                    type="text"
                    id="message"
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message here"
                  />
                  {signature && <p className="mt-2 text-sm text-gray-400"><strong>Signature:</strong> {signature}</p>}
                  <button
                    onClick={handleSign}
                    disabled={isSigning}
                    className="mt-4 px-6 py-3 bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-gray-500 w-full"
                  >
                    {isSigning ? 'Signing...' : 'Sign Message'}
                  </button>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <button
                    onClick={handleSend}
                    disabled={isSigning}
                    className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-500 w-full"
                  >
                    {isSigning ? 'Sending...' : 'Send 0.1 SOL'}
                  </button>
                </div>
              </div>
            )}
            {!isConnected && (
              <p className="text-center text-gray-400">Connect your wallet to see more options.</p>
            )}
          </div>
        </div>

        {error && <p className="mt-4 text-center text-red-500">Error: {error.message}</p>}
      </main>
    </div>
  );
}
