'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Alert } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { ListingPhoto } from '@/lib/listings/types';
import { removePhoto } from '@/lib/listings/actions';
import { PhotoDropzone } from './photo-dropzone';
import { PhotoTile } from './photo-tile';
import { UploadTile } from './upload-tile';
import { useDebouncedReorder } from './use-debounced-reorder';
import { useUploadQueue } from './use-upload-queue';

const t = getTranslator();

export function PhotosManager({
  listingId,
  initialPhotos,
}: {
  listingId: string;
  initialPhotos: ListingPhoto[];
}) {
  const router = useRouter();
  const [order, setOrder] = useState<string[]>(() =>
    [...initialPhotos].sort((a, b) => a.order - b.order).map((p) => p.storageKey),
  );
  const [photoMap, setPhotoMap] = useState<Map<string, ListingPhoto>>(
    () => new Map(initialPhotos.map((p) => [p.storageKey, p])),
  );
  const [removing, startRemoval] = useTransition();
  const [removingKey, setRemovingKey] = useState<string | null>(null);

  // Reconcile when initialPhotos changes (e.g. after a server-action refresh
  // because of a delete or upload completion). Preserve any local-only
  // reordering that hasn't flushed yet.
  useEffect(() => {
    setPhotoMap(new Map(initialPhotos.map((p) => [p.storageKey, p])));
    setOrder((prev) => {
      const known = new Set(initialPhotos.map((p) => p.storageKey));
      const kept = prev.filter((k) => known.has(k));
      const appended = initialPhotos
        .filter((p) => !prev.includes(p.storageKey))
        .sort((a, b) => a.order - b.order)
        .map((p) => p.storageKey);
      return [...kept, ...appended];
    });
  }, [initialPhotos]);

  const reorder = useDebouncedReorder(listingId);
  const uploadQueue = useUploadQueue({
    listingId,
    onAllSettled: () => router.refresh(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((current) => {
      const oldIndex = current.indexOf(String(active.id));
      const newIndex = current.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return current;
      const next = arrayMove(current, oldIndex, newIndex);
      reorder.queue(next);
      return next;
    });
  }

  function handleRemove(storageKey: string) {
    setRemovingKey(storageKey);
    startRemoval(async () => {
      try {
        await removePhoto(listingId, storageKey);
        setOrder((prev) => prev.filter((k) => k !== storageKey));
        setPhotoMap((prev) => {
          const next = new Map(prev);
          next.delete(storageKey);
          return next;
        });
        router.refresh();
      } finally {
        setRemovingKey(null);
      }
    });
  }

  const reorderHint =
    reorder.state === 'pending'
      ? t('listings.photos.reorderSaving')
      : reorder.state === 'saved'
        ? t('listings.photos.reorderSaved')
        : t('listings.photos.reorderHint');

  return (
    <div className="space-y-8">
      <PhotoDropzone onFiles={uploadQueue.enqueue} />

      {reorder.state === 'error' && (
        <Alert variant="destructive">{t('listings.form.error.generic')}</Alert>
      )}

      {(order.length > 0 || uploadQueue.items.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <p className="text-muted-foreground">{reorderHint}</p>
            {uploadQueue.items.some((i) => i.status === 'done') && (
              <button
                type="button"
                onClick={uploadQueue.clearCompleted}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('listings.photos.done')}
              </button>
            )}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={order} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {order.map((key, idx) => {
                  const photo = photoMap.get(key);
                  if (!photo) return null;
                  return (
                    <PhotoTile
                      key={photo.storageKey}
                      storageKey={photo.storageKey}
                      alt={photo.alt}
                      isCover={idx === 0}
                      onRemove={() => handleRemove(photo.storageKey)}
                      removing={removing && removingKey === photo.storageKey}
                    />
                  );
                })}

                {uploadQueue.items.map((item) => (
                  <UploadTile
                    key={item.id}
                    item={item}
                    onRetry={() => uploadQueue.retry(item.id)}
                    onDismiss={() => uploadQueue.dismiss(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {order.length === 0 && uploadQueue.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">
            {t('listings.photos.empty.title')}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('listings.photos.empty.description')}
          </p>
        </div>
      )}
    </div>
  );
}
