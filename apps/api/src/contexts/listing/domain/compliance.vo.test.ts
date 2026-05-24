import { describe, expect, it } from 'vitest';
import {
  regulatoryPrimitives,
  EMPTY_REGULATORY_PRIMITIVES,
  EMPTY_COMPLIANCE,
} from './compliance.vo';

describe('regulatoryPrimitives', () => {
  it('returns empty for empty input', () => {
    expect(regulatoryPrimitives({})).toEqual(EMPTY_REGULATORY_PRIMITIVES);
  });

  it('round-trips a full record', () => {
    expect(
      regulatoryPrimitives({
        epcLabel: 'A',
        primaryEnergyKwhM2: 79,
        co2EmissionKg: 12,
        isHeritageProtected: false,
        floodRiskLevel: 'none',
        electricityInspectionValid: true,
      }),
    ).toEqual({
      epcLabel: 'A',
      primaryEnergyKwhM2: 79,
      co2EmissionKg: 12,
      isHeritageProtected: false,
      floodRiskLevel: 'none',
      electricityInspectionValid: true,
    });
  });

  it('rejects invalid epcLabel', () => {
    expect(() => regulatoryPrimitives({ epcLabel: 'Z' })).toThrow(/Invalid epcLabel/);
  });

  it('rejects invalid floodRiskLevel', () => {
    expect(() => regulatoryPrimitives({ floodRiskLevel: 'tsunami' })).toThrow(
      /Invalid floodRiskLevel/,
    );
  });

  it('rejects negative primaryEnergyKwhM2', () => {
    expect(() => regulatoryPrimitives({ primaryEnergyKwhM2: -1 })).toThrow(/non-negative/);
  });

  it('rejects negative co2EmissionKg', () => {
    expect(() => regulatoryPrimitives({ co2EmissionKg: -1 })).toThrow(/non-negative/);
  });
});

describe('EMPTY_COMPLIANCE', () => {
  it('defaults to BE countryExtras shape with nulls', () => {
    expect(EMPTY_COMPLIANCE.countryExtras).toEqual({
      country: 'BE',
      vlaamseMaatregelenregisterConsulted: null,
    });
  });
});
