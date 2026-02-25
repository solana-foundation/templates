import type { User, LinkedAccountType } from '@privy-io/react-auth';

export type { User as PrivyUser, LinkedAccountType };

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface PrivyWallet {
  address: string;
  chainType: 'solana' | 'ethereum';
  walletClientType: string;
  connectorType: 'embedded' | 'injected' | 'wallet_connect' | 'coinbase_wallet';
  imported: boolean;
  delegated: boolean;
}

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  wallets: PrivyWallet[];
  solanaWallet: PrivyWallet | null;
}
