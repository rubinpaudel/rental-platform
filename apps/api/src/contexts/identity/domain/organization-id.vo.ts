declare const brand: unique symbol;

/** Opaque identifier for a Better-Auth-owned organization. */
export type OrganizationId = string & { readonly [brand]: 'OrganizationId' };

export function organizationId(value: string): OrganizationId {
  if (!value) throw new Error('OrganizationId cannot be empty');
  return value as OrganizationId;
}
