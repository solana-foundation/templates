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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-low bg-card px-3 py-2 text-xs font-medium transition hover:bg-cream"
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: CLUSTER_COLORS[cluster] }}
        />
        {cluster}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-border-low bg-card p-2 shadow-lg">
          <div className="space-y-1">
            {CLUSTERS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCluster(c);
                  setIsOpen(false);
                }}
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
