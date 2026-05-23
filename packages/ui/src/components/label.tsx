import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        'text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-soft',
        className,
      )}
      {...props}
    />
  );
});
