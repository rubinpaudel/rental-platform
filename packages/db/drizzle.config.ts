import { defineConfig } from 'drizzle-kit';

/**
 * Each bounded context owns its own schema file at
 * `apps/api/src/contexts/<context>/infra/schema.ts`. Non-context modules
 * (like the postal reference module) follow the same `**\/infra/schema.ts`
 * convention. drizzle-kit globs both so `db:generate` picks them all up.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: [
    '../../apps/api/src/contexts/**/infra/schema.ts',
    '../../apps/api/src/postal/infra/schema.ts',
  ],
  out: './src/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://rental:rental@localhost:5432/rental',
  },
  verbose: true,
  strict: true,
});
