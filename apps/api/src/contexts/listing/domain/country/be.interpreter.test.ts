import { describe, expect, it } from 'vitest';
import {
  beInterpreter,
  parseBeExtras,
  inferBeEpcLabel,
  EMPTY_BE_EXTRAS,
} from './be.interpreter';

describe('parseBeExtras', () => {
  it('returns empty extras for null/undefined input', () => {
    expect(parseBeExtras(null)).toEqual(EMPTY_BE_EXTRAS);
    expect(parseBeExtras(undefined)).toEqual(EMPTY_BE_EXTRAS);
  });

  it('reads vlaamseMaatregelenregisterConsulted boolean', () => {
    expect(parseBeExtras({ vlaamseMaatregelenregisterConsulted: true })).toEqual({
      vlaamseMaatregelenregisterConsulted: true,
    });
    expect(parseBeExtras({ vlaamseMaatregelenregisterConsulted: false })).toEqual({
      vlaamseMaatregelenregisterConsulted: false,
    });
  });

  it('ignores non-boolean values', () => {
    expect(parseBeExtras({ vlaamseMaatregelenregisterConsulted: 'yes' })).toEqual({
      vlaamseMaatregelenregisterConsulted: null,
    });
  });

  it('ignores unknown keys', () => {
    expect(parseBeExtras({ randomKey: 'foo', vlaamseMaatregelenregisterConsulted: true })).toEqual({
      vlaamseMaatregelenregisterConsulted: true,
    });
  });
});

describe('inferBeEpcLabel', () => {
  it('returns null for null input', () => {
    expect(inferBeEpcLabel(null)).toBeNull();
  });

  it('maps kWh/m² to canonical labels', () => {
    expect(inferBeEpcLabel(0)).toBe('A++');
    expect(inferBeEpcLabel(79)).toBe('A+');
    expect(inferBeEpcLabel(120)).toBe('A');
    expect(inferBeEpcLabel(180)).toBe('B');
    expect(inferBeEpcLabel(250)).toBe('C');
    expect(inferBeEpcLabel(350)).toBe('D');
    expect(inferBeEpcLabel(450)).toBe('E');
    expect(inferBeEpcLabel(600)).toBe('F');
    expect(inferBeEpcLabel(800)).toBe('G');
  });
});

describe('beInterpreter', () => {
  it('parses then serializes round-trip', () => {
    const extras = beInterpreter.parseExtras({ vlaamseMaatregelenregisterConsulted: true });
    expect(extras).toEqual({
      country: 'BE',
      vlaamseMaatregelenregisterConsulted: true,
    });
    expect(beInterpreter.serializeExtras(extras)).toEqual({
      vlaamseMaatregelenregisterConsulted: true,
    });
  });

  it('rejects non-BE extras during serialize', () => {
    // @ts-expect-error -- intentional negative test
    expect(() => beInterpreter.serializeExtras({ country: 'NL' })).toThrow(/non-BE/);
  });
});
