import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-[5px] border border-line bg-paper-raised px-3.5 text-sm text-ink shadow-[inset_0_1px_2px_rgba(26,24,19,0.04)] transition-colors duration-150 placeholder:text-ink-faint focus-visible:border-accent focus-visible:bg-paper-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15',
        className,
      )}
      {...props}
    />
  );
});
