import { describe, expect, it } from 'vitest';
import { energyProfile, EMPTY_ENERGY_PROFILE } from './energy.vo';

describe('energyProfile', () => {
  it('returns empty for empty input', () => {
    expect(energyProfile({})).toEqual(EMPTY_ENERGY_PROFILE);
  });

  it('round-trips a full record', () => {
    expect(
      energyProfile({
        heatingType: 'gas',
        hasHeatPump: false,
        hasSolarPanels: true,
        hasThermalSolar: false,
        hasSharedBoiler: false,
        hasDoubleGlazing: true,
        hasTripleGlazing: false,
        hasSeparateMeterElectricity: true,
        hasSeparateMeterGas: true,
        hasSeparateMeterWater: false,
      }),
    ).toEqual({
      heatingType: 'gas',
      hasHeatPump: false,
      hasSolarPanels: true,
      hasThermalSolar: false,
      hasSharedBoiler: false,
      hasDoubleGlazing: true,
      hasTripleGlazing: false,
      hasSeparateMeterElectricity: true,
      hasSeparateMeterGas: true,
      hasSeparateMeterWater: false,
    });
  });

  it('rejects invalid heatingType', () => {
    expect(() => energyProfile({ heatingType: 'nuclear' })).toThrow(/Invalid heatingType/);
  });
});
