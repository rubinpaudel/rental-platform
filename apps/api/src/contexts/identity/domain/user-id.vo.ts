declare const brand: unique symbol;

/** Opaque identifier for a Better-Auth-owned user. */
export type UserId = string & { readonly [brand]: 'UserId' };

export function userId(value: string): UserId {
  if (!value) throw new Error('UserId cannot be empty');
  return value as UserId;
}
