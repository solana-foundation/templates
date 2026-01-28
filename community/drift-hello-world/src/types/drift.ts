import type { PerpPosition, UserAccount } from "@drift-labs/sdk";

export type DriftUserAccountResponse = UserAccount;
export type DriftPerpPositionResponse = PerpPosition;

export type DriftTxStatus =
  | "idle"
  | "signing"
  | "pending"
  | "confirmed"
  | "error";
export type DriftTxAction = "init" | "open" | "deposit";

export interface DriftTransactionState {
  action: DriftTxAction | null;
  status: DriftTxStatus;
  signature?: string;
  error?: string;
}

export interface DriftPositionView {
  marketIndex: number;
  baseAssetAmount: string;
  quoteAssetAmount: string;
  direction: "long" | "short" | "flat";
}
