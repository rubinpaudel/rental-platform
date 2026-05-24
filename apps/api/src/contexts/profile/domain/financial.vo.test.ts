import { describe, expect, it } from 'vitest';
import {
  financial,
  EMPTY_FINANCIAL,
  incomeProofType,
  isIncomeProofType,
} from './financial.vo';

describe('incomeProofType', () => {
  it('accepts every documented proof type', () => {
    for (const t of ['payslips', 'tax_assessment', 'accountant_statement', 'other']) {
      expect(incomeProofType(t)).toBe(t);
      expect(isIncomeProofType(t)).toBe(true);
    }
  });

  it('rejects unknown type', () => {
    expect(() => incomeProofType('bank_statement')).toThrow(/Invalid incomeProofType/);
  });
});

describe('financial', () => {
  it('returns empty for empty input', () => {
    expect(financial({})).toEqual(EMPTY_FINANCIAL);
  });

  it('parses a full record', () => {
    expect(
      financial({
        monthlyNetIncomeCents: 250000,
        incomeProofType: 'payslips',
        guaranteeCapacityCents: 300000,
      }),
    ).toEqual({
      monthlyNetIncomeCents: 250000,
      incomeProofType: 'payslips',
      guaranteeCapacityCents: 300000,
    });
  });

  it('rejects negative money', () => {
    expect(() => financial({ monthlyNetIncomeCents: -1 })).toThrow(/non-negative/);
    expect(() => financial({ guaranteeCapacityCents: -1 })).toThrow(/non-negative/);
  });

  it('rejects non-integer cents', () => {
    expect(() => financial({ monthlyNetIncomeCents: 100.5 })).toThrow(/non-negative integer/);
  });

  it('rejects unrealistic values', () => {
    expect(() => financial({ monthlyNetIncomeCents: 200_000_000_00 })).toThrow(
      /unrealistically/,
    );
  });
});
