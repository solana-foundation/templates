import { RAMPS_SDK_SCRIPT } from "./config";
import type { CreateRamps } from "./types";

let sdkPromise: Promise<CreateRamps> | null = null;

/** Injects the Ramps SDK script once and resolves with `createRamps`. */
export function loadRampsSdk(): Promise<CreateRamps> {
  if (window.RampsSDK) return Promise.resolve(window.RampsSDK.createRamps);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<CreateRamps>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAMPS_SDK_SCRIPT;
    script.async = true;
    script.onload = () => {
      if (window.RampsSDK) resolve(window.RampsSDK.createRamps);
      else reject(new Error("Ramps SDK loaded but window.RampsSDK is missing"));
    };
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("Failed to load the MoneyGram Ramps SDK"));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}
