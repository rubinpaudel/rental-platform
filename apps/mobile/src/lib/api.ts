/**
 * Base URL of the identity API (NestJS, v1). Better Auth is mounted there at
 * `/api/auth/*`; the React client appends that path itself.
 *
 * On a physical device, `localhost` resolves to the device — set this to your
 * dev machine's LAN IP (e.g. `http://192.168.1.42:4000`) in `.env.local`.
 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
