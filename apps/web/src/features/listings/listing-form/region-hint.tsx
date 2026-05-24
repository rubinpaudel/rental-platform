import { getTranslator } from '@rental-platform/i18n';
import type { TranslationKey } from '@rental-platform/i18n';
import { inferRegion } from '@/lib/be-postal/region';
import type { Region } from '@/lib/listings/types';

const t = getTranslator();

const REGION_LABELS: Record<Region, TranslationKey> = {
  flanders: 'listings.region.flanders',
  wallonia: 'listings.region.wallonia',
  brussels: 'listings.region.brussels',
};

/**
 * Read-only label that surfaces the region the backend will derive from the
 * postal code. Renders nothing for an invalid/empty code so the layout
 * doesn't jump while the user is still typing.
 */
export function RegionHint({ postalCode }: { postalCode: string }) {
  const region = inferRegion(postalCode);
  if (!region) return null;
  return (
    <p className="text-xs text-muted-foreground">
      {t('listings.form.field.region')}: <span className="text-foreground">{t(REGION_LABELS[region])}</span>
    </p>
  );
}
