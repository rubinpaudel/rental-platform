import { describe, expect, it } from 'vitest';
import { identity, EMPTY_IDENTITY } from './identity.vo';

describe('identity', () => {
  it('returns empty when given no input', () => {
    expect(identity({})).toEqual(EMPTY_IDENTITY);
  });

  it('trims first/last name and rejects empty after trim', () => {
    const result = identity({ firstName: '  Alice  ', lastName: 'Janssens' });
    expect(result.firstName).toBe('Alice');
    expect(result.lastName).toBe('Janssens');
  });

  it('treats blank name as null', () => {
    expect(identity({ firstName: '   ' }).firstName).toBeNull();
  });

  it('uppercases nationality', () => {
    expect(identity({ nationality: 'be' }).nationality).toBe('BE');
  });

  it('rejects nationality that is not alpha-2', () => {
    expect(() => identity({ nationality: 'BEL' })).toThrow(/alpha-2/);
    expect(() => identity({ nationality: '12' })).toThrow(/alpha-2/);
  });

  it('rejects malformed dateOfBirth', () => {
    expect(() => identity({ dateOfBirth: '01-01-1990' })).toThrow(/YYYY-MM-DD/);
    expect(() => identity({ dateOfBirth: '1990/01/01' })).toThrow(/YYYY-MM-DD/);
  });

  it('rejects calendar-invalid dates', () => {
    expect(() => identity({ dateOfBirth: '1990-13-01' })).toThrow(/valid calendar date/);
    expect(() => identity({ dateOfBirth: '1990-02-30' })).toThrow(/valid calendar date/);
  });

  it('rejects future dateOfBirth', () => {
    const next = new Date();
    next.setUTCFullYear(next.getUTCFullYear() + 1);
    expect(() => identity({ dateOfBirth: next.toISOString().slice(0, 10) })).toThrow(/future/);
  });

  it('rejects implausibly old dateOfBirth', () => {
    expect(() => identity({ dateOfBirth: '1850-01-01' })).toThrow(/too far in the past/);
  });

  it('accepts a valid past dateOfBirth', () => {
    expect(identity({ dateOfBirth: '1990-05-15' }).dateOfBirth).toBe('1990-05-15');
  });

  it('rejects too-long name', () => {
    const longName = 'a'.repeat(101);
    expect(() => identity({ firstName: longName })).toThrow(/at most/);
  });

  it('parses phone via the Phone VO', () => {
    expect(identity({ phone: '0470 12 34 56' }).phone).toBe('+32470123456');
  });

  it('keeps phone null when empty', () => {
    expect(identity({ phone: '' }).phone).toBeNull();
    expect(identity({ phone: null }).phone).toBeNull();
  });

  it('surfaces phone parse errors', () => {
    expect(() => identity({ phone: 'not-a-phone' })).toThrow(/Invalid Belgian phone/);
  });
});
