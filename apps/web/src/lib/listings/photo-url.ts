/**
 * Resolves a public URL for a photo's storage key. The v3 listing API only
 * returns the storageKey; constructing the URL is a frontend concern because
 * the bucket layout (path-style local MinIO vs. virtual-hosted prod CDN) is
 * deployment-specific.
 *
 * `NEXT_PUBLIC_S3_PUBLIC_BASE` is the canonical base URL of the public photo
 * bucket — e.g. `http://localhost:9000/rental-platform-local` for the local
 * MinIO stack, or `https://cdn.plekje.be` once we front the bucket with a
 * CDN. When unset (or when the key is empty), `null` lets the caller render
 * a placeholder.
 */
export function photoUrl(storageKey: string): string | null {
  const base = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE;
  if (!base || !storageKey) return null;
  return `${base.replace(/\/$/, '')}/${storageKey}`;
}
