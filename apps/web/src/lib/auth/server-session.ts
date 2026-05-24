import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { API_URL } from '../api';

export interface ServerSession {
  user: { id: string; name: string; email: string; emailVerified: boolean };
}

/**
 * Authoritative, server-side session resolution for protected pages. Runs on
 * the request's cookies via Better Auth's `get-session` endpoint so the
 * dashboard never flashes a logged-out state on refresh. Returns null when
 * there is no valid session.
 *
 * Wrapped in React.cache so the layout (auth gate) and any RSC that needs
 * the session share a single fetch per request.
 */
export const getServerSession = cache(async (): Promise<ServerSession | null> => {
  const cookieHeader = (await cookies()).toString();
  if (!cookieHeader) return null;

  const res = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = (await res.json()) as ServerSession | null;
  return data?.user ? data : null;
});
