import Link from 'next/link';
import { buttonVariants } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-8 py-20 text-center">
      <h1 className="text-xl font-medium tracking-tight text-foreground">
        {t('listings.detail.notFound.title')}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {t('listings.detail.notFound.description')}
      </p>
      <Link href="/dashboard/listings" className={buttonVariants({ className: 'mt-6' })}>
        {t('listings.detail.notFound.cta')}
      </Link>
    </div>
  );
}
