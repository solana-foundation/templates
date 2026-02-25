"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type PropsWithChildren,
} from "react";
import type { TransactionSigner } from "@solana/kit";
import type { WalletConnector, WalletSession } from "./types";
import { discoverWallets, watchWallets } from "./standard";
import { createWalletSigner } from "./signer";
import { useCluster } from "../../components/cluster-context";

type WalletStatus = "disconnected" | "connecting" | "connected" | "error";

type WalletContextValue = {
  connectors: WalletConnector[];
  status: WalletStatus;
  wallet: WalletSession | undefined;
  signer: TransactionSigner | undefined;
  error: unknown;
  connect: (connectorId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isReady: boolean;
};

const WalletContext = createContext<WalletContextValue | null>(null);

const STORAGE_KEY = "solana:last-connector";

export function WalletProvider({ children }: PropsWithChildren) {
  const { cluster } = useCluster();
  const chain = `solana:${cluster}`;

  const [connectors, setConnectors] = useState<WalletConnector[]>(() =>
    typeof window === "undefined" ? [] : discoverWallets()
  );
  const [session, setSession] = useState<WalletSession | undefined>();
  const [status, setStatus] = useState<WalletStatus>("disconnected");
  const [error, setError] = useState<unknown>();
  const isReady = typeof window !== "undefined";

  const connectorsRef = useRef<WalletConnector[]>(connectors);
  const autoConnectAttempted = useRef(false);

  const handleWalletsChanged = useCallback((updated: WalletConnector[]) => {
    connectorsRef.current = updated;
    setConnectors(updated);
  }, []);

  const runAutoConnect = useCallback(async (connector: WalletConnector) => {
    setStatus("connecting");
    try {
      const s = await connector.connect({ silent: true });
      setSession(s);
      setStatus("connected");
    } catch {
      setStatus("disconnected");
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = watchWallets(handleWalletsChanged);

    const lastId = localStorage.getItem(STORAGE_KEY);
    if (lastId && !autoConnectAttempted.current) {
      autoConnectAttempted.current = true;
      const connector = connectorsRef.current.find((c) => c.id === lastId);
      if (connector) {
        void runAutoConnect(connector);
      }
    }

    return unsubscribe;
  }, [handleWalletsChanged, runAutoConnect]);

  const connect = useCallback(async (connectorId: string) => {
    const connector = connectorsRef.current.find((c) => c.id === connectorId);
    if (!connector) throw new Error(`Unknown connector: ${connectorId}`);

    setStatus("connecting");
    setError(undefined);

    try {
      const s = await connector.connect();
      setSession(s);
      setStatus("connected");
      localStorage.setItem(STORAGE_KEY, connectorId);
    } catch (err) {
      setError(err);
      setStatus("error");
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (session) {
      try {
        await session.disconnect();
      } catch {
        /* ignore disconnect errors */
      }
    }
    setSession(undefined);
    setStatus("disconnected");
    setError(undefined);
    localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  const signer = useMemo(
    () => (session ? createWalletSigner(session, chain) : undefined),
    [session, chain]
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      connectors,
      status,
      wallet: session,
      signer,
      error,
      connect,
      disconnect,
      isReady,
    }),
    [connectors, status, session, signer, error, connect, disconnect, isReady]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
