import 'server-only';
import { cookies } from 'next/headers';
import { API_URL } from '../api';

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const cookieHeader = (await cookies()).toString();
  const headers = new Headers(init?.headers);
  headers.set('cookie', cookieHeader);
  if (init?.body !== undefined) headers.set('content-type', 'application/json');
  return fetch(`${API_URL}${path}`, { ...init, cache: 'no-store', headers });
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

async function readErrorMessage(res: Response): Promise<string> {
  const raw = await res.text();
  if (!raw) return res.statusText;
  try {
    const data = JSON.parse(raw) as { message?: unknown };
    if (typeof data?.message === 'string') return data.message;
  } catch {
    // not JSON — fall through to raw body
  }
  return raw;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await authedFetch(path);
  if (!res.ok) throw new ApiError(res.status, await readErrorMessage(res));
  return (await res.json()) as T;
}

export async function apiMutate<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown,
): Promise<T | null> {
  const res = await authedFetch(path, {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new ApiError(res.status, await readErrorMessage(res));
  if (res.status === 204) return null;
  return (await res.json()) as T;
}
