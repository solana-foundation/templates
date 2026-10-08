import { describe, expect, it } from "vitest";
import { parseTransactionError } from "./errors";

describe("parseTransactionError", () => {
  it("detects wallet rejections anywhere in the cause chain", () => {
    const error = new Error("Wallet transaction submission failed.", {
      cause: new Error("User rejected the request."),
    });
    expect(parseTransactionError(error)).toBe(
      "Transaction was rejected by the wallet."
    );
  });

  it("maps insufficient-funds program logs to a friendly message", () => {
    const error = new Error(
      'Simulation failed. Logs: ["Transfer: insufficient lamports 5000, need 10000000"]'
    );
    expect(parseTransactionError(error)).toMatch(/^Insufficient balance/);
  });

  it("returns the deepest cause message, truncated", () => {
    const error = new Error("outer", { cause: new Error("x".repeat(300)) });
    expect(parseTransactionError(error)).toBe(`${"x".repeat(200)}...`);
  });

  it("stringifies non-Error values", () => {
    expect(parseTransactionError("boom")).toBe("boom");
  });
});
