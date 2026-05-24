'use client';

import { useCallback, useRef, useState } from 'react';
import { uploadListingPhoto } from './upload';

export type UploadStatus = 'queued' | 'uploading' | 'failed' | 'done';

export interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  progress: number;
  error?: string | undefined;
}

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `upload-${Date.now()}-${nextId}`;
}

/**
 * Tracks an in-memory queue of file uploads. Each item retries independently
 * via `retry(id)`, so a failed upload never blocks others — fitting the
 * bad-connectivity case in the spec.
 */
export function useUploadQueue({
  listingId,
  onAllSettled,
}: {
  listingId: string;
  onAllSettled?: () => void;
}) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const inFlight = useRef(0);

  const update = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const runUpload = useCallback(
    async (id: string, file: File) => {
      inFlight.current += 1;
      update(id, { status: 'uploading', progress: 0, error: undefined });
      try {
        await uploadListingPhoto({
          listingId,
          file,
          onProgress: ({ ratio }) => update(id, { progress: ratio }),
        });
        update(id, { status: 'done', progress: 1 });
      } catch (e) {
        update(id, {
          status: 'failed',
          error: e instanceof Error ? e.message : 'Upload failed',
        });
      } finally {
        inFlight.current -= 1;
        if (inFlight.current === 0) onAllSettled?.();
      }
    },
    [listingId, update, onAllSettled],
  );

  const enqueue = useCallback(
    (files: File[]) => {
      const accepted = files.filter((f) => f.type.startsWith('image/'));
      if (accepted.length === 0) return;

      const newItems: UploadItem[] = accepted.map((file) => ({
        id: makeId(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'queued',
        progress: 0,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Fire all in parallel — the backend handles each presign + attach
      // independently, and per-file progress is already in the queue.
      newItems.forEach((item) => {
        void runUpload(item.id, item.file);
      });
    },
    [runUpload],
  );

  const retry = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item || item.status !== 'failed') return;
      void runUpload(id, item.file);
    },
    [items, runUpload],
  );

  const dismiss = useCallback((id: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setItems((prev) => {
      prev.filter((i) => i.status === 'done').forEach((i) => URL.revokeObjectURL(i.previewUrl));
      return prev.filter((i) => i.status !== 'done');
    });
  }, []);

  return { items, enqueue, retry, dismiss, clearCompleted };
}
