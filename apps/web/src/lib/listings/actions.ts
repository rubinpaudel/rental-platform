'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiMutate } from './server-fetch';
import type { Listing, ListingUpsertBody, PresignResponse } from './types';

const LISTING_INDEX_PATH = '/dashboard/listings';

function detailPath(id: string): string {
  return `${LISTING_INDEX_PATH}/${id}`;
}

function revalidateListing(id: string): void {
  revalidatePath(LISTING_INDEX_PATH);
  revalidatePath(detailPath(id));
}

function revalidatePhotos(id: string): void {
  revalidateListing(id);
  revalidatePath(`${detailPath(id)}/photos`);
}

export async function createListing(body: ListingUpsertBody): Promise<never> {
  const created = await apiMutate<Listing>('/listings', 'POST', body);
  if (!created) throw new Error('Listing creation returned no payload');
  revalidatePath(LISTING_INDEX_PATH);
  redirect(`${detailPath(created.id)}/photos`);
}

export async function updateListing(id: string, body: ListingUpsertBody): Promise<Listing> {
  const updated = await apiMutate<Listing>(
    `/listings/${encodeURIComponent(id)}`,
    'PATCH',
    body,
  );
  if (!updated) throw new Error('Listing update returned no payload');
  revalidateListing(id);
  return updated;
}

export async function activateListing(id: string): Promise<void> {
  await apiMutate(`/listings/${encodeURIComponent(id)}/activate`, 'POST');
  revalidateListing(id);
}

export async function deactivateListing(id: string): Promise<void> {
  await apiMutate(`/listings/${encodeURIComponent(id)}/deactivate`, 'POST');
  revalidateListing(id);
}

export async function deleteListing(id: string): Promise<void> {
  await apiMutate(`/listings/${encodeURIComponent(id)}`, 'DELETE');
  revalidatePath(LISTING_INDEX_PATH);
}

export async function presignPhotoUpload(
  id: string,
  filename: string,
  contentType: string,
): Promise<PresignResponse> {
  const presign = await apiMutate<PresignResponse>(
    `/listings/${encodeURIComponent(id)}/photos/presign`,
    'POST',
    { filename, contentType },
  );
  if (!presign) throw new Error('Presign returned no payload');
  return presign;
}

export async function attachPhoto(id: string, storageKey: string, alt?: string): Promise<void> {
  await apiMutate(`/listings/${encodeURIComponent(id)}/photos`, 'POST', {
    storageKey,
    ...(alt ? { alt } : {}),
  });
  revalidatePhotos(id);
}

export async function removePhoto(id: string, storageKey: string): Promise<void> {
  await apiMutate(
    `/listings/${encodeURIComponent(id)}/photos/${encodeURIComponent(storageKey)}`,
    'DELETE',
  );
  revalidatePhotos(id);
}

export async function reorderPhotos(id: string, storageKeys: string[]): Promise<void> {
  await apiMutate(`/listings/${encodeURIComponent(id)}/photos/order`, 'PUT', {
    storageKeys,
  });
  revalidatePhotos(id);
}
