'use client';

import { useCallback } from 'react';
import { Input } from '@rental-platform/ui';
import { lookupBePostal } from '@/lib/be-postal/lookup';

export interface PostalCodeChange {
  postalCode: string;
  /** The canonical municipality for the code, if known. */
  municipality?: string;
}

/**
 * Postal code input that fires both its own onChange and (when the code
 * resolves) a fill of the municipality field. The form owner decides
 * whether to overwrite a manually-typed municipality — we always emit the
 * lookup but only fill when the caller requests it.
 */
export function PostalCodeInput({
  id,
  name,
  value,
  onValueChange,
  onBlur,
  invalid,
}: {
  id: string;
  name: string;
  value: string;
  onValueChange: (change: PostalCodeChange) => void;
  onBlur?: () => void;
  invalid?: boolean;
}) {
  const handleChange = useCallback(
    (raw: string) => {
      // Strip everything that isn't a digit and cap at 4 chars.
      const trimmed = raw.replace(/\D/g, '').slice(0, 4);
      const lookup = trimmed.length === 4 ? lookupBePostal(trimmed) : null;
      onValueChange({
        postalCode: trimmed,
        ...(lookup?.municipality ? { municipality: lookup.municipality } : {}),
      });
    },
    [onValueChange],
  );

  return (
    <Input
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      pattern="\d{4}"
      maxLength={4}
      autoComplete="postal-code"
      value={value}
      onBlur={onBlur}
      onChange={(e) => handleChange(e.target.value)}
      aria-invalid={invalid}
    />
  );
}
