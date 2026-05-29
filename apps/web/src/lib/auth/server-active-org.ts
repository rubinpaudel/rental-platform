import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { API_URL } from '../api';
import { isOrgKind, type OrgKind } from '../org-kind';

export interface ActiveOrg {
  id: string;
  name: string;
  kind: OrgKind;
}

/**
 * Resolves the active organization (id, name, kind) on the server so RSCs
 * can branch copy/navigation on `kind` without waiting for the client-side
 * Better Auth hook to hydrate. Better Auth's organization plugin exposes
 * the full record at `/api/auth/organization/get-full-organization`.
 *
 * Wrapped in React.cache so layout + page in the same request share a
 * single fetch — listings/new/detail all call this through the layout.
 * Returns null when nothing is active (shouldn't happen for a signed-in
 * landlord, but handle defensively).
 */
export const getActiveOrg = cache(async (): Promise<ActiveOrg | null> => {
  const cookieHeader = (await cookies()).toString();
  if (!cookieHeader) return null;

  const res = await fetch(`${API_URL}/api/auth/organization/get-full-organization`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok) return null;

  const data = (await res.json()) as
    | { id: string; name: string; kind?: unknown }
    | null;
  if (!data?.id) return null;

  const kind: OrgKind = isOrgKind(data.kind) ? data.kind : 'private';
  return { id: data.id, name: data.name, kind };
});
