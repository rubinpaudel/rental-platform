export const INCOME_PROOF_TYPES = [
  'payslips',
  'tax_assessment',
  'accountant_statement',
  'other',
] as const;

export type IncomeProofType = (typeof INCOME_PROOF_TYPES)[number];

export function isIncomeProofType(value: unknown): value is IncomeProofType {
  return (
    typeof value === 'string' && (INCOME_PROOF_TYPES as readonly string[]).includes(value)
  );
}

export function incomeProofType(value: unknown): IncomeProofType {
  if (!isIncomeProofType(value)) {
    throw new Error(`Invalid incomeProofType: ${String(value)}`);
  }
  return value;
}

export interface Financial {
  readonly monthlyNetIncomeCents: number | null;
  readonly incomeProofType: IncomeProofType | null;
  readonly guaranteeCapacityCents: number | null;
}

export const EMPTY_FINANCIAL: Financial = {
  monthlyNetIncomeCents: null,
  incomeProofType: null,
  guaranteeCapacityCents: null,
};

export interface FinancialInput {
  monthlyNetIncomeCents?: number | null;
  incomeProofType?: IncomeProofType | string | null;
  guaranteeCapacityCents?: number | null;
}

export function financial(input: FinancialInput): Financial {
  const monthly = normaliseCents(input.monthlyNetIncomeCents, 'monthlyNetIncomeCents');
  const proof =
    input.incomeProofType == null || input.incomeProofType === ''
      ? null
      : incomeProofType(input.incomeProofType);
  const guarantee = normaliseCents(input.guaranteeCapacityCents, 'guaranteeCapacityCents');

  return {
    monthlyNetIncomeCents: monthly,
    incomeProofType: proof,
    guaranteeCapacityCents: guarantee,
  };
}

function normaliseCents(value: number | null | undefined, field: string): number | null {
  if (value == null) return null;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative integer (cents)`);
  }
  if (value > 1_000_000_00 * 100) {
    throw new Error(`${field} is unrealistically large`);
  }
  return value;
}
