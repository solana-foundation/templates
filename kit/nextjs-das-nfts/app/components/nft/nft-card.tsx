"use client";

import { useState } from "react";
import Image from "next/image";
import { useCluster } from "../cluster-context";
import { ellipsify } from "../../lib/explorer";
import { resolveNftImageUrl } from "../../lib/nft-image";
import type { DasApiAsset } from "../../lib/das";

/**
 * Off-chain metadata is arbitrary JSON, so the image can arrive in any of three places.
 * `content.links.image` is the indexer's own resolution and is preferred when present.
 */
function getImageUri(asset: DasApiAsset): string | null {
  const files = asset.content?.files ?? [];
  const image = asset.content?.links?.image;
  return (
    (typeof image === "string" ? image : null) ??
    files.find((file) => file.mime?.startsWith("image/"))?.uri ??
    files[0]?.uri ??
    null
  );
}

function getCollectionName(asset: DasApiAsset): string | null {
  const group = asset.grouping?.find((g) => g.group_key === "collection");
  if (!group) return null;
  const name = group.collection_metadata?.name;
  return typeof name === "string" && name.length > 0
    ? name
    : (group.group_value ?? null);
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
      {children}
    </span>
  );
}

export function NftCard({ asset }: { asset: DasApiAsset }) {
  const { getExplorerUrl } = useCluster();
  const [imageFailed, setImageFailed] = useState(false);
  const imageUri = getImageUri(asset);
  const imageUrl = imageFailed ? null : resolveNftImageUrl(imageUri);
  const name = asset.content?.metadata?.name ?? ellipsify(asset.id);
  const collection = getCollectionName(asset);

  return (
    <a
      href={getExplorerUrl(`/address/${asset.id}`)}
      target="_blank"
      rel="noopener noreferrer"
      className="group overflow-hidden rounded-2xl border border-border-low bg-card transition hover:border-border"
    >
      <div className="relative aspect-square w-full bg-accent">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition group-hover:scale-[1.02]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-muted">
            {imageUri ? "Image unavailable" : "No image"}
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="truncate text-sm font-semibold">{name}</p>
        {collection && (
          <p className="truncate text-xs text-muted">{collection}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          <Badge>{asset.interface}</Badge>
          {asset.compression?.compressed && <Badge>compressed</Badge>}
          {asset.ownership?.frozen && <Badge>frozen</Badge>}
        </div>
      </div>
    </a>
  );
}
