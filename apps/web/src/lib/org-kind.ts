/**
 * Org-kind primitives. The backend treats `agency` and `private` orgs
 * identically; the only consumer right now is sign-up, which needs the
 * type + runtime guard. The kind-aware copy table that used to live here
 * was deleted along with the dashboard greeting / org badge / invite
 * dialog — re-introduce it (with i18n keys, not literals) when those
 * surfaces come back.
 */

export const ORG_KINDS = ['agency', 'private'] as const;
export type OrgKind = (typeof ORG_KINDS)[number];

export function isOrgKind(value: unknown): value is OrgKind {
  return typeof value === 'string' && (ORG_KINDS as readonly string[]).includes(value);
}
