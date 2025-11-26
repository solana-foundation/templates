import { SessionClaims } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatAddress = (address?: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

export const formatTimestamp = (value?: number) => {
  if (!value) return "—";
  return new Date(value * 1000).toLocaleString();
};

export const decodeToken = (token: string): SessionClaims | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch (error) {
    console.warn("Unable to decode session token", error);
    return null;
  }
};