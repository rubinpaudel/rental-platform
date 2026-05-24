/**
 * Browser-side photo upload: presign with the API, PUT the file directly to
 * S3 with progress, then attach the resulting storageKey via a server
 * action. Direct-to-S3 keeps photo bytes off our backend; progress requires
 * XHR because `fetch` doesn't expose upload progress events.
 */
import { attachPhoto, presignPhotoUpload } from '@/lib/listings/actions';

export interface UploadProgress {
  loaded: number;
  total: number;
  ratio: number;
}

export interface UploadOptions {
  listingId: string;
  file: File;
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
}

function putToS3(url: string, file: File, opts: UploadOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !opts.onProgress) return;
      opts.onProgress({
        loaded: event.loaded,
        total: event.total,
        ratio: event.loaded / event.total,
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`S3 PUT failed: ${xhr.status} ${xhr.statusText}`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new DOMException('Upload aborted', 'AbortError'));

    opts.signal?.addEventListener('abort', () => xhr.abort(), { once: true });

    xhr.send(file);
  });
}

export async function uploadListingPhoto(opts: UploadOptions): Promise<string> {
  const presign = await presignPhotoUpload(opts.listingId, opts.file.name, opts.file.type);
  await putToS3(presign.url, opts.file, opts);
  await attachPhoto(opts.listingId, presign.storageKey);
  return presign.storageKey;
}
