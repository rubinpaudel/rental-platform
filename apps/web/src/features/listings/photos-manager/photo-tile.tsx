'use client';

import { GripVertical, Trash2, ImageIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { photoUrl } from '@/lib/listings/photo-url';

const t = getTranslator();

export interface PhotoTileProps {
  storageKey: string;
  alt: string | null;
  isCover: boolean;
  onRemove: () => void;
  removing?: boolean;
}

export function PhotoTile({ storageKey, alt, isCover, onRemove, removing }: PhotoTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: storageKey,
  });

  const url = photoUrl(storageKey);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'group relative overflow-hidden rounded-lg ring-1 ring-foreground/10',
        isDragging && 'z-10 opacity-80 shadow-lg ring-foreground/30',
        removing && 'opacity-40',
      )}
    >
      <div className="relative aspect-square bg-muted">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt ?? ''} className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
        )}
        {isCover && (
          <span className="pointer-events-none absolute left-1 top-1 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-background">
            {t('listings.photos.cover')}
          </span>
        )}

        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="absolute right-1 top-1 flex size-7 cursor-grab items-center justify-center rounded-md bg-foreground/85 text-background opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          aria-label={t('listings.photos.remove')}
          className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-md bg-foreground/85 text-background opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
