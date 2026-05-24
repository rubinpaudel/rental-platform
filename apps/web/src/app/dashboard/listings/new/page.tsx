import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslator } from '@rental-platform/i18n';
import { getActiveOrg } from '@/lib/auth/server-active-org';
import { ListingForm } from '@/features/listings/listing-form/listing-form';

const t = getTranslator();

export default async function NewListingPage() {
  const activeOrg = await getActiveOrg();
  const kind = activeOrg?.kind ?? 'private';
  const title = kind === 'private' ? t('listings.new.private') : t('listings.new');

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/listings"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {kind === 'private' ? t('listings.title.private') : t('listings.title')}
      </Link>
      <h1 className="mt-4 text-2xl font-medium tracking-tight text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('listings.form.step.indicator', { current: 1, total: 4 })}
      </p>

      <div className="mt-10">
        <ListingForm mode="create" />
      </div>
    </div>
  );
}
