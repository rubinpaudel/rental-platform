'use client';

import { useCallback, useEffect, useRef } from 'react';
import { lookupPostal, searchPostal } from '@/lib/postal/lookup';
import type { FlowAddress } from '../flow-context';

type Patch = Partial<Pick<FlowAddress, 'postalCode' | 'municipality'>>;

/**
 * Two-way postal ↔ municipality autofill. Stale responses are dropped via a
 * per-direction ticket so fast typing can't clobber the freshest answer.
 */
export function usePostalAutofill(
  address: FlowAddress,
  setAddress: (patch: Patch) => void,
) {
  const postalTicket = useRef(0);
  const municipalityTicket = useRef(0);
  // The blur callback needs the latest address but must not re-create on
  // every keystroke (it'd defeat any memoization downstream). Reading from
  // a ref keeps the callback identity stable.
  const addressRef = useRef(address);
  useEffect(() => {
    addressRef.current = address;
  });

  // Postcode is the source of truth — we always overwrite municipality when
  // the lookup resolves cleanly.
  const onPostalCodeChange = useCallback(
    async (raw: string) => {
      const digits = raw.replace(/\D/g, '').slice(0, 4);
      setAddress({ postalCode: digits });
      if (digits.length !== 4) return;
      const ticket = ++postalTicket.current;
      const cities = await lookupPostal(digits);
      if (ticket !== postalTicket.current) return;
      const first = cities[0];
      if (first) setAddress({ municipality: first.municipality });
    },
    [setAddress],
  );

  // Searching while typing would flood the API and fight the user's
  // keystrokes; one resolve on blur is enough.
  const onMunicipalityBlur = useCallback(async () => {
    const a = addressRef.current;
    const q = a.municipality.trim();
    if (q.length < 2 || a.postalCode.length === 4) return;
    const ticket = ++municipalityTicket.current;
    const cities = await searchPostal(q);
    if (ticket !== municipalityTicket.current) return;
    const first = cities[0];
    if (first) setAddress({ postalCode: first.postalCode });
  }, [setAddress]);

  return { onPostalCodeChange, onMunicipalityBlur };
}
