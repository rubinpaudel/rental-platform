'use client';

import { X } from 'lucide-react';
import { Progress } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { UploadItem } from './use-upload-queue';

const t = getTranslator();

export function UploadTile({
  item,
  onRetry,
  onDismiss,
}: {
  item: UploadItem;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg ring-1 ring-foreground/10">
      <div className="relative aspect-square bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.previewUrl} alt="" className="size-full object-cover opacity-70" />
        {item.status !== 'done' && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-foreground/85 text-background transition-opacity hover:opacity-90"
            aria-label="Remove from queue"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      <div className="space-y-1 px-2 pb-2 pt-1.5">
        {item.status === 'uploading' && (
          <>
            <Progress value={item.progress * 100} />
            <p className="text-xs text-muted-foreground">{t('listings.photos.uploading')}</p>
          </>
        )}
        {item.status === 'queued' && (
          <p className="text-xs text-muted-foreground">{t('listings.photos.uploading')}</p>
        )}
        {item.status === 'failed' && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full rounded-md bg-destructive/10 px-2 py-1 text-left text-xs text-destructive hover:bg-destructive/20"
          >
            {t('listings.photos.uploadError')}
          </button>
        )}
        {item.status === 'done' && (
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            {t('listings.photos.done')}
          </p>
        )}
      </div>
    </div>
  );
}
