'use client';

import { useOptimistic, useTransition } from 'react';
import { Spinner } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { ListingStatus } from '@/lib/listings/types';
import { activateListing, deactivateListing } from '@/lib/listings/actions';
import { StatusBadge } from './status-badge';

const t = getTranslator();

type Variant = 'badge' | 'menu';

export interface StatusToggleProps {
  listingId: string;
  status: ListingStatus;
  variant?: Variant;
}

/**
 * Optimistic activate/deactivate. The badge flips immediately; if the server
 * action throws, useOptimistic discards the optimistic value on the next
 * render and the real status snaps back. We use `closed` listings as a hard
 * stop — neither flip is offered.
 */
export function StatusToggle({ listingId, status, variant = 'badge' }: StatusToggleProps) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic<ListingStatus, ListingStatus>(
    status,
    (_current, next) => next,
  );

  const disabled = pending || optimistic === 'closed';
  const nextStatus: ListingStatus = optimistic === 'active' ? 'inactive' : 'active';
  const actionLabel =
    optimistic === 'active' ? t('listings.action.deactivate') : t('listings.action.activate');

  function toggle() {
    if (disabled) return;
    startTransition(async () => {
      setOptimistic(nextStatus);
      try {
        if (nextStatus === 'active') {
          await activateListing(listingId);
        } else {
          await deactivateListing(listingId);
        }
      } catch {
        // useOptimistic auto-rolls back; revalidatePath inside the action
        // (or our caller's refresh) will reconcile the actual status.
      }
    });
  }

  if (variant === 'menu') {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-50"
      >
        {actionLabel}
        {pending && <Spinner className="size-3" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={optimistic === 'closed'}
      aria-busy={pending}
      title={actionLabel}
      className="group inline-flex items-center gap-2 rounded-md transition-opacity disabled:cursor-not-allowed enabled:hover:opacity-80"
    >
      <StatusBadge status={optimistic} />
      {pending && <Spinner className="size-3 text-muted-foreground" />}
    </button>
  );
}
