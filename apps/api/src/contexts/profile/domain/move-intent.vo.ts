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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('desiredMoveInDate must be ISO date YYYY-MM-DD');
  }
  const date = new Date(value + 'T00:00:00Z');
  if (Number.isNaN(date.getTime()) || value !== date.toISOString().slice(0, 10)) {
    throw new Error('desiredMoveInDate must be a valid calendar date');
  }
  return value;
}
