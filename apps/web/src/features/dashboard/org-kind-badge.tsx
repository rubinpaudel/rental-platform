'use client';

import { Badge } from '@rental-platform/ui';
import { copyFor, type OrgKind } from '@/lib/org-kind';

export function OrgKindBadge({ kind }: { kind: OrgKind }) {
  return (
    <Badge tone={kind === 'agency' ? 'accent' : 'neutral'}>{copyFor(kind).badgeLabel}</Badge>
  );
}
