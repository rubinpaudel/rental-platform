export interface Surface {
  readonly m2: number;
}

export function surface(m2: number): Surface {
  if (!Number.isInteger(m2) || m2 <= 0) {
    throw new Error('Surface must be a positive integer (m²)');
  }
  return { m2 };
}
