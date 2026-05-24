'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFlow } from '../flow-context';

const STEP_ROUTES = {
  propertyType: '/listing/new',
  address: '/listing/new/address',
  basics: '/listing/new/basics',
} as const;

type Step = keyof typeof STEP_ROUTES;

const PREREQS: Record<Step, readonly Step[]> = {
  propertyType: [],
  address: ['propertyType'],
  basics: ['propertyType', 'address'],
};

/**
 * Returns true once every prerequisite step has data. While false, the hook
 * schedules a redirect to the first missing prerequisite. Pages should
 * `if (!ready) return null` so an unauthorised step never flashes its UI
 * during the redirect.
 */
export function useFlowGuard(currentStep: Step): boolean {
  const { propertyType, address } = useFlow();
  const router = useRouter();

  const redirect = useMemo(() => {
    for (const prereq of PREREQS[currentStep]) {
      if (prereq === 'propertyType' && !propertyType) return STEP_ROUTES.propertyType;
      if (prereq === 'address' && (!address.street || !address.postalCode)) {
        return STEP_ROUTES.address;
      }
    }
    return null;
  }, [currentStep, propertyType, address.street, address.postalCode]);

  useEffect(() => {
    if (redirect) router.replace(redirect);
  }, [redirect, router]);

  return redirect === null;
}
