import { ClientProvider } from "@solana/react";
import { PropsWithChildren } from "react";
import { client } from "./solana-client";

export function Providers({ children }: PropsWithChildren) {
  return <ClientProvider client={client}>{children}</ClientProvider>;
}
