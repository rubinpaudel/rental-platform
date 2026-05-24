import { useEffect, useState } from 'react';
import { FieldError, Input, Label, TextField } from 'heroui-native';

interface CurrencyFieldProps {
  /** Stored as integer cents; the input edits euros. */
  valueCents: number;
  onChangeCents: (cents: number) => void;
  label: string;
  placeholder?: string;
  error?: string | undefined;
}

/**
 * Euro-denominated number input. The wire stores cents (e.g. 250_000 =
 * €2500); the user types euros (with optional comma decimals). We keep
 * the visible string in local state so the user can type "2.5" without
 * mid-edit re-formatting, and reconcile to cents on every change.
 *
 *   "2500"   → 250_000 cents
 *   "2500,5" → 250_050 cents
 *   "1,99"   →    199 cents
 *   ""       →      0 cents
 *
 * The schema treats 0 as "unanswered" for the wizard's resume check, so
 * an empty input flows through as zero and the user can re-skip.
 */
export function CurrencyField({
  valueCents,
  onChangeCents,
  label,
  placeholder = '0',
  error,
}: CurrencyFieldProps) {
  const [text, setText] = useState<string>(() => centsToEuros(valueCents));

  // Re-sync if the parent updates the value externally (defaults
  // populating after profile fetch lands).
  useEffect(() => {
    setText(centsToEuros(valueCents));
  }, [valueCents]);

  function handleChange(next: string) {
    // Allow digits, comma, period; collapse multiple separators.
    const cleaned = next.replace(/[^\d.,]/g, '').replace(/[.,]/g, ',');
    const firstComma = cleaned.indexOf(',');
    const normalised =
      firstComma === -1
        ? cleaned
        : cleaned.slice(0, firstComma + 1) +
          cleaned.slice(firstComma + 1).replace(/,/g, '');
    setText(normalised);
    onChangeCents(eurosTextToCents(normalised));
  }

  return (
    <TextField isInvalid={!!error}>
      <Label>{label}</Label>
      <Input
        keyboardType="decimal-pad"
        inputMode="decimal"
        placeholder={placeholder}
        value={text}
        onChangeText={handleChange}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </TextField>
  );
}

function centsToEuros(cents: number): string {
  if (!Number.isFinite(cents) || cents <= 0) return '';
  const whole = Math.floor(cents / 100);
  const remainder = cents % 100;
  if (remainder === 0) return String(whole);
  return `${whole},${String(remainder).padStart(2, '0')}`;
}

function eurosTextToCents(text: string): number {
  if (!text) return 0;
  const [whole = '0', decimals = ''] = text.split(',');
  const padded = (decimals + '00').slice(0, 2);
  const cents = Number(whole) * 100 + Number(padded);
  return Number.isFinite(cents) ? cents : 0;
}
