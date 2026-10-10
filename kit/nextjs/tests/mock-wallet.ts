import {
  generateKeyPair,
  getAddressFromPublicKey,
  getTransactionDecoder,
  getTransactionEncoder,
  partiallySignTransaction,
  signBytes,
} from "@solana/kit";
import { registerWallet } from "@wallet-standard/wallet";

const keyPair = await generateKeyPair();

export const mockWalletAddress: string = await getAddressFromPublicKey(
  keyPair.publicKey
);

const publicKeyBytes = new Uint8Array(
  await crypto.subtle.exportKey("raw", keyPair.publicKey)
);

const CHAINS = ["solana:devnet"] as const;

const ICON =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="#9945FF"/></svg>'
  );

const account = {
  address: mockWalletAddress,
  chains: CHAINS,
  features: ["solana:signMessage", "solana:signTransaction"] as const,
  publicKey: publicKeyBytes,
};

// Real wallets expose no accounts until the user approves a connection.
let connectedAccounts: (typeof account)[] = [];

export const mockWallet = {
  chains: CHAINS,
  features: {
    "solana:signMessage": {
      signMessage: async (...inputs: readonly { message: Uint8Array }[]) =>
        Promise.all(
          inputs.map(async ({ message }) => ({
            signature: new Uint8Array(
              await signBytes(keyPair.privateKey, message)
            ),
            signedMessage: message,
          }))
        ),
      version: "1.0.0" as const,
    },
    "solana:signTransaction": {
      signTransaction: async (
        ...inputs: readonly { transaction: Uint8Array }[]
      ) =>
        Promise.all(
          inputs.map(async ({ transaction }) => {
            const signed = await partiallySignTransaction(
              [keyPair],
              getTransactionDecoder().decode(transaction)
            );
            return {
              signedTransaction: new Uint8Array(
                getTransactionEncoder().encode(signed)
              ),
            };
          })
        ),
      supportedTransactionVersions: ["legacy", 0] as const,
      version: "1.0.0" as const,
    },
    "standard:connect": {
      connect: async () => {
        connectedAccounts = [account];
        return { accounts: connectedAccounts };
      },
      version: "1.0.0" as const,
    },
    "standard:events": {
      on: () => () => {},
      version: "1.0.0" as const,
    },
  },
  get accounts() {
    return connectedAccounts;
  },
  icon: ICON as `data:image/svg+xml;base64,${string}`,
  name: "Mock Wallet",
  version: "1.0.0" as const,
};

export function registerMockWallet(): void {
  registerWallet(mockWallet);
}

export function resetMockWallet(): void {
  connectedAccounts = [];
}
