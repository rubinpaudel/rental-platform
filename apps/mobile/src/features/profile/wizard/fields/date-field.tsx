import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { FieldError, Label, Text } from 'heroui-native';

interface DateFieldProps {
  /** ISO yyyy-MM-dd; empty/undefined renders the placeholder. */
  value: string;
  onChange: (iso: string) => void;
  label: string;
  placeholder: string;
  error?: string | undefined;
  /** Bounds — sensible birthday / move-date ranges. */
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * Cross-platform date picker. Renders a tappable surface showing the
 * formatted value (or placeholder); on press shows the native picker.
 *
 *   - iOS: opens a compact inline-style picker that overlays briefly.
 *   - Android: opens the native dialog. The picker fires once and
 *     dismisses itself, so we tear down with setShow(false) on every
 *     event regardless of action.
 *
 * Value/onChange contract is ISO yyyy-MM-dd to match the wire schema —
 * the JS Date conversion stays local to this component.
 */
export function DateField({
  value,
  onChange,
  label,
  placeholder,
  error,
  minimumDate,
  maximumDate,
}: DateFieldProps) {
  const [show, setShow] = useState(false);

  const parsed = value ? new Date(value) : null;
  const isValid = parsed && !Number.isNaN(parsed.getTime());

  function handleChange(_event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS !== 'ios') setShow(false);
    if (date) onChange(toISO(date));
  }

  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <Pressable
        onPress={() => setShow(true)}
        accessibilityRole="button"
        className="rounded-md border border-field-border bg-field-background px-4 py-4"
      >
        <Text type="body" className={isValid ? '' : 'text-field-placeholder'}>
          {isValid ? formatNL(parsed!) : placeholder}
        </Text>
      </Pressable>
      {error ? <FieldError>{error}</FieldError> : null}

      {show ? (
        <DateTimePicker
          mode="date"
          value={isValid ? parsed! : (maximumDate ?? new Date())}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
        />
      ) : null}
    </View>
  );
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatNL(d: Date): string {
  // dd/MM/yyyy — common BE display format.
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
}
