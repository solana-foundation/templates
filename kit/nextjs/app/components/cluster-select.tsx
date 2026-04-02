"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useCluster } from "@solana/connector";

const CLUSTER_COLORS: Record<string, string> = {
  "solana:mainnet": "#22c55e",
  "solana:devnet": "#3b82f6",
  "solana:testnet": "#eab308",
};

export function ClusterSelect() {
  const { cluster, clusters, setCluster } = useCluster();
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
          style={{
            backgroundColor: CLUSTER_COLORS[cluster?.id ?? ""] ?? "#a3a3a3",
          }}
        />
        {cluster?.label ?? "Select network"}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-border-low bg-card p-2 shadow-lg">
          <div className="space-y-1">
            {clusters.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCluster(c.id);
                  setIsOpen(false);
                  if (c.id === "solana:mainnet") {
                    toast.info("You'll need your own RPC for mainnet.", {
                      duration: 8000,
                      description: (
                        <span>
                          The public mainnet RPC rejects requests from browser
                          origins. Use a provider like{" "}
                          <a
                            href="https://www.helius.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Helius
                          </a>
                          {" or "}
                          <a
                            href="https://triton.one/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Triton
                          </a>
                          .
                        </span>
                      ),
                    });
                  }
                }}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition hover:bg-cream ${
                  c.id === cluster?.id ? "bg-cream" : ""
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: CLUSTER_COLORS[c.id] ?? "#a3a3a3",
                  }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
