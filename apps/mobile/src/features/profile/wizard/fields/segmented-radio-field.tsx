import { View } from 'react-native';
import { FieldError, Label, RadioGroup, Text } from 'heroui-native';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedRadioFieldProps<T extends string> {
  value: T | '';
  onChange: (value: T) => void;
  options: readonly Option<T>[];
  label?: string;
  error?: string | undefined;
}

/**
 * Vertical list of radio options — used for enum picks (employment
 * status, income proof type) and yes/no booleans. Wraps HeroUI Native's
 * RadioGroup so step screens don't have to manage the compound API
 * directly. Item text is the only content; the default Radio indicator
 * renders to its left.
 */
export function SegmentedRadioField<T extends string>({
  value,
  onChange,
  options,
  label,
  error,
}: SegmentedRadioFieldProps<T>) {
  return (
    <View className="gap-2">
      {label ? <Label>{label}</Label> : null}
      <RadioGroup
        value={value || undefined}
        onValueChange={(v) => onChange(v as T)}
        isInvalid={!!error}
      >
        <View className="gap-3">
          {options.map((opt) => (
            <RadioGroup.Item key={opt.value} value={opt.value}>
              <Text type="body">{opt.label}</Text>
            </RadioGroup.Item>
          ))}
        </View>
      </RadioGroup>
      {error ? <FieldError>{error}</FieldError> : null}
    </View>
  );
}
