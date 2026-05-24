import * as React from "react"

import { cn } from "../lib/utils"
import { Input } from "./input"

/**
 * A label-inside-the-box field. Default is flat so callers can group several
 * into a single bordered + divided container (the listing-flow address card).
 * Pass `bordered` for a standalone, self-contained field — the typical shape
 * for auth forms.
 */
export interface StackedFieldProps
  extends Omit<React.ComponentProps<"input">, "id"> {
  id: string
  label: React.ReactNode
  error?: string | undefined
  labelExtra?: React.ReactNode
  bordered?: boolean
}

function StackedField({
  id,
  label,
  error,
  labelExtra,
  bordered = false,
  className,
  ...input
}: StackedFieldProps) {
  return (
    <div
      className={cn(
        "px-4 py-2.5",
        bordered && "rounded-xl border border-border bg-background",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="block text-[11px] font-normal uppercase tracking-wide text-muted-foreground"
        >
          {label}
        </label>
        {labelExtra}
      </div>
      <Input
        id={id}
        variant="flat"
        aria-invalid={Boolean(error) || undefined}
        {...input}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { StackedField }
