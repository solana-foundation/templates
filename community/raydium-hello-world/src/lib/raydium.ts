"use client";

import type {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import type {
  ApiV3PoolInfoStandardItemCpmm,
  CpmmKeys,
  CpmmParsedRpcData,
  Raydium,
} from "@raydium-io/raydium-sdk-v2";
import type BN from "bn.js";

// Devnet pools are mortal. When this one dies, find a live one
// (docs: https://docs.raydium.io/sdk-api/rest-api):
//   curl "https://api-v3-devnet.raydium.io/pools/info/list?poolType=standard&poolSortField=default&sortType=desc&pageSize=3&page=1"
export const POOL_ID =
  process.env.NEXT_PUBLIC_POOL_ID ??
  "6kFhahFEKKJqgWx8yJjSwSTxanfDYMiYTnR9aXoP6dnw";

export const INPUT_MINT =
  process.env.NEXT_PUBLIC_INPUT_MINT ??
  "So11111111111111111111111111111111111111112";

export const DEFAULT_AMOUNT_RAW = process.env.NEXT_PUBLIC_AMOUNT_RAW ?? "";

export type PoolBundle = {
  poolInfo: ApiV3PoolInfoStandardItemCpmm;
  poolKeys: CpmmKeys | undefined;
  rpcData: CpmmParsedRpcData;
};

export type QuoteResult = {
  amountOut: string;
  tradeFee: string;
  // The raw input amount this quote was computed for. Execution uses this,
  // never the live input field — quote and amount must stay an atomic pair.
  amountInRaw: BN;
  swapResult: SwapResultLike;
  baseIn: boolean;
};

type SwapResultLike = Record<string, unknown> & {
  inputAmount: BN;
  outputAmount: BN;
};

type SignAllTransactions = <T extends Transaction | VersionedTransaction>(
  transactions: T[]
) => Promise<T[]>;

let raydiumCache: { key: string; sdk: Raydium } | null = null;

// Three things worth understanding here:
// - `owner` is the wallet's PublicKey, never a secret key. The SDK calls
//   wallet-adapter's `signAllTransactions` when a transaction needs signing.
// - Devnet needs explicit API hosts; without them the SDK silently talks to
//   mainnet endpoints and nothing resolves.
// - The SDK is imported dynamically so Next.js never evaluates its
//   node-flavored dependencies during build-time prerendering.
export async function initRaydium(
  connection: Connection,
  owner: PublicKey | null,
  signAllTransactions?: SignAllTransactions
): Promise<Raydium> {
  const cacheKey = `${owner?.toBase58() ?? "anonymous"}:${
    signAllTransactions ? "signer" : "read-only"
  }`;
  if (raydiumCache?.key === cacheKey) return raydiumCache.sdk;

  const { Raydium, DEV_API_URLS } = await import("@raydium-io/raydium-sdk-v2");

  const sdk = await Raydium.load({
    connection,
    owner: owner ?? undefined,
    signAllTransactions,
    cluster: "devnet",
    disableFeatureCheck: true,
    disableLoadToken: true,
    blockhashCommitment: "finalized",
    urlConfigs: {
      ...DEV_API_URLS,
      BASE_HOST: "https://api-v3-devnet.raydium.io",
      OWNER_BASE_HOST: "https://owner-v1-devnet.raydium.io",
      SWAP_HOST: "https://transaction-v1-devnet.raydium.io",
    },
  });

  raydiumCache = { key: cacheKey, sdk };
  return sdk;
}

export async function loadPool(
  connection: Connection,
  owner: PublicKey | null,
  signAllTransactions?: SignAllTransactions
): Promise<PoolBundle> {
  const sdk = await initRaydium(connection, owner, signAllTransactions);
  const { poolInfo, poolKeys, rpcData } =
    await sdk.cpmm.getPoolInfoFromRpc(POOL_ID);
  return { poolInfo, poolKeys, rpcData };
}

// CurveCalculator runs the same constant-product math as the on-chain
// program, locally over already-fetched reserves — quoting per keystroke
// costs no RPC calls.
export async function computeQuote(
  bundle: PoolBundle,
  amountInRaw: BN
): Promise<QuoteResult> {
  const { CurveCalculator, FeeOn } = await import("@raydium-io/raydium-sdk-v2");
  const { poolInfo, rpcData } = bundle;

  if (
    INPUT_MINT !== poolInfo.mintA.address &&
    INPUT_MINT !== poolInfo.mintB.address
  ) {
    throw new Error("Input mint does not match this pool");
  }
  const baseIn = INPUT_MINT === poolInfo.mintA.address;

  const swapResult = CurveCalculator.swapBaseInput(
    amountInRaw,
    baseIn ? rpcData.baseReserve : rpcData.quoteReserve,
    baseIn ? rpcData.quoteReserve : rpcData.baseReserve,
    rpcData.configInfo!.tradeFeeRate,
    rpcData.configInfo!.creatorFeeRate,
    rpcData.configInfo!.protocolFeeRate,
    rpcData.configInfo!.fundFeeRate,
    rpcData.feeOn === FeeOn.BothToken || rpcData.feeOn === FeeOn.OnlyTokenB
  );

  const inDecimals = baseIn ? poolInfo.mintA.decimals : poolInfo.mintB.decimals;
  const outDecimals = baseIn
    ? poolInfo.mintB.decimals
    : poolInfo.mintA.decimals;

  return {
    amountOut: fromRawAmount(swapResult.outputAmount.toString(), outDecimals),
    tradeFee: fromRawAmount(swapResult.tradeFee.toString(), inDecimals),
    amountInRaw,
    swapResult: swapResult as unknown as SwapResultLike,
    baseIn,
  };
}

export const SLIPPAGE = 0.005;

export async function executeSwap(
  connection: Connection,
  owner: PublicKey,
  signAllTransactions: SignAllTransactions,
  bundle: PoolBundle,
  quote: QuoteResult
): Promise<string> {
  const { TxVersion } = await import("@raydium-io/raydium-sdk-v2");
  const BNCtor = (await import("bn.js")).default;
  const sdk = await initRaydium(connection, owner, signAllTransactions);

  // The SDK mutates swapResult in place (it applies the slippage discount to
  // outputAmount). Hand it a clone so retries never compound the discount on
  // our cached quote.
  const swapResultClone: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(quote.swapResult)) {
    swapResultClone[key] = BNCtor.isBN(value) ? new BNCtor(value) : value;
  }

  const { execute } = await sdk.cpmm.swap({
    poolInfo: bundle.poolInfo,
    poolKeys: bundle.poolKeys,
    inputAmount: new BNCtor(quote.amountInRaw),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    swapResult: swapResultClone as any,
    slippage: SLIPPAGE,
    baseIn: quote.baseIn,
    txVersion: TxVersion.V0,
  });

  const { txId } = await execute({ sendAndConfirm: true });
  return txId;
}

// "0.1" with 9 decimals -> BN(100000000). String math avoids float precision loss.
export async function toRawAmount(
  decimal: string,
  decimals: number
): Promise<BN> {
  const BNCtor = (await import("bn.js")).default;
  const [whole = "0", frac = ""] = decimal.trim().split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return new BNCtor((whole || "0") + fracPadded);
}

export function fromRawAmount(raw: string, decimals: number): string {
  if (decimals <= 0) return raw;
  const padded = raw.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const frac = padded.slice(-decimals).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

export function displaySymbol(mint: {
  symbol?: string;
  address: string;
}): string {
  return mint.symbol || `${mint.address.slice(0, 4)}…${mint.address.slice(-4)}`;
}
