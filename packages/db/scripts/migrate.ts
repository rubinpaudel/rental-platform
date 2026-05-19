import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set. Source .env.local or set it in the environment.');
  process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

console.info(`starting migrations against ${url.replace(/:[^:@]+@/, ':***@')}`);

await migrate(db, { migrationsFolder: './src/migrations' });

console.info('migrations complete');

await client.end();
process.exit(0);
