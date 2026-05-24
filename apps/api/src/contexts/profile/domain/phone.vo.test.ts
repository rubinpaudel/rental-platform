import { describe, expect, it } from 'vitest';
import { phone } from './phone.vo';

describe('phone', () => {
  it('accepts +32 mobile in E.164', () => {
    expect(phone('+32470123456')).toBe('+32470123456');
  });

  it('accepts national mobile 04XX and normalises to E.164', () => {
    expect(phone('0470123456')).toBe('+32470123456');
  });

  it('accepts +32 landline (Brussels, 8 digits after country code)', () => {
    expect(phone('+3221234567')).toBe('+3221234567');
  });

  it('accepts national landline 02 and normalises', () => {
    expect(phone('021234567')).toBe('+3221234567');
  });

  it('strips spaces, dashes, dots and slashes', () => {
    expect(phone('0470 12 34 56')).toBe('+32470123456');
    expect(phone('0470-12-34-56')).toBe('+32470123456');
    expect(phone('0470.12.34.56')).toBe('+32470123456');
    expect(phone('0470/12/34/56')).toBe('+32470123456');
  });

  it('accepts 0032 international prefix', () => {
    expect(phone('0032470123456')).toBe('+32470123456');
  });

  it('rejects non-Belgian country code', () => {
    expect(() => phone('+33470123456')).toThrow(/Invalid Belgian phone/);
  });

  it('rejects empty input', () => {
    expect(() => phone('')).toThrow(/required/);
  });

  it('rejects numbers that do not start with + or 0', () => {
    expect(() => phone('470123456')).toThrow(/Invalid Belgian phone/);
  });

  it('rejects too-short national number', () => {
    expect(() => phone('0470')).toThrow(/Invalid Belgian phone/);
  });

  it('rejects too-long international number', () => {
    expect(() => phone('+324701234567890')).toThrow(/Invalid Belgian phone/);
  });

  it('rejects numbers with a leading 0 (after country code)', () => {
    expect(() => phone('+320470123456')).toThrow(/Invalid Belgian phone/);
  });
});
