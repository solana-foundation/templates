export const ARNS_CONFIG = {
  name: process.env.NEXT_PUBLIC_ARNS_NAME || 'your-app',
  undername: process.env.NEXT_PUBLIC_ARNS_UNDERNAME || '@',
  deploymentUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '',
  txId: process.env.NEXT_PUBLIC_DEPLOYMENT_TX_ID || '',
}

export const ARWEAVE_CONFIG = {
  gateway: 'https://ar.io',
  arnsGateway: 'https://ar.io',
  explorer: 'https://viewblock.io/arweave/tx',
}
