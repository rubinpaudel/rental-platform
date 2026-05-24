import { Plus } from 'lucide-react';
import { Button } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { listMyListings } from '@/lib/listings/queries';
import { ListingsGrid } from '@/features/listings/listings-grid';

const t = getTranslator();

export default async function DashboardPage() {
  const { items } = await listMyListings();

  return (
    <div>
      <div className="flex items-start justify-between gap-4 pb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            {t('listings.title.private')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('listings.empty.description.private')}
          </p>
        </div>
        <Button size="icon" variant="ghost" aria-label={t('listings.new.private')}>
          <Plus className="size-5" />
        </Button>
      </div>

      {items.length > 0 && <ListingsGrid listings={items} />}
    </div>
  );
}
