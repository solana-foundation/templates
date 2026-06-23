"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { address, type Address } from "@solana/kit";
import { MERCHANT_ADDRESS } from "../subscriptions/constants";

const STORAGE_KEY = "subscriptions-merchant";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

const getSnapshot = () => localStorage.getItem(STORAGE_KEY);
const getServerSnapshot = () => null;

export function useMerchant() {
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const merchant = useMemo<Address | null>(() => {
    if (MERCHANT_ADDRESS) return MERCHANT_ADDRESS;

    if (stored) {
      try {
        return address(stored);
      } catch {
        // ignore malformed stored value
      }
    }
    return MERCHANT_ADDRESS;
  }, [stored]);

  const setMerchant = useCallback((next: Address) => {
    localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((l) => l());
  }, []);

  return { merchant, setMerchant };
}
