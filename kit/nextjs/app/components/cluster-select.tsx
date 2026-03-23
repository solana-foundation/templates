"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useCluster, CLUSTERS } from "./cluster-context";

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
          style={{
            backgroundColor:
              cluster === "mainnet"
                ? "#22c55e"
                : cluster === "devnet"
                  ? "#3b82f6"
                  : cluster === "testnet"
                    ? "#eab308"
                    : "#a3a3a3",
          }}
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
                  if (c === "mainnet") {
                    toast.info("You'll need your own RPC for mainnet.", {
                      duration: 8000,
                      description: (
                        <span>
                          The public mainnet RPC rejects requests from browser
                          origins. Swap the URL in{" "}
                          <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
                            solana-client.ts
                          </code>{" "}
                          with a provider like{" "}
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
                  c === cluster ? "bg-cream" : ""
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      c === "mainnet"
                        ? "#22c55e"
                        : c === "devnet"
                          ? "#3b82f6"
                          : c === "testnet"
                            ? "#eab308"
                            : "#a3a3a3",
                  }}
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
