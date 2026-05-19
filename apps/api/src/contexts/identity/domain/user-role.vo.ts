// 'tenant'   — someone looking to rent a home.
// 'landlord' — someone offering a home: lettings agencies AND private
//              persons renting out their own property.
export const USER_ROLES = ['tenant', 'landlord'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}

export function userRole(value: unknown): UserRole {
  if (!isUserRole(value)) {
    throw new Error(`Invalid user role: ${String(value)}`);
  }
  return value;
}
