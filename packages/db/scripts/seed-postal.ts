import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { postalCodes } from '../../../apps/api/src/postal/infra/schema';
import { inferBeRegion } from '../../../apps/api/src/postal/domain/be-region';

/**
 * Populates the `postal_codes` table from per-country JSON datasets shipped
 * under `apps/api/src/postal/data/<cc>/zipcodes.json`. Idempotent — truncates
 * by country before inserting, so a re-run picks up upstream refreshes
 * without leaving stale rows.
 *
 * Add a new country by dropping its JSON into the matching directory and
 * adding a SOURCES entry below.
 */

interface SourceRow {
  country_code: string;
  zipcode: string;
  place: string;
  state?: string;
  state_code?: string;
  province?: string;
  province_code?: string;
  community?: string;
  community_code?: string;
  latitude?: string;
  longitude?: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');

interface Source {
  country: string;
  file: string;
  /** Maps a raw row to the platform's `region` value (nullable). */
  region: (row: SourceRow) => string | null;
}

const SOURCES: Source[] = [
  {
    country: 'BE',
    file: resolve(REPO_ROOT, 'apps/api/src/postal/data/be/zipcodes.json'),
    region: (row) => inferBeRegion(row.zipcode),
  },
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set. Source .env.local or set it in the environment.');
  process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

const BATCH_SIZE = 500;

for (const source of SOURCES) {
  const raw = JSON.parse(readFileSync(source.file, 'utf-8')) as SourceRow[];
  const rows = raw
    .filter((r) => r.zipcode && r.place)
    .map((r) => ({
      countryCode: source.country,
      postalCode: r.zipcode,
      place: r.place,
      placeNormalized: normalize(r.place),
      region: source.region(r),
      state: r.state ?? null,
      stateCode: r.state_code ?? null,
      province: r.province ?? null,
      provinceCode: r.province_code ?? null,
      community: r.community ?? null,
      communityCode: r.community_code ?? null,
      latitude: parseCoord(r.latitude),
      longitude: parseCoord(r.longitude),
    }));

  console.info(`[${source.country}] truncating existing rows...`);
  await db.delete(postalCodes).where(eq(postalCodes.countryCode, source.country));

  console.info(`[${source.country}] inserting ${rows.length} rows...`);
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    await db.insert(postalCodes).values(batch).onConflictDoNothing();
  }
  console.info(`[${source.country}] done.`);
}

await client.end();
process.exit(0);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function parseCoord(raw?: string): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
