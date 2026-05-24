'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { reorderPhotos } from '@/lib/listings/actions';

export type ReorderSaveState = 'idle' | 'pending' | 'saved' | 'error';

const SAVE_DELAY_MS = 500;
const SAVED_FLASH_MS = 1800;

/**
 * Debounced save for photo reorders. Local order updates immediately on
 * every drop; the server call fires `SAVE_DELAY_MS` after the last drop so
 * a quick burst of reorders flushes as one PUT. The state machine surfaces
 * pending/saved/error to the UI so the landlord knows save status without
 * pressing a "save" button.
 */
export function useDebouncedReorder(listingId: string) {
  const [state, setState] = useState<ReorderSaveState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingKeysRef = useRef<string[] | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    },
    [],
  );

  const queue = useCallback(
    (keys: string[]) => {
      pendingKeysRef.current = keys;
      setState('pending');
      if (timerRef.current) clearTimeout(timerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);

      timerRef.current = setTimeout(async () => {
        const snapshot = pendingKeysRef.current;
        if (!snapshot) return;
        try {
          await reorderPhotos(listingId, snapshot);
          setState('saved');
          flashTimerRef.current = setTimeout(() => setState('idle'), SAVED_FLASH_MS);
        } catch {
          setState('error');
        }
      }, SAVE_DELAY_MS);
    },
    [listingId],
  );

  return { state, queue };
}
