import type { ListingUpsertBody } from '@/lib/listings/types';
import type { FlowAddress, FlowBasics } from './flow-context';

interface FlowSnapshot {
  address: FlowAddress;
  basics: FlowBasics;
  description: string;
  priceEur: string;
}

/**
 * Maps the in-memory flow state to the shape the v3 API accepts. Title is
 * sent empty for now — the field is on its way out of the model, but the API
 * still requires the key. Price is collected in whole euros; backend stores
 * cents. Box is normalised to null when blank so the backend doesn't store
 * an empty string.
 */
export function toUpsertBody(flow: FlowSnapshot): ListingUpsertBody {
  return {
    title: '',
    description: flow.description.trim(),
    priceCents: Number(flow.priceEur) * 100,
    surfaceM2: flow.basics.surfaceM2 ?? 0,
    rooms: flow.basics.bedrooms,
    address: {
      street: flow.address.street.trim(),
      number: flow.address.number.trim(),
      box: flow.address.box.trim() === '' ? null : flow.address.box.trim(),
      postalCode: flow.address.postalCode,
      municipality: flow.address.municipality.trim(),
    },
  };
}
