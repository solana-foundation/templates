import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function WalletDemo() {
  const { smartWalletPubkey, isConnected, isConnecting, isSigning, connect, disconnect, signAndSendTransaction, error } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Connection failed', err);
    }
  };

  const handleSend = async () => {
    if (!smartWalletPubkey) return;
    const tx = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: new PublicKey('TARGET_PUBLIC_KEY_BASE58'),
      lamports: LAMPORTS_PER_SOL * 0.01,
    });
    try {
      const sig = await signAndSendTransaction(tx);
      console.log('Sent!', sig);
    } catch (err) {
      console.error('Transaction failed', err);
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
        <div className="grid md:grid-cols-2 gap-8">
          <a href="https://docs.lazorkit.com/" target="_blank" rel="noopener noreferrer" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700">
            <h2 className="text-2xl font-bold mb-2">Docs</h2>
            <p>Explore the LazorKit documentation to get started.</p>
          </a>
          <a href="https://github.com/lazor-kit" target="_blank" rel="noopener noreferrer" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700">
            <h2 className="text-2xl font-bold mb-2">GitHub</h2>
            <p>Contribute and see the source code on our GitHub.</p>
          </a>
        </div>
        
        {isConnected && (
            <div className="mt-8 text-center">
                <button onClick={handleSend} disabled={isSigning} className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-500">
                {isSigning ? 'Sending...' : 'Send 0.01 SOL'}
                </button>
            </div>
        )}

        {error && <p className="mt-4 text-center text-red-500">Error: {error.message}</p>}
      </main>
    </div>
  );
}
