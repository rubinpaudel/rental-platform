'use client';

import { useState } from 'react';
import { getTranslator } from '@rental-platform/i18n';
import { Button } from '@rental-platform/ui';
import { createListing } from '@/lib/listings/actions';
import { useFlow } from '@/features/listing-flow/flow-context';
import { FlowFooter } from '@/features/listing-flow/flow-footer';
import { useFlowGuard } from '@/features/listing-flow/hooks/use-flow-guard';
import { toUpsertBody } from '@/features/listing-flow/to-upsert-body';

const t = getTranslator();

export default function PriceStepPage() {
  const ready = useFlowGuard('price');
  const { propertyType, address, basics, description, priceEur, setPriceEur } = useFlow();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return null;

  const priceNumber = Number(priceEur);
  const valid = priceEur !== '' && Number.isFinite(priceNumber) && priceNumber > 0;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await createListing(toUpsertBody({ propertyType, address, basics, description, priceEur }));
      // createListing redirects on success — anything after this line only
      // runs if it throws.
    } catch (err) {
      // Next.js redirect throws a sentinel that must propagate.
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err;
      setError(t('listings.flow.submit.error'));
      setSubmitting(false);
    }
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-6 py-16 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {t('listings.flow.price.title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('listings.flow.price.subtitle')}
        </p>

        <div className="mt-20 flex items-baseline gap-1 text-6xl font-semibold text-foreground sm:text-7xl">
          <span aria-hidden>€</span>
          <input
            type="text"
            inputMode="numeric"
            value={priceEur}
            onChange={(e) => setPriceEur(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="0"
            aria-label={t('listings.flow.price.title')}
            className="min-w-[2ch] border-0 bg-transparent p-0 text-center outline-none placeholder:text-muted-foreground/30 tabular-nums"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
        </div>

        {error && (
          <p role="alert" className="mt-10 text-sm text-destructive">
            {error}
          </p>
        )}
      </main>

      <FlowFooter step={5} backHref="/listing/new/description">
        <Button type="button" disabled={!valid || submitting} onClick={handleSubmit}>
          {submitting ? t('listings.form.save') : t('listings.form.create')}
        </Button>
      </FlowFooter>
    </>
  );
}
