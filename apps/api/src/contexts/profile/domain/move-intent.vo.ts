import { format, isValid, parseISO } from 'date-fns';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface MoveIntent {
  readonly desiredMoveInDate: string | null;
  readonly willingToDomicile: boolean | null;
}

export const EMPTY_MOVE_INTENT: MoveIntent = {
  desiredMoveInDate: null,
  willingToDomicile: null,
};

export interface MoveIntentInput {
  desiredMoveInDate?: string | null;
  willingToDomicile?: boolean | null;
}

export function moveIntent(input: MoveIntentInput): MoveIntent {
  const date = normaliseDate(input.desiredMoveInDate);
  const willing = input.willingToDomicile == null ? null : Boolean(input.willingToDomicile);
  return { desiredMoveInDate: date, willingToDomicile: willing };
}

function normaliseDate(value: string | null | undefined): string | null {
  if (value == null || value === '') return null;
  if (!ISO_DATE_RE.test(value)) {
    throw new Error('desiredMoveInDate must be ISO date YYYY-MM-DD');
  }
  const date = parseISO(value);
  if (!isValid(date) || format(date, 'yyyy-MM-dd') !== value) {
    throw new Error('desiredMoveInDate must be a valid calendar date');
  }
  return value;
}
