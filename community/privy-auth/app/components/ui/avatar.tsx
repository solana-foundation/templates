"use client";

import React from "react";

import { PublicKey } from "@solana/web3.js";
import { minidenticon } from "minidenticons";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarProps = {
  address: PublicKey | string | null;
  size?: number;
  className?: string;
  alt?: string;
};

const Avatar = ({ address, size = 55, className, alt }: AvatarProps) => {
  const pubkeyStr = React.useMemo(() => {
    if (!address) return "";
    if (typeof address === "string") return address;
    return address.toBase58();
  }, [address]);

  const identicon = React.useMemo(() => {
    if (!pubkeyStr) return "";
    return (
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(pubkeyStr, 90, 50))
    );
  }, [pubkeyStr]);

  if (!address || !pubkeyStr) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-muted text-muted-foreground",
          className
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-xs font-medium">?</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-foreground/4 p-1 text-muted-foreground",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={identicon}
        alt={alt || pubkeyStr || ""}
        width={size}
        height={size}
      />
    </div>
  );
};

export { Avatar };
