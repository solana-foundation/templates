"use client";

import useSWR from "swr";

type SessionResponse = { address: string | null };

async function fetchSession(url: string): Promise<SessionResponse> {
  const res = await fetch(url);
  return (await res.json()) as SessionResponse;
}

export function useSession() {
  const { data, isLoading, mutate } = useSWR<SessionResponse>(
    "/api/session",
    fetchSession
  );

  async function signOut() {
    await fetch("/api/session", { method: "DELETE" });
    await mutate({ address: null });
  }

  return {
    address: data?.address ?? null,
    isLoading,
    refresh: () => mutate(),
    signOut,
  };
}
