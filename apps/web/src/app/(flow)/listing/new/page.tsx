'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTranslator } from '@rental-platform/i18n';
import { Button } from '@rental-platform/ui';
import {
  PropertyTypeGrid,
  type PropertyType,
} from '@/features/listing-flow/property-type-grid';

const t = getTranslator();

// Progress is hard-coded while the flow has only one step. Each new step
// updates this fraction; once the step count stabilises, derive it.
const PROGRESS_FRACTION = 1 / 9;

export default function NewListingFlowPage() {
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);

  return (
    <>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
        <h1 className="text-center text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {t('listings.flow.propertyType.question')}
        </h1>
        <div className="mt-10">
          <PropertyTypeGrid value={propertyType} onChange={setPropertyType} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background">
        <div
          className="h-[3px] bg-foreground"
          style={{ width: `${PROGRESS_FRACTION * 100}%` }}
          aria-hidden
        />
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t('listings.form.back')}
          </Link>
          <Button type="button" disabled={!propertyType}>
            {t('listings.form.next')}
          </Button>
        </div>
      </footer>
    </>
  );
}
