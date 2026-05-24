import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslator } from '@rental-platform/i18n';
import { ListingForm } from '@/features/listings/listing-form/listing-form';

const t = getTranslator();

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('listings.title.private')}
      </Link>
      <h1 className="mt-4 text-2xl font-medium tracking-tight text-foreground">
        {t('listings.new.private')}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('listings.form.step.indicator', { current: 1, total: 4 })}
      </p>

      <div className="mt-10">
        <ListingForm mode="create" />
      </div>
    </div>
  );
}
