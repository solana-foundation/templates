import { createContext, useContext } from "react";
import type { ClusterMoniker } from "./cluster";

export type ClusterContextValue = {
  cluster: ClusterMoniker;
  setCluster: (cluster: ClusterMoniker) => void;
};

export const ClusterContext = createContext<ClusterContextValue | null>(null);

export function useCluster(): ClusterContextValue {
  const context = useContext(ClusterContext);
  if (!context) throw new Error("useCluster must be used within Providers");
  return context;
}
