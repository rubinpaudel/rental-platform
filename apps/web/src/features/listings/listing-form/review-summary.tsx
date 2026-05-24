import { getTranslator } from '@rental-platform/i18n';
import type { TranslationKey } from '@rental-platform/i18n';
import { inferRegion } from '@/lib/be-postal/region';
import type { Region } from '@/lib/listings/types';
import type { ListingFormValues } from './schema';

const t = getTranslator();

const REGION_LABELS: Record<Region, TranslationKey> = {
  flanders: 'listings.region.flanders',
  wallonia: 'listings.region.wallonia',
  brussels: 'listings.region.brussels',
};

interface Row {
  label: string;
  value: string;
}

function rows(values: ListingFormValues): Row[] {
  const region = inferRegion(values.postalCode);
  const addressLine = [
    `${values.street} ${values.number}${values.box ? ` bus ${values.box}` : ''}`,
    `${values.postalCode} ${values.municipality}`,
  ].join(', ');
  return [
    { label: t('listings.form.field.title'), value: values.title },
    { label: t('listings.form.field.description'), value: values.description },
    {
      label: t('listings.form.field.price'),
      value: values.priceEur ? `€ ${Number(values.priceEur).toLocaleString('nl-BE')}` : '—',
    },
    { label: t('listings.form.field.surface'), value: values.surfaceM2 ? `${values.surfaceM2} m²` : '—' },
    { label: t('listings.form.field.rooms'), value: values.rooms || '—' },
    { label: t('listings.detail.section.address'), value: addressLine },
    ...(region
      ? [{ label: t('listings.form.field.region'), value: t(REGION_LABELS[region]) }]
      : []),
  ];
}

export function ReviewSummary({ values }: { values: ListingFormValues }) {
  return (
    <dl className="divide-y divide-border rounded-xl border border-border bg-card text-sm">
      {rows(values).map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3 first:rounded-t-xl last:rounded-b-xl"
        >
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="break-words text-foreground">{row.value || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
