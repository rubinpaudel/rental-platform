import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { buttonVariants } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { TranslationKey } from '@rental-platform/i18n';
import type { OrgKind } from '@/lib/org-kind';

const t = getTranslator();

interface Copy {
  title: TranslationKey;
  description: TranslationKey;
  cta: TranslationKey;
}

const COPY: Record<OrgKind, Copy> = {
  agency: {
    title: 'listings.empty.title.agency',
    description: 'listings.empty.description.agency',
    cta: 'listings.empty.cta.agency',
  },
  private: {
    title: 'listings.empty.title.private',
    description: 'listings.empty.description.private',
    cta: 'listings.empty.cta.private',
  },
};

export function ListingsEmptyState({ kind }: { kind: OrgKind }) {
  const copy = COPY[kind];
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-8 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <KeyRound className="size-5" />
      </div>
      <h2 className="mt-6 text-xl font-medium tracking-tight text-foreground">{t(copy.title)}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t(copy.description)}</p>
      <Link href="/dashboard/listings/new" className={buttonVariants({ className: 'mt-6' })}>
        {t(copy.cta)}
      </Link>
    </div>
  );
}
