import { defineConfig } from 'drizzle-kit';

/**
 * Each bounded context owns its own schema file at
 * `apps/api/src/contexts/<context>/infra/schema.ts`. drizzle-kit globs them
 * all so `db:generate` picks up every context's tables. No context exists in
 * v0, so the glob matches nothing and no migrations are committed yet — the
 * first real migration arrives with the first bounded context in v1.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: '../../apps/api/src/contexts/**/infra/schema.ts',
  out: './src/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://rental:rental@localhost:5432/rental',
  },
  verbose: true,
  strict: true,
});
