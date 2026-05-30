'use client';

import { useState } from 'react';
import { getTranslator } from '@rental-platform/i18n';
import { ChevronDownIcon } from './icons';

const t = getTranslator();

export function Description({ body }: { body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <p
        className={`max-w-[65ch] text-sm leading-relaxed whitespace-pre-line text-foreground ${
          open ? '' : 'line-clamp-4'
        }`}
      >
        {body}
      </p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:rounded-sm"
      >
        {open ? t('publicListing.description.showLess') : t('publicListing.description.showMore')}
        <ChevronDownIcon
          width={14}
          height={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
    </section>
  );
}
