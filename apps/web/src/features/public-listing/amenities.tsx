import { getTranslator } from '@rental-platform/i18n';
import { AMENITY_ICONS } from './icons';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

export function Amenities({ items }: { items: PublicListing['amenities'] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">
        {t('publicListing.amenities.title')}
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {items.map(({ key, label }) => {
          const I = AMENITY_ICONS[key];
          return (
            <li key={key} className="flex items-center gap-4 text-sm text-foreground">
              <span aria-hidden="true" className="text-foreground">
                {I ? <I width={22} height={22} /> : null}
              </span>
              {label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
