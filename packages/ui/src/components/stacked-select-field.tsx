import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "../lib/utils"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./select"

/**
 * Select counterpart to `StackedField`. Same label-inside-the-box pattern,
 * with the chevron trigger using the Select's `flat` variant. Children are
 * the `SelectItem`s passed through to `SelectContent`.
 *
 * Two layout notes worth keeping in mind:
 * - The trigger spans the full container width (horizontal padding lives on
 *   the trigger, not the container) so Base-UI's `--anchor-width` matches
 *   the visible field — the dropdown popup then renders the same width.
 * - The chevron is rendered by the wrapper (not the trigger) so it stays
 *   vertically centred in the whole box rather than on the trigger row
 *   underneath the label.
 */
export interface StackedSelectFieldProps {
  id: string
  label: React.ReactNode
  value?: string
  onValueChange?: (value: string | null) => void
  onBlur?: () => void
  placeholder?: string
  /**
   * Optional render for the trigger's display value (same render-prop API as
   * `SelectValue`). Useful when the raw value should resolve to a different
   * human-readable label.
   */
  renderValue?: React.ComponentProps<typeof SelectValue>["children"]
  error?: string | undefined
  labelExtra?: React.ReactNode
  bordered?: boolean
  className?: string
  children: React.ReactNode
}

function StackedSelectField({
  id,
  label,
  value,
  onValueChange,
  onBlur,
  placeholder,
  renderValue,
  error,
  labelExtra,
  bordered = false,
  className,
  children,
}: StackedSelectFieldProps) {
  return (
    <div
      className={cn(
        "relative py-2.5 [&_[data-slot=select-trigger]_svg]:hidden",
        bordered && "rounded-xl border border-border bg-background",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2 px-4">
        <label
          htmlFor={id}
          className="block text-[11px] font-normal uppercase tracking-wide text-muted-foreground"
        >
          {label}
        </label>
        {labelExtra}
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          variant="flat"
          onBlur={onBlur}
          aria-invalid={Boolean(error) || undefined}
          className="px-4 pr-10"
        >
          <SelectValue placeholder={placeholder}>{renderValue}</SelectValue>
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
      {error && <p className="mt-1 px-4 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { StackedSelectField }
