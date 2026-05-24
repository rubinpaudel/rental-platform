import { Badge } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { ListingStatus } from '@/lib/listings/types';

const t = getTranslator();

const variants: Record<ListingStatus, { className: string; labelKey: Parameters<typeof t>[0] }> = {
  draft: {
    className:
      'border border-border bg-muted text-muted-foreground dark:bg-muted/50',
    labelKey: 'listings.status.draft',
  },
  active: {
    className:
      'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    labelKey: 'listings.status.active',
  },
  inactive: {
    className:
      'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
    labelKey: 'listings.status.inactive',
  },
  closed: {
    className:
      'border border-destructive/20 bg-destructive/10 text-destructive',
    labelKey: 'listings.status.closed',
  },
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  const { className, labelKey } = variants[status];
  return <Badge className={className}>{t(labelKey)}</Badge>;
}
