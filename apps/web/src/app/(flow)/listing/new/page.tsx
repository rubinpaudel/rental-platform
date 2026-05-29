'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslator } from '@rental-platform/i18n';
import { useFlow } from '@/features/listing-flow/flow-context';
import { FlowFooter } from '@/features/listing-flow/flow-footer';
import {
  PropertyTypeGrid,
  type PropertyType,
} from '@/features/listing-flow/property-type-grid';

const t = getTranslator();

// Brief pause so the user registers the selected state before the route
// changes. ~180ms hits the sweet spot per the design system: snappy but not
// instantaneous.
const SELECTION_DWELL_MS = 180;

export default function PropertyTypeStepPage() {
  const router = useRouter();
  const { propertyType, setPropertyType } = useFlow();
  const dwellTimerRef = useRef<number | null>(null);

  // Clearing the dwell on unmount and on re-selection prevents a stale
  // router.push from firing after the page is gone, or a double navigation
  // when the user taps two tiles in quick succession.
  useEffect(
    () => () => {
      if (dwellTimerRef.current !== null) window.clearTimeout(dwellTimerRef.current);
    },
    [],
  );

  function handleSelect(next: PropertyType) {
    setPropertyType(next);
    if (dwellTimerRef.current !== null) window.clearTimeout(dwellTimerRef.current);
    dwellTimerRef.current = window.setTimeout(() => {
      dwellTimerRef.current = null;
      router.push('/listing/new/address');
    }, SELECTION_DWELL_MS);
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
        <h1 className="text-center text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {t('listings.flow.propertyType.question')}
        </h1>
        <div className="mt-10">
          <PropertyTypeGrid value={propertyType} onChange={handleSelect} />
        </div>
      </main>

      <FlowFooter step={1} backHref="/dashboard" />
    </>
  );
}
