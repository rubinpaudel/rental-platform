import { getTranslator } from '@rental-platform/i18n';
import { BedDoubleIcon, BedSingleIcon } from './icons';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

export function Sleeping({ bedrooms }: { bedrooms: PublicListing['bedrooms'] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">
        {t('publicListing.sleeping.title')}
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {bedrooms.map((b, i) => {
          const I = b.kind === 'queen' ? BedDoubleIcon : BedSingleIcon;
          return (
            <li
              key={i}
              className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10"
            >
              <span aria-hidden="true" className="text-foreground">
                <I width={28} height={28} />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t('publicListing.sleeping.bedroom', { n: i + 1 })}
                </p>
                <p className="text-sm text-foreground/70">
                  {b.kind === 'queen'
                    ? t('publicListing.sleeping.queenBed')
                    : t('publicListing.sleeping.singleBed')}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
