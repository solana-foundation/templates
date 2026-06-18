"use client";

import { useEffect, useState } from "react";

// Current Unix time (seconds) that re-renders on an interval, so time-based
// UI (e.g. a subscription flipping to "Ended") updates without a manual action.
export function useNow(intervalMs = 60_000): bigint {
  const [now, setNow] = useState(() => BigInt(Math.floor(Date.now() / 1000)));

  useEffect(() => {
    const id = setInterval(
      () => setNow(BigInt(Math.floor(Date.now() / 1000))),
      intervalMs
    );
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
