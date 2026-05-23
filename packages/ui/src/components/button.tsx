import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-paper hover:bg-accent-hover focus-visible:ring-accent/40 active:translate-y-px',
  secondary:
    'bg-ink text-paper hover:bg-ink/90 focus-visible:ring-ink/30 active:translate-y-px',
  outline:
    'border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-ink/[0.04] focus-visible:ring-ink/20',
  ghost: 'text-ink-soft hover:bg-ink/[0.05] hover:text-ink focus-visible:ring-ink/15',
  destructive:
    'bg-danger text-paper hover:bg-danger/90 focus-visible:ring-danger/40 active:translate-y-px',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-[0.9375rem]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[5px] font-medium tracking-[-0.01em] transition-[background-color,border-color,transform,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
