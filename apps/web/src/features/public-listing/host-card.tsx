import { getTranslator } from '@rental-platform/i18n';
import { Button, Badge } from '@rental-platform/ui';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

export function HostCard({ host }: { host: PublicListing['host'] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground">
        {t('publicListing.host.title')}
      </h2>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-medium text-foreground ring-1 ring-border"
          >
            {host.name.charAt(0)}
          </span>
          <div>
            <p className="text-base font-medium text-foreground">{host.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {host.kind === 'agency' ? 'Agency' : 'Private'}
              </Badge>
              <span className="text-xs text-foreground/70">
                {t('publicListing.host.member', { year: host.sinceYear })}
              </span>
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-1 text-sm text-foreground sm:ml-auto sm:text-right">
          <li className="tabular-nums">
            {t('publicListing.host.responseRate', { rate: host.responseRatePct })}
          </li>
          <li>{t('publicListing.host.responseTime', { time: host.responseTime })}</li>
        </ul>
      </div>
      <div className="mt-5">
        <Button variant="outline">{t('publicListing.host.contact')}</Button>
      </div>
    </section>
  );
}
