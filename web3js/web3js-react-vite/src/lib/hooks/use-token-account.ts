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
  error: unknown;
};

export function useTokenAccount(mint: PublicKey | null, owner: PublicKey) {
  const { connection } = useConnection();
  const [state, setState] = useState<TokenAccountState>({
    key: "",
    data: null,
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

      setState({
        key,
        data: {
          supply: mintInfo ? getMintDecoder().decode(mintInfo.data).supply : 0n,
          balance: tokenInfo
            ? getTokenDecoder().decode(tokenInfo.data).amount
            : 0n,
        },
        error: null,
      });
    })().catch((error: unknown) => {
      console.error(error);
      if (active) setState({ key, data: null, error });
    });

    return () => {
      active = false;
    };
  }, [connection, mint, owner, key, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const current = state.key === key ? state : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    refresh,
  };
}
