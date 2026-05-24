'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { PropertyType } from './property-type-grid';

export interface FlowAddress {
  street: string;
  number: string;
  box: string;
  postalCode: string;
  municipality: string;
}

export interface FlowBasics {
  bedrooms: number;
  surfaceM2: number | null;
}

const EMPTY_ADDRESS: FlowAddress = {
  street: '',
  number: '',
  box: '',
  postalCode: '',
  municipality: '',
};

const EMPTY_BASICS: FlowBasics = {
  bedrooms: 1,
  surfaceM2: null,
};

interface FlowApi {
  propertyType: PropertyType | null;
  address: FlowAddress;
  basics: FlowBasics;
  setPropertyType: (next: PropertyType) => void;
  setAddress: (patch: Partial<FlowAddress>) => void;
  setBasics: (patch: Partial<FlowBasics>) => void;
}

const FlowContext = createContext<FlowApi | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [address, setAddressState] = useState<FlowAddress>(EMPTY_ADDRESS);
  const [basics, setBasicsState] = useState<FlowBasics>(EMPTY_BASICS);

  const setAddress = useCallback((patch: Partial<FlowAddress>) => {
    setAddressState((prev) => mergeIfChanged(prev, patch));
  }, []);

  const setBasics = useCallback((patch: Partial<FlowBasics>) => {
    setBasicsState((prev) => mergeIfChanged(prev, patch));
  }, []);

  const api = useMemo<FlowApi>(
    () => ({ propertyType, address, basics, setPropertyType, setAddress, setBasics }),
    [propertyType, address, basics, setAddress, setBasics],
  );

  return <FlowContext.Provider value={api}>{children}</FlowContext.Provider>;
}

export function useFlow(): FlowApi {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error('useFlow must be used inside FlowProvider');
  return ctx;
}

// Returns `prev` (same reference) when every patched field already matches,
// so React's `Object.is` bailout skips the re-render. Spreading unconditionally
// would notify every `useFlow` consumer on each keystroke even when nothing
// actually changed (e.g. typing past the postcode max-length).
function mergeIfChanged<T extends object>(prev: T, patch: Partial<T>): T {
  for (const key of Object.keys(patch) as Array<keyof T>) {
    if (patch[key] !== prev[key]) return { ...prev, ...patch };
  }
  return prev;
}
