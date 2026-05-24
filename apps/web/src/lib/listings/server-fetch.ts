import 'server-only';
import { cookies } from 'next/headers';
import { API_URL } from '../api';

/**
 * Forwards the incoming request's cookies to the v3 API so Better Auth can
 * resolve the session — and, downstream, the active organization. All listing
 * reads from server components go through this helper.
 */
async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const cookieHeader = (await cookies()).toString();
  return fetch(`${API_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      ...(init?.headers ?? {}),
      cookie: cookieHeader,
      ...(init?.body && !(init.body instanceof FormData)
        ? { 'content-type': 'application/json' }
        : {}),
    },
  });
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Reads from the v3 API and returns parsed JSON. Throws `ApiError` on any
 * non-2xx so callers can map specific statuses (e.g. 404 → notFound()).
 */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await authedFetch(path);
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return (await res.json()) as T;
}

/**
 * Mutates via the v3 API. Used from server actions so revalidation can run
 * in the same request. The body is serialised here so call sites stay clean.
 */
export async function apiMutate<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown,
): Promise<T | null> {
  const res = await authedFetch(path, {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = (await res.json()) as { message?: string };
      if (typeof data?.message === 'string') message = data.message;
    } catch {
      // body was not JSON
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return null;
  return (await res.json()) as T;
}
