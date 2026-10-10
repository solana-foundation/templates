"use client";

import { useState, useRef, useEffect } from "react";
import { useCluster, CLUSTERS } from "./cluster-context";
import type { ClusterMoniker } from "../lib/solana-client";

const CLUSTER_COLORS: Record<ClusterMoniker, string> = {
  mainnet: "#22c55e",
  devnet: "#3b82f6",
  testnet: "#eab308",
  localnet: "#a3a3a3",
};

export function ClusterSelect() {
  const { cluster, setCluster } = useCluster();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "cluster-options" : undefined}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium transition hover:bg-cream"
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: CLUSTER_COLORS[cluster] }}
        />
        {cluster}
      </button>

      {isOpen && (
        <div
          id="cluster-options"
          className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-border-low bg-card p-2 shadow-lg"
        >
          <div className="space-y-1">
            {CLUSTERS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCluster(c);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-pressed={c === cluster}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition hover:bg-cream ${
                  c === cluster ? "bg-cream" : ""
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: CLUSTER_COLORS[c] }}
                />
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
