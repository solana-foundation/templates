"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  BASE_DECIMALS,
  DEFAULT_MARKET_INDEX,
  QUOTE_DECIMALS,
} from "@/lib/drift";
import type { DriftPositionView, DriftTransactionState } from "@/types/drift";

type DriftSdkModule = typeof import("@drift-labs/sdk");

type DriftClient = import("@drift-labs/sdk").DriftClient;

type UserAccount = import("@drift-labs/sdk").UserAccount;

type BN = import("@drift-labs/sdk").BN;

const DRIFT_ENV = "devnet";
const SUB_ACCOUNT_ID = 0;

export function useDrift() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [sdk, setSdk] = useState<DriftSdkModule | null>(null);
  const [driftClient, setDriftClient] = useState<DriftClient | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txState, setTxState] = useState<DriftTransactionState>({
    action: null,
    status: "idle",
  });

  useEffect(() => {
    let active = true;
    import("@drift-labs/sdk")
      .then((module) => {
        if (active) setSdk(module);
      })
      .catch((error) => {
        console.error("Failed to load Drift SDK", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!wallet || !sdk) {
      setDriftClient(null);
      setUserAccount(null);
      return;
    }

    let cancelled = false;
    const accountLoader = new sdk.BulkAccountLoader(
      connection,
      "confirmed",
      1000
    );
    const client = new sdk.DriftClient({
      connection,
      wallet,
      env: DRIFT_ENV,
      // Limit subscriptions to the market we trade in to avoid empty account slots.
      perpMarketIndexes: [DEFAULT_MARKET_INDEX],
      spotMarketIndexes: [0, 1],
      accountSubscription: {
        type: "polling",
        accountLoader,
      },
    });

    const subscribe = async () => {
      setIsLoading(true);
      try {
        // The Drift SDK subscribes to on-chain accounts and markets so we can read live state.
        await client.subscribe();
        if (cancelled) return;
        setDriftClient(client);

        try {
          setUserAccount(client.getUserAccount());
        } catch {
          setUserAccount(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    subscribe();

    return () => {
      cancelled = true;
      client.unsubscribe();
    };
  }, [connection, sdk, wallet]);

  const refreshUserAccount = useCallback(() => {
    if (!driftClient) return;
    try {
      setUserAccount(driftClient.getUserAccount());
    } catch {
      setUserAccount(null);
    }
  }, [driftClient]);

  const initializeUserAccount = useCallback(async () => {
    if (!driftClient || !wallet?.publicKey) {
      setTxState({
        action: "init",
        status: "error",
        error: "Connect a wallet before initializing a Drift account.",
      });
      return;
    }

    setTxState({ action: "init", status: "signing" });
    try {
      // Drift derives a user PDA from seeds ["user", authority, subAccountId].
      // initializeUserAccount handles the PDA derivation and account creation on-chain.
      const signature = await driftClient.initializeUserAccount(SUB_ACCOUNT_ID);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      setTxState({ action: "init", status: "pending", signature });

      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );
      setTxState({ action: "init", status: "confirmed", signature });
      refreshUserAccount();
    } catch (error) {
      setTxState({
        action: "init",
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize Drift account.",
      });
    }
  }, [connection, driftClient, refreshUserAccount, wallet?.publicKey]);

  const depositSolCollateral = useCallback(
    async (amount: string) => {
      if (!driftClient || !sdk || !wallet?.publicKey) {
        setTxState({
          action: "deposit",
          status: "error",
          error: "Connect a wallet before depositing collateral.",
        });
        return;
      }

      if (!userAccount) {
        setTxState({
          action: "deposit",
          status: "error",
          error: "Initialize your Drift account before depositing collateral.",
        });
        return;
      }

      const parsed = Number(amount);
      const lamports = Number.isFinite(parsed)
        ? Math.round(parsed * 1_000_000_000)
        : 0;
      const depositAmount = new sdk.BN(lamports);

      if (depositAmount.lte(new sdk.BN(0))) {
        setTxState({
          action: "deposit",
          status: "error",
          error: "Enter a SOL amount greater than 0.",
        });
        return;
      }

      setTxState({ action: "deposit", status: "signing" });
      try {
        const signature = await driftClient.deposit(
          depositAmount,
          1,
          wallet.publicKey,
          SUB_ACCOUNT_ID
        );
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        setTxState({ action: "deposit", status: "pending", signature });

        await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "confirmed"
        );
        setTxState({ action: "deposit", status: "confirmed", signature });
        refreshUserAccount();
      } catch (error) {
        setTxState({
          action: "deposit",
          status: "error",
          error:
            error instanceof Error
              ? error.message
              : "Failed to deposit collateral.",
        });
      }
    },
    [
      connection,
      driftClient,
      refreshUserAccount,
      sdk,
      userAccount,
      wallet?.publicKey,
    ]
  );

  const openPosition = useCallback(
    async (params: {
      direction: "long" | "short";
      marketIndex: number;
      baseAmount: string;
    }) => {
      if (!driftClient || !sdk || !wallet?.publicKey) {
        setTxState({
          action: "open",
          status: "error",
          error: "Connect a wallet before opening a position.",
        });
        return;
      }

      if (!userAccount) {
        setTxState({
          action: "open",
          status: "error",
          error: "Initialize your Drift account before opening a position.",
        });
        return;
      }

      try {
        const market = driftClient.getPerpMarketAccount(params.marketIndex);
        if (!market) {
          throw new Error("missing market account");
        }
        const spotMarket = driftClient.getSpotMarketAccount(0);
        if (!spotMarket) {
          throw new Error("missing spot market account");
        }
      } catch {
        setTxState({
          action: "open",
          status: "error",
          error: "Market data not loaded yet. Try again in a few seconds.",
        });
        return;
      }

      const basePrecision = sdk.BASE_PRECISION.toNumber();
      const parsed = Number(params.baseAmount);
      const baseAssetAmount = new sdk.BN(
        Number.isFinite(parsed) ? Math.round(parsed * basePrecision) : 0
      );
      if (baseAssetAmount.lte(new sdk.BN(0))) {
        setTxState({
          action: "open",
          status: "error",
          error: "Enter a base size greater than 0.",
        });
        return;
      }

      setTxState({ action: "open", status: "signing" });
      try {
        const signature = await driftClient.openPosition(
          params.direction === "long"
            ? sdk.PositionDirection.LONG
            : sdk.PositionDirection.SHORT,
          baseAssetAmount,
          params.marketIndex
        );

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        setTxState({ action: "open", status: "pending", signature });

        // Confirm the transaction so the UI can report final status to the user.
        await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "confirmed"
        );
        setTxState({ action: "open", status: "confirmed", signature });
        refreshUserAccount();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to open position.";
        const isCollateralError =
          message.includes("InsufficientCollateral") ||
          message.includes("Insufficient collateral") ||
          message.includes("0x1773");
        setTxState({
          action: "open",
          status: "error",
          error: isCollateralError
            ? "Insufficient collateral. Deposit SOL before trading."
            : message,
        });
      }
    },
    [
      connection,
      driftClient,
      refreshUserAccount,
      sdk,
      userAccount,
      wallet?.publicKey,
    ]
  );

  const positionView = useMemo<DriftPositionView | null>(() => {
    if (!sdk || !userAccount) return null;

    const position = userAccount.perpPositions.find(
      (perpPosition) => perpPosition.marketIndex === DEFAULT_MARKET_INDEX
    );
    if (!position) return null;

    const baseAssetAmount = (position.baseAssetAmount ?? new sdk.BN(0)) as BN;
    const quoteAssetAmount = (position.quoteAssetAmount ?? new sdk.BN(0)) as BN;
    const direction = baseAssetAmount.gt(new sdk.BN(0))
      ? "long"
      : baseAssetAmount.lt(new sdk.BN(0))
        ? "short"
        : "flat";

    return {
      marketIndex: DEFAULT_MARKET_INDEX,
      baseAssetAmount: (
        Number(baseAssetAmount.toString()) /
        10 ** BASE_DECIMALS
      ).toFixed(6),
      quoteAssetAmount: (
        Number(quoteAssetAmount.abs().toString()) /
        10 ** QUOTE_DECIMALS
      ).toFixed(2),
      direction,
    };
  }, [sdk, userAccount]);

  return {
    wallet,
    driftClient,
    userAccount,
    positionView,
    isInitialized: Boolean(userAccount),
    isLoading,
    txState,
    refreshUserAccount,
    initializeUserAccount,
    depositSolCollateral,
    openPosition,
  };
}
