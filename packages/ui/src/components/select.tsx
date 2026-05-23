import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Styled native `<select>`. shadcn ships a Radix-backed Select; we stay on
 * the native element for now because (a) zero new deps, (b) iOS/Android
 * use their own pickers which is what users expect on mobile, (c) the
 * binary kind picker on sign-up doesn't need custom popover styling.
 *
 * Swap to @radix-ui/react-select later by changing this file — the
 * consumer-facing API (children as <option>) stays the same.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'flex h-11 w-full appearance-none rounded-[5px] border border-line bg-paper-raised pl-3.5 pr-10 text-sm text-ink shadow-[inset_0_1px_2px_rgba(26,24,19,0.04)] transition-colors duration-150 focus-visible:border-accent focus-visible:bg-paper-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
      >
        <path
          d="M4 6l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});
