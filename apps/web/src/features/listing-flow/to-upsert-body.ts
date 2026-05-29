import type { ListingUpsertBody } from '@/lib/listings/types';
import type { FlowAddress, FlowBasics } from './flow-context';
import type { PropertyType as FlowPropertyType } from './property-type-grid';

interface FlowSnapshot {
  propertyType: FlowPropertyType | null;
  address: FlowAddress;
  basics: FlowBasics;
  description: string;
  priceEur: string;
}

type ApiPropertyType = ListingUpsertBody['classification']['propertyType'];

// The flow collects Belgian property labels; the API takes a universal enum.
// Lossy on purpose — we pick the closest category until the flow grows a
// dedicated mapping step.
const PROPERTY_TYPE_MAP: Record<FlowPropertyType, ApiPropertyType> = {
  bungalow: 'house',
  landhuis: 'house',
  villa: 'house',
  appartement: 'apartment',
  penthouse: 'apartment',
  serviceFlat: 'apartment',
  duplex: 'apartment',
  kot: 'studio',
  studio: 'studio',
};

export function toUpsertBody(flow: FlowSnapshot): ListingUpsertBody {
  return {
    description: flow.description.trim(),
    address: {
      street: flow.address.street.trim(),
      number: flow.address.number.trim(),
      box: flow.address.box.trim() === '' ? null : flow.address.box.trim(),
      postalCode: flow.address.postalCode,
      municipality: flow.address.municipality.trim(),
    },
    classification: {
      // v1 of the app is rent-only — hardcoded until we add sale/short-term flows.
      listingType: 'rent',
      propertyType: flow.propertyType ? PROPERTY_TYPE_MAP[flow.propertyType] : 'apartment',
    },
    pricing: { priceCents: Number(flow.priceEur) * 100 },
    surface: { totalM2: flow.basics.surfaceM2 ?? 0 },
    roomCounts: { bedrooms: flow.basics.bedrooms },
  };
}
