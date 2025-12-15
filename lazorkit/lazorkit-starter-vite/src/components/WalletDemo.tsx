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
    <div style={{ padding: 20 }}>
      {!isConnected ? (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <p>Wallet: {smartWalletPubkey?.toString()}</p>
          <button onClick={handleSend} disabled={isSigning}>Send 0.01 SOL</button>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}
