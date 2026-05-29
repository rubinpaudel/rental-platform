import { Alert } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { getActiveOrg } from '@/lib/auth/server-active-org';
import { listMyListings } from '@/lib/listings/queries';
import { ListingsEmptyState } from '@/features/listings/listings-empty-state';
import { ListingsHeader } from '@/features/listings/listings-header';
import { ListingsTable } from '@/features/listings/listings-table';

const t = getTranslator();

const PRIVATE_SOFT_LIMIT = 5;

export default async function ListingsPage() {
  // Active-org lookup is request-deduped via React.cache (the layout already
  // fetched it); listMyListings is the new work. Run them together so a cold
  // cache still issues a single parallel pair instead of a waterfall.
  const [activeOrg, { items }] = await Promise.all([getActiveOrg(), listMyListings()]);
  const kind = activeOrg?.kind ?? 'private';

  return (
    <div>
      <ListingsHeader kind={kind} count={items.length} />

      {kind === 'private' && items.length > PRIVATE_SOFT_LIMIT && (
        <Alert className="mb-6">{t('listings.softLimit.warning')}</Alert>
      )}

      {items.length === 0 ? (
        <ListingsEmptyState kind={kind} />
      ) : (
        <ListingsTable listings={items} />
      )}
    </div>
  );
}
