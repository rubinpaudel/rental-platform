import type { ReactNode } from 'react';
import { Label } from '@rental-platform/ui';

/**
 * Small shell that pairs a Label with a control and (when present) the
 * field's first validation error. Keeps the field markup tight so the form
 * file doesn't drown in repeated `<div className="space-y-1.5">` wrappers.
 */
export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
