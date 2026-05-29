import { describe, expect, it } from 'vitest';
import { roomDetail } from './room-detail.vo';

describe('roomDetail', () => {
  it('round-trips a full record', () => {
    expect(
      roomDetail({
        id: 'room-1',
        roomType: 'bedroom',
        label: 'Master Bedroom',
        surfaceM2: 13,
        order: 0,
      }),
    ).toEqual({
      id: 'room-1',
      roomType: 'bedroom',
      label: 'Master Bedroom',
      surfaceM2: 13,
      order: 0,
    });
  });

  it('trims empty label to null', () => {
    expect(
      roomDetail({ id: 'r', roomType: 'kitchen', label: '   ', surfaceM2: null, order: 0 }).label,
    ).toBeNull();
  });

  it('rejects empty id', () => {
    expect(() => roomDetail({ id: '', roomType: 'bedroom', order: 0 })).toThrow(/id is required/);
  });

  it('rejects invalid roomType', () => {
    expect(() => roomDetail({ id: 'r', roomType: 'ballroom', order: 0 })).toThrow(/Invalid roomType/);
  });

  it('rejects negative order', () => {
    expect(() => roomDetail({ id: 'r', roomType: 'bedroom', order: -1 })).toThrow(/non-negative/);
  });

  it('rejects negative surfaceM2', () => {
    expect(() =>
      roomDetail({ id: 'r', roomType: 'bedroom', surfaceM2: -5, order: 0 }),
    ).toThrow(/non-negative/);
  });

  it('accepts null surfaceM2 (landlord left it blank)', () => {
    expect(
      roomDetail({ id: 'r', roomType: 'bedroom', surfaceM2: null, order: 0 }).surfaceM2,
    ).toBeNull();
  });
});
