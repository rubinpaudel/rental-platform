// keep in sync with listings_kitchen_type_chk
export const KITCHEN_TYPES = [
  'none',
  'kitchenette',
  'equipped',
  'hyper_equipped',
  'us_open',
  'us_closed',
] as const;
export type KitchenType = (typeof KITCHEN_TYPES)[number];

export function kitchenType(value: unknown): KitchenType {
  if (typeof value !== 'string' || !KITCHEN_TYPES.includes(value as KitchenType)) {
    throw new Error(`Invalid kitchenType: ${String(value)}`);
  }
  return value as KitchenType;
}
