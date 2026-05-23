/**
 * Better Auth's `additionalFields` show up on the user object at runtime
 * but aren't in the inferred React client type — narrow once here so route
 * gates can branch on role without `any`.
 */
export const USER_ROLES = ['tenant', 'landlord'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function userRoleOf(user: unknown): UserRole | null {
  if (typeof user !== 'object' || user === null) return null;
  const raw = (user as Record<string, unknown>).role;
  return raw === 'tenant' || raw === 'landlord' ? raw : null;
}
