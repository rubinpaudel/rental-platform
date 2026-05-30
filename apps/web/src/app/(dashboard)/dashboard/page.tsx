import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { listMyListings } from '@/lib/listings/queries';
import { ListingsGrid } from '@/features/listings/listings-grid';

const t = getTranslator();

export default async function DashboardPage() {
  const { items } = await listMyListings();

  return (
    <div>
      <div className="flex items-center justify-between gap-4 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('listings.title.private')}
        </h1>
        <Link
          href="/listing/new"
          aria-label={t('listings.new.private')}
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <Plus className="size-5" />
        </Link>
      </div>

      {items.length > 0 && <ListingsGrid listings={items} />}
    </div>
  );
}
