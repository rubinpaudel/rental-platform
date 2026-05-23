export interface Photo {
  readonly storageKey: string;
  readonly order: number;
  readonly alt: string | null;
}

export function photo(input: { storageKey: string; order: number; alt?: string | null }): Photo {
  if (!input.storageKey) throw new Error('Photo storageKey is required');
  if (!Number.isInteger(input.order) || input.order < 0) {
    throw new Error('Photo order must be a non-negative integer');
  }
  return { storageKey: input.storageKey, order: input.order, alt: input.alt ?? null };
}
