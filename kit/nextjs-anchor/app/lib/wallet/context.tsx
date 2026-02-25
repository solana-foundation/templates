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

  const [connectors, setConnectors] = useState<WalletConnector[]>([]);
  const [session, setSession] = useState<WalletSession | undefined>();
  const [status, setStatus] = useState<WalletStatus>("disconnected");
  const [error, setError] = useState<unknown>();
  const [isReady, setIsReady] = useState(false);

  const connectorsRef = useRef<WalletConnector[]>([]);
  const autoConnectAttempted = useRef(false);

  useEffect(() => {
    setIsReady(true);

    const initial = discoverWallets();
    connectorsRef.current = initial;
    setConnectors(initial);

    const unsubscribe = watchWallets((updated) => {
      connectorsRef.current = updated;
      setConnectors(updated);
    });

    const lastId = localStorage.getItem(STORAGE_KEY);
    if (lastId && !autoConnectAttempted.current) {
      autoConnectAttempted.current = true;
      const connector = initial.find((c) => c.id === lastId);
      if (connector) {
        setStatus("connecting");
        connector.connect({ silent: true }).then(
          (s) => {
            setSession(s);
            setStatus("connected");
          },
          () => {
            setStatus("disconnected");
            localStorage.removeItem(STORAGE_KEY);
          }
        );
      }
    }

    return unsubscribe;
  }, []);

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
