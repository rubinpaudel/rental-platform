import type {
  ProfileDto,
  ProfilePatch,
} from '@rental-platform/profile-schema';
import { API_URL } from '../api';
import { authClient } from '../auth/auth-client';

// Thin wire layer around `/me/profile`. Uses Better Auth's stored cookie
// (the Expo plugin keeps it in expo-secure-store) so the same session
// that powers `useSession()` authorises these calls. The server is the
// single source of truth for profile state — every wizard step PATCHes
// and consumes the fresh DTO that comes back (including the recomputed
// completeness score), so the UI never recomputes locally.

export class ProfileApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
    /**
     * Friendly Dutch message extracted from the API error payload when
     * available; falls back to a generic copy. UI alerts read this.
     */
    readonly friendly: string,
  ) {
    super(`profile api ${status}: ${body || friendly}`);
    this.name = 'ProfileApiError';
  }
}

async function authedFetch(
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  const cookie = authClient.getCookie();
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body !== undefined) headers.set('Content-Type', 'application/json');
  if (cookie) headers.set('Cookie', cookie);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ProfileApiError(res.status, body, extractFriendlyMessage(body));
  }
  return res.json();
}

function extractFriendlyMessage(body: string): string {
  // Nest's BadRequestException returns `{ message, error, statusCode }`;
  // domain VO errors land in `message` as a sentence already tuned for
  // an end user (e.g. "Invalid Belgian phone number: 04xx").
  try {
    const parsed = JSON.parse(body) as { message?: string | string[] };
    if (typeof parsed.message === 'string') return parsed.message;
    if (Array.isArray(parsed.message) && parsed.message[0]) {
      return String(parsed.message[0]);
    }
  } catch {
    // not JSON — fall through
  }
  return 'Er ging iets mis. Probeer het opnieuw.';
}

export async function fetchProfile(): Promise<ProfileDto> {
  return (await authedFetch('/me/profile')) as ProfileDto;
}

export async function patchProfile(patch: ProfilePatch): Promise<ProfileDto> {
  return (await authedFetch('/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })) as ProfileDto;
}
