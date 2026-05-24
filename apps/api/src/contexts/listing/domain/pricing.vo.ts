export interface Pricing {
  readonly priceCents: number;
  readonly chargesCents: number | null;
  readonly syndicCents: number | null;
  readonly depositCents: number | null;
  readonly agencyFeeCents: number | null;
  readonly includesUtilities: boolean | null;
  readonly currency: 'EUR';
}

function nonNegativeOrNull(name: string, value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
}

export function pricing(input: {
  priceCents: number;
  chargesCents?: number | null;
  syndicCents?: number | null;
  depositCents?: number | null;
  agencyFeeCents?: number | null;
  includesUtilities?: boolean | null;
  currency?: string;
}): Pricing {
  if (!Number.isInteger(input.priceCents) || input.priceCents < 0) {
    throw new Error('priceCents must be a non-negative integer');
  }
  const currency = input.currency ?? 'EUR';
  if (currency !== 'EUR') {
    throw new Error('Only EUR is supported');
  }
  return {
    priceCents: input.priceCents,
    chargesCents: nonNegativeOrNull('chargesCents', input.chargesCents),
    syndicCents: nonNegativeOrNull('syndicCents', input.syndicCents),
    depositCents: nonNegativeOrNull('depositCents', input.depositCents),
    agencyFeeCents: nonNegativeOrNull('agencyFeeCents', input.agencyFeeCents),
    includesUtilities: input.includesUtilities ?? null,
    currency: 'EUR',
  };
}
