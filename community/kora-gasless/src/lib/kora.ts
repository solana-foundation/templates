import { KoraClient } from '@solana/kora';

// Initialize Kora client
export function getKoraClient(): KoraClient {
  const rpcUrl = process.env.NEXT_PUBLIC_KORA_RPC_URL || 'http://localhost:8080';
  return new KoraClient({ rpcUrl });
}

// Get the fee payer address from Kora
export async function getFeePayer(): Promise<string> {
  const kora = getKoraClient();
  const config = await kora.getConfig();
  return config.fee_payers[0];
}

// Sign and send a gasless transaction through Kora
export async function signAndSendGasless(
  serializedTransaction: string
): Promise<{ signedTransaction: string; signerPubkey: string }> {
  const kora = getKoraClient();
  const result = await kora.signAndSendTransaction({
    transaction: serializedTransaction,
  });
  return {
    signedTransaction: result.signed_transaction,
    signerPubkey: result.signer_pubkey,
  };
}
