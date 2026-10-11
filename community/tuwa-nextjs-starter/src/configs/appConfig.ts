export const appConfig = {
  // The origin users open the app at: the only domain the SIWX server accepts
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const solanaRPCUrls = {
  mainnet: alchemyKey ? `https://solana-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
};
