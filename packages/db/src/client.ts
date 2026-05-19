import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type Database = PostgresJsDatabase<Record<string, never>>;

export interface DbHandle {
  db: Database;
  close: () => Promise<void>;
}

/**
 * Build a Drizzle client over a fresh postgres-js pool. Bounded contexts will
 * pass their own schema into `drizzle` once they exist; v0 has no schema yet.
 * Tuned small for v0: 10 connections, 20s idle timeout.
 */
export function createDb(connectionString: string): DbHandle {
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  const db = drizzle(client);

  return {
    db,
    close: () => client.end({ timeout: 5 }),
  };
}
