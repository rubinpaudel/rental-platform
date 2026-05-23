import { getTranslator } from '@rental-platform/i18n';

/**
 * Org-kind-aware copy & capabilities. The backend treats `agency` and
 * `private` orgs identically (org-scoped resources); ALL branching here is
 * presentation only. Single place to read `activeOrganization.kind` and the
 * single place copy diverges, so the rest of the UI stays kind-agnostic.
 */

export const ORG_KINDS = ['agency', 'private'] as const;
export type OrgKind = (typeof ORG_KINDS)[number];

export function isOrgKind(value: unknown): value is OrgKind {
  return typeof value === 'string' && (ORG_KINDS as readonly string[]).includes(value);
}

/**
 * Reads `kind` off a Better Auth organization object. The backend exposes it
 * as a server-set additional field; the client type doesn't carry it, so we
 * narrow here once. Defaults to `private` (the backend's own default) so the
 * UI never has to handle an undefined kind.
 */
export function orgKindOf(org: unknown): OrgKind {
  const kind =
    typeof org === 'object' && org !== null
      ? (org as Record<string, unknown>).kind
      : undefined;
  return isOrgKind(kind) ? kind : 'private';
}

interface KindCopy {
  inviteLabel: string;
  inviteRole: 'member' | 'admin';
  /** Private orgs may invite exactly one co-owner. */
  inviteCapped: boolean;
  teamHeading: string;
  greeting: (orgName: string) => string;
  badgeLabel: string;
  listingHeader: string;
}

// Resolved once at module-load against the default locale. When we wire
// runtime locale switching this needs to become a lazy lookup (function /
// getter); for now `nl` is hardcoded everywhere so eager resolution is fine.
const t = getTranslator();

const COPY: Record<OrgKind, KindCopy> = {
  agency: {
    inviteLabel: t('orgKind.agency.invite'),
    inviteRole: 'member',
    inviteCapped: false,
    teamHeading: t('orgKind.agency.team'),
    greeting: (orgName) => t('orgKind.agency.greeting', { orgName }),
    badgeLabel: t('orgKind.agency.badge'),
    listingHeader: t('orgKind.agency.listing'),
  },
  private: {
    inviteLabel: t('orgKind.private.invite'),
    inviteRole: 'admin',
    inviteCapped: true,
    teamHeading: t('orgKind.private.team'),
    greeting: () => t('orgKind.private.greeting'),
    badgeLabel: t('orgKind.private.badge'),
    listingHeader: t('orgKind.private.listing'),
  },
};

export function copyFor(kind: OrgKind): KindCopy {
  return COPY[kind];
}
