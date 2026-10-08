import { describe, expect, test } from "vitest";
import { formatAmount, getAmountError, parseAmount } from "../app/lib/amount";

describe("parseAmount", () => {
  test("converts decimal strings to base units", () => {
    expect(parseAmount("1", 9)).toBe(1_000_000_000n);
    expect(parseAmount("0.5", 9)).toBe(500_000_000n);
    expect(parseAmount(" 0.000000001 ", 9)).toBe(1n);
    expect(parseAmount("12.34", 2)).toBe(1234n);
  });

  test("rejects invalid, zero, over-precise, and overflowing amounts", () => {
    expect(() => parseAmount("abc", 9)).toThrow();
    expect(() => parseAmount("-1", 9)).toThrow();
    expect(() => parseAmount("0", 9)).toThrow("greater than zero");
    expect(() => parseAmount("1.001", 2)).toThrow("2 decimal places");
    expect(() => parseAmount("18446744073709551616", 0)).toThrow("too large");
    expect(getAmountError("1", 9)).toBeNull();
    expect(getAmountError("", 9)).not.toBeNull();
  });
});

describe("formatAmount", () => {
  test("formats base units without trailing zeros", () => {
    expect(formatAmount(1_500_000_000n, 9)).toBe("1.5");
    expect(formatAmount(1n, 9)).toBe("0.000000001");
    expect(formatAmount(1_234_000_000_000n, 9)).toBe("1,234");
    expect(formatAmount(0n, 9)).toBe("0");
  });
});
