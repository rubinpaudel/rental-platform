// keep in sync with listings_viewing_mode_chk
export const VIEWING_MODES = ['self_book', 'on_request', 'open_house'] as const;
export type ViewingMode = (typeof VIEWING_MODES)[number];

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface Availability {
  readonly availableFrom: string | null;
  readonly availableImmediately: boolean | null;
  readonly viewingMode: ViewingMode | null;
}

export function availability(input: {
  availableFrom?: string | null;
  availableImmediately?: boolean | null;
  viewingMode?: string | null;
}): Availability {
  let availableFrom: string | null = null;
  if (input.availableFrom != null && input.availableFrom !== '') {
    if (!ISO_DATE_RE.test(input.availableFrom)) {
      throw new Error('availableFrom must be ISO date YYYY-MM-DD');
    }
    const d = new Date(`${input.availableFrom}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) {
      throw new Error('availableFrom must be a valid calendar date');
    }
    availableFrom = input.availableFrom;
  }

  const viewingMode = input.viewingMode ?? null;
  if (viewingMode !== null && !VIEWING_MODES.includes(viewingMode as ViewingMode)) {
    throw new Error(`Invalid viewingMode: ${viewingMode}`);
  }

  return {
    availableFrom,
    availableImmediately: input.availableImmediately ?? null,
    viewingMode: viewingMode as ViewingMode | null,
  };
}
