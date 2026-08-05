"use client";

import { useCluster } from "../cluster-context";
import { ellipsify } from "../../lib/explorer";
import type { DasApiAsset } from "../../lib/das";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

/**
 * Off-chain metadata is arbitrary JSON, so the image can arrive in any of three places.
 * `content.links.image` is the indexer's own resolution and is preferred when present.
 */
function getImageUrl(asset: DasApiAsset): string | null {
  const files = asset.content?.files ?? [];
  const image = asset.content?.links?.image;
  const uri =
    (typeof image === "string" ? image : null) ??
    files.find((file) => file.mime?.startsWith("image/"))?.uri ??
    files[0]?.uri;

  if (uri == null) return null;
  if (uri.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY}${uri.slice("ipfs://".length)}`;
  }
  return uri;
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
  const imageUrl = getImageUrl(asset);
  const name = asset.content?.metadata?.name ?? ellipsify(asset.id);
  const collection = getCollectionName(asset);

  return (
    <a
      href={getExplorerUrl(`/address/${asset.id}`)}
      target="_blank"
      rel="noopener noreferrer"
      className="group overflow-hidden rounded-2xl border border-border-low bg-card transition hover:border-border"
    >
      <div className="aspect-square w-full bg-accent">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted">
            No image
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
