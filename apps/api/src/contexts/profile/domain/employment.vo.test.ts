import { describe, expect, it } from 'vitest';
import {
  employment,
  EMPTY_EMPLOYMENT,
  employmentStatus,
  isEmploymentStatus,
} from './employment.vo';

describe('employmentStatus', () => {
  it('accepts each valid status', () => {
    for (const s of [
      'employed_indef',
      'employed_fixed',
      'self_employed',
      'student',
      'unemployed',
      'retired',
    ]) {
      expect(employmentStatus(s)).toBe(s);
      expect(isEmploymentStatus(s)).toBe(true);
    }
  });

  it('rejects unknown status', () => {
    expect(() => employmentStatus('freelancer')).toThrow(/Invalid employmentStatus/);
    expect(isEmploymentStatus('freelancer')).toBe(false);
  });
});

describe('employment', () => {
  it('returns empty for empty input', () => {
    expect(employment({})).toEqual(EMPTY_EMPLOYMENT);
  });

  it('parses a full employment record', () => {
    expect(
      employment({ status: 'employed_indef', employer: 'Acme NV', monthsAtEmployer: 24 }),
    ).toEqual({ status: 'employed_indef', employer: 'Acme NV', monthsAtEmployer: 24 });
  });

  it('trims employer and rejects too long', () => {
    expect(employment({ employer: '  Acme  ' }).employer).toBe('Acme');
    expect(() => employment({ employer: 'a'.repeat(201) })).toThrow(/at most/);
  });

  it('rejects non-integer months', () => {
    expect(() => employment({ monthsAtEmployer: 1.5 })).toThrow(/integer/);
  });

  it('rejects negative or unrealistic months', () => {
    expect(() => employment({ monthsAtEmployer: -1 })).toThrow(/between 0 and 1200/);
    expect(() => employment({ monthsAtEmployer: 1201 })).toThrow(/between 0 and 1200/);
  });
});
