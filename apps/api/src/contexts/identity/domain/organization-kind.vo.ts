// An organization's nature, independent of the owner's user role:
//   'agency'  — a lettings/realtor company; invites multiple agents.
//   'private' — a private owner (solo, may invite a partner/co-owner) OR a
//               tenant's personal org they never see.
export const ORG_KINDS = ['agency', 'private'] as const;

export type OrganizationKind = (typeof ORG_KINDS)[number];

export function isOrganizationKind(value: unknown): value is OrganizationKind {
  return typeof value === 'string' && (ORG_KINDS as readonly string[]).includes(value);
}

export function organizationKind(value: unknown): OrganizationKind {
  if (!isOrganizationKind(value)) {
    throw new Error(`Invalid organization kind: ${String(value)}`);
  }
  return value;
}
