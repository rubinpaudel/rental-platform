import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { OrgKind } from '@/lib/org-kind';

const t = getTranslator();

export function ListingsHeader({ kind, count }: { kind: OrgKind; count: number }) {
  const title = kind === 'private' ? t('listings.title.private') : t('listings.title');
  const cta = kind === 'private' ? t('listings.new.private') : t('listings.new');

  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pb-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {count === 1 ? '1 listing' : `${count} listings`}
        </p>
      </div>
      <Link
        href="/dashboard/listings/new"
        className={buttonVariants({ size: 'sm', className: 'gap-1.5' })}
      >
        <Plus className="size-4" />
        {cta}
      </Link>
    </div>
  );
}
