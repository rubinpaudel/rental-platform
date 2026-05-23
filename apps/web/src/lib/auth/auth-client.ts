'use client';

import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';
import { API_URL } from '../api';

/**
 * The single source of truth for auth state in the web app. All session
 * reads and auth mutations go through this client (Better Auth React) — we
 * never hand-roll session logic or fetch the auth endpoints directly.
 *
 * `credentials: 'include'` is required because the web app (:3000) and the
 * API (:4000) are different origins in dev; the session cookie must ride
 * cross-origin requests.
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [organizationClient()],
  fetchOptions: {
    credentials: 'include',
  },
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  useActiveOrganization,
  useListOrganizations,
  organization,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} = authClient;
