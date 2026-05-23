import { forwardRef, type ReactNode } from 'react';
import { View, type TextInput } from 'react-native';
import { Input, type InputProps } from './input';
import { Label } from './label';
import { FieldError } from './field-error';

export interface FieldProps extends Omit<InputProps, 'invalid'> {
  label: string;
  error?: string | undefined;
  /** Slot below the input — useful for hints / inline links. */
  hint?: ReactNode;
}

/**
 * Label + input + error in one composite. The visible label is also the
 * accessibility label for the input so screen readers announce the right
 * thing without relying on Android-only `accessibilityLabelledBy`.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, error, hint, ...inputProps },
  ref,
) {
  return (
    <View className="gap-1.5">
      <Label>{label}</Label>
      <Input
        ref={ref}
        accessibilityLabel={label}
        invalid={Boolean(error)}
        {...inputProps}
      />
      {hint}
      <FieldError message={error} />
    </View>
  );
});
