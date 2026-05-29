'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { ImagePlus } from 'lucide-react';
import { cn } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

export function PhotoDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState(false);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setHovering(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFiles(files);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) onFiles(files);
    // Allow re-selecting the same file (e.g. after a retry).
    event.target.value = '';
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setHovering(true);
      }}
      onDragLeave={() => setHovering(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-8 py-12 text-center transition-colors',
        hovering
          ? 'border-foreground/40 bg-muted/60'
          : 'border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50',
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-background ring-1 ring-foreground/10">
        <ImagePlus className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{t('listings.photos.uploadCta')}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t('listings.photos.dropHint')}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleChange}
      />
    </div>
  );
}
