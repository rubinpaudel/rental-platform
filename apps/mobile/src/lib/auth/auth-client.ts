import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { organizationClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../api';

/**
 * Single source of truth for auth state in the mobile app. The Expo plugin
 * wires Better Auth's session storage to `expo-secure-store` (Keychain on
 * iOS, EncryptedSharedPreferences on Android) and handles deep-link
 * callbacks back into the app — we never roll our own token storage or
 * refresh logic.
 *
 * `scheme` MUST match `expo.scheme` in app.json so callback URLs the API
 * generates (e.g. for email verification) round-trip back into the app.
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: 'plekje',
      storagePrefix: 'plekje',
      storage: SecureStore,
    }),
    organizationClient(),
  ],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  getCookie,
} = authClient;
