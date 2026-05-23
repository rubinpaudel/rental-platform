/**
 * Base URL of the identity API (NestJS, v1). Better Auth is mounted there at
 * `/api/auth/*`; the React client appends that path itself.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
