import { describe, expect, it } from "vitest";
import { ellipsify, getExplorerUrl } from "./explorer";

describe("getExplorerUrl", () => {
  it("omits the cluster param on mainnet", () => {
    expect(getExplorerUrl("/tx/abc", "mainnet")).toBe(
      "https://explorer.solana.com/tx/abc"
    );
  });

  it("adds the cluster param on devnet and testnet", () => {
    expect(getExplorerUrl("/address/abc", "devnet")).toBe(
      "https://explorer.solana.com/address/abc?cluster=devnet"
    );
    expect(getExplorerUrl("/address/abc", "testnet")).toBe(
      "https://explorer.solana.com/address/abc?cluster=testnet"
    );
  });

  it("points localnet at a custom RPC URL", () => {
    const url = new URL(getExplorerUrl("/tx/abc", "localnet"));
    expect(url.searchParams.get("cluster")).toBe("custom");
    expect(url.searchParams.get("customUrl")).toBe("http://localhost:8899");
  });
});

describe("ellipsify", () => {
  it("shortens long strings and leaves short ones alone", () => {
    expect(ellipsify("11111111111111111111111111111111")).toBe("1111...1111");
    expect(ellipsify("short")).toBe("short");
  });
});
