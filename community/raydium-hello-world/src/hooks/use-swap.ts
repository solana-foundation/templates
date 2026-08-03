"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { getExplorerUrl } from "@/lib/explorer";
import {
  computeQuote,
  executeSwap,
  toRawAmount,
  INPUT_MINT,
  type PoolBundle,
  type QuoteResult,
} from "@/lib/raydium";

export type SwapStatus =
  | { state: "idle" }
  | { state: "swapping" }
  | { state: "confirmed"; txId: string }
  | { state: "error"; message: string };

type QuoteState = {
  // The exact input string this quote was computed for. A quote is only
  // visible (and executable) while it matches the current input — otherwise
  // a stale quote could stay on screen during recomputation and execute a
  // different amount than the one displayed.
  forAmount: string;
  result: QuoteResult | null;
  error: string | null;
};

export function useSwap(
  bundle: PoolBundle | null,
  amountIn: string,
  onConfirmed?: () => void
) {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();

  const [quoteState, setQuoteState] = useState<QuoteState | null>(null);
  const [status, setStatus] = useState<SwapStatus>({ state: "idle" });

  const inputDecimals = bundle
    ? INPUT_MINT === bundle.poolInfo.mintA.address
      ? bundle.poolInfo.mintA.decimals
      : bundle.poolInfo.mintB.decimals
    : 9;

  const amount = Number(amountIn);
  const hasValidInput =
    !!bundle && !!amountIn && Number.isFinite(amount) && amount > 0;

  useEffect(() => {
    if (!hasValidInput) return;
    let cancelled = false;

    // `cancelled` ignores results that finish after the input has already
    // changed — fast typing means racing computations, and without this
    // guard a slower, stale quote could overwrite the current one.
    const computeAndSetQuote = async () => {
      try {
        const raw = await toRawAmount(amountIn, inputDecimals);
        if (raw.isZero()) {
          if (!cancelled) {
            setQuoteState({ forAmount: amountIn, result: null, error: null });
          }
          return;
        }
        const result = await computeQuote(bundle, raw);
        if (!cancelled) {
          setQuoteState({ forAmount: amountIn, result, error: null });
        }
      } catch (e) {
        if (!cancelled) {
          setQuoteState({
            forAmount: amountIn,
            result: null,
            error: e instanceof Error ? e.message : String(e),
          });
        }
      }
    };

    void computeAndSetQuote();

    return () => {
      cancelled = true;
    };
  }, [hasValidInput, bundle, amountIn, inputDecimals]);

  const isCurrent = hasValidInput && quoteState?.forAmount === amountIn;
  const quote = isCurrent ? quoteState.result : null;
  const quoteError = isCurrent ? quoteState.error : null;

  const swap = useCallback(async () => {
    if (!bundle || !quote || !publicKey || !signAllTransactions) return;
    if (status.state === "swapping") return;
    setStatus({ state: "swapping" });
    try {
      // Execute with the quote's own raw amount — quote and amount are an
      // atomic pair. Using the live input here could pair a new amount with
      // a stale quote (wrong wrap amount, wrong min-out).
      const txId = await executeSwap(
        connection,
        publicKey,
        signAllTransactions,
        bundle,
        quote
      );
      setStatus({ state: "confirmed", txId });
      toast.success("Transaction confirmed", {
        action: {
          label: "View",
          onClick: () => window.open(getExplorerUrl(txId), "_blank"),
        },
      });
      onConfirmed?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setStatus({ state: "error", message });
      toast.error(message);
    }
  }, [
    bundle,
    quote,
    publicKey,
    signAllTransactions,
    connection,
    status.state,
    onConfirmed,
  ]);

  return { quote, quoteError, status, swap };
}
