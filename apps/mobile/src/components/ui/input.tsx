import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/cn';

export interface InputProps extends TextInputProps {
  invalid?: boolean;
  className?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { className, invalid = false, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor="#a3a3a3"
      className={cn(
        'h-12 rounded-lg border border-line bg-paper px-3 text-base text-ink',
        'focus:border-accent',
        invalid && 'border-danger',
        className,
      )}
      accessibilityState={invalid ? { selected: false } : undefined}
      {...props}
    />
  );
});
