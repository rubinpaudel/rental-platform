export interface Price {
  readonly cents: number;
  readonly currency: 'EUR';
}

export function price(cents: number, currency: string = 'EUR'): Price {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error('Price cents must be a non-negative integer');
  }
  if (currency !== 'EUR') {
    throw new Error('Only EUR is supported');
  }
  return { cents, currency };
}
