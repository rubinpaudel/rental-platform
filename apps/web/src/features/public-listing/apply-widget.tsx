import { getTranslator } from '@rental-platform/i18n';
import { Button, Separator } from '@rental-platform/ui';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

const fmtEur = (cents: number) =>
  new Intl.NumberFormat('nl-BE', { maximumFractionDigits: 0 }).format(cents / 100);

export function ApplyWidget({ listing }: { listing: PublicListing }) {
  const totalFirstMonthCents =
    listing.priceCents + listing.chargesCents + listing.depositCents;
  return (
    <aside className="sticky top-24 flex flex-col gap-5 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          €{fmtEur(listing.priceCents)}
        </span>
        <span className="text-sm text-foreground/70">/ maand</span>
      </div>

      <div className="overflow-hidden rounded-lg ring-1 ring-foreground/15">
        <div className="grid grid-cols-2">
          <div className="border-r border-border px-3 py-2">
            <span className="block text-[0.625rem] font-medium tracking-wider text-foreground/60 uppercase">
              {t('publicListing.apply.moveIn')}
            </span>
            <input
              type="date"
              defaultValue="2026-07-01"
              className="mt-0.5 w-full bg-transparent text-sm text-foreground outline-none tabular-nums"
            />
          </div>
          <div className="px-3 py-2">
            <span className="block text-[0.625rem] font-medium tracking-wider text-foreground/60 uppercase">
              {t('publicListing.apply.household')}
            </span>
            <select
              defaultValue="2"
              className="-ml-0.5 mt-0.5 w-full bg-transparent text-sm text-foreground outline-none appearance-none"
            >
              <option value="1">{t('publicListing.apply.householdOne')}</option>
              <option value="2">
                {t('publicListing.apply.householdMany', { n: 2 })}
              </option>
              <option value="3">
                {t('publicListing.apply.householdMany', { n: 3 })}
              </option>
              <option value="4">
                {t('publicListing.apply.householdMany', { n: 4 })}
              </option>
            </select>
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full">
        {t('publicListing.apply.cta')}
      </Button>

      <p className="-mt-1 text-center text-xs text-foreground/70">
        {t('publicListing.apply.deadline')}
      </p>

      <Separator />

      <dl className="flex flex-col gap-2 text-sm">
        <Row
          label={t('publicListing.apply.breakdown.rent')}
          value={`€${fmtEur(listing.priceCents)}`}
        />
        <Row
          label={t('publicListing.apply.breakdown.charges')}
          value={`€${fmtEur(listing.chargesCents)}`}
        />
        <Row
          label={t('publicListing.apply.breakdown.deposit')}
          value={`€${fmtEur(listing.depositCents)}`}
        />
        <Separator className="my-1" />
        <Row
          label={t('publicListing.apply.breakdown.total')}
          value={`€${fmtEur(totalFirstMonthCents)}`}
          strong
        />
      </dl>
    </aside>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt
        className={`text-foreground ${strong ? 'font-medium' : 'underline underline-offset-2 decoration-foreground/40'}`}
      >
        {label}
      </dt>
      <dd
        className={`tabular-nums text-foreground ${strong ? 'font-medium' : ''}`}
      >
        {value}
      </dd>
    </div>
  );
}
