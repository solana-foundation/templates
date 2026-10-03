export declare class Surfnet {
  static start(): Promise<Surfnet>;
  static newKeypair(): Promise<{ publicKey: string; address: string }>;
  readonly rpcUrl: string;
  readonly wsUrl: string;
  fundSol(owner: string, amount: number | bigint): Promise<void>;
  getAta(owner: string, mint: string): Promise<string>;
  stop(): void;
}
