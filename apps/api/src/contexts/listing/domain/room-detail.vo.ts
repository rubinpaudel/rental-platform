// keep in sync with listing_rooms_room_type_chk
export const ROOM_TYPES = [
  'bedroom',
  'bathroom',
  'shower_room',
  'living_room',
  'dining_room',
  'kitchen',
  'office',
  'dressing',
  'laundry',
  'cellar',
  'attic',
  'garage',
  'terrace',
  'garden',
] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export interface RoomDetail {
  readonly id: string;
  readonly roomType: RoomType;
  readonly label: string | null;
  readonly surfaceM2: number | null;
  readonly order: number;
}

export function roomDetail(input: {
  id: string;
  roomType: string;
  label?: string | null;
  surfaceM2?: number | null;
  order: number;
}): RoomDetail {
  if (!input.id) throw new Error('Room id is required');
  if (!ROOM_TYPES.includes(input.roomType as RoomType)) {
    throw new Error(`Invalid roomType: ${input.roomType}`);
  }
  if (!Number.isInteger(input.order) || input.order < 0) {
    throw new Error('Room order must be a non-negative integer');
  }
  let surfaceM2: number | null = null;
  if (input.surfaceM2 !== null && input.surfaceM2 !== undefined) {
    if (!Number.isInteger(input.surfaceM2) || input.surfaceM2 < 0) {
      throw new Error('Room surfaceM2 must be a non-negative integer');
    }
    surfaceM2 = input.surfaceM2;
  }
  const label = input.label?.trim() || null;
  return {
    id: input.id,
    roomType: input.roomType as RoomType,
    label,
    surfaceM2,
    order: input.order,
  };
}
