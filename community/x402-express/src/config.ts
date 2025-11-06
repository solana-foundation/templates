// you can get dev usdc faucet https://faucet.circle.com/
export const payToAddress =
  process.env.PAY_TO_ADDRESS || "Dy6mBH4YeqJCRZohd39iSFaf4jyLaxPeBakbZwt1jToL";

export const network = process.env.NETWORK || "mainnet-beta";

export const asset = process.env.ASSET || "USDC";

export const amount = process.env.AMOUNT || "100";
