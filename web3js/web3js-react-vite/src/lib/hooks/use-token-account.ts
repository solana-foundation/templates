import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter";
import { PublicKey } from "@solana/web3.js";
import {
  findAssociatedTokenPda,
  getMintDecoder,
  getTokenDecoder,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

export type TokenAccountData = {
  supply: bigint;
  balance: bigint;
};

type TokenAccountState = {
  key: string;
  data: TokenAccountData | null;
  missing: boolean;
  error: unknown;
};

export function useTokenAccount(mint: PublicKey | null, owner: PublicKey) {
  const { connection } = useConnection();
  const [state, setState] = useState<TokenAccountState>({
    key: "",
    data: null,
    missing: false,
    error: null,
  });
  const [version, setVersion] = useState(0);
  const key = mint ? `${mint.toBase58()}:${owner.toBase58()}` : "";

  useEffect(() => {
    if (!mint) return;
    let active = true;

    (async () => {
      const [ata] = await findAssociatedTokenPda({
        mint: mint.toBase58(),
        owner: owner.toBase58(),
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      });
      const [mintInfo, tokenInfo] = await Promise.all([
        connection.getAccountInfo(mint, "confirmed"),
        connection.getAccountInfo(new PublicKey(ata), "confirmed"),
      ]);
      if (!active) return;
      if (!mintInfo) {
        setState({ key, data: null, missing: true, error: null });
        return;
      }

      setState({
        key,
        data: {
          supply: getMintDecoder().decode(mintInfo.data).supply,
          balance: tokenInfo
            ? getTokenDecoder().decode(tokenInfo.data).amount
            : 0n,
        },
        missing: false,
        error: null,
      });
    })().catch((error: unknown) => {
      console.error(error);
      if (active) setState({ key, data: null, missing: false, error });
    });

    return () => {
      active = false;
    };
  }, [connection, mint, owner, key, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const current = state.key === key ? state : null;
  return {
    data: current?.data ?? null,
    missing: current?.missing ?? false,
    error: current?.error ?? null,
    refresh,
  };
}
