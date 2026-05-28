import { PostgresStore } from '@mastra/pg';

/**
 * Postgres storage factory untuk Mastra.
 *
 * Pakai schema khusus `mastra` supaya tabel Mastra (`mastra_threads`,
 * `mastra_messages`, `mastra_resources`, dll) terpisah dari schema `core`
 * Bades. Schema dibuat otomatis oleh adapter saat init kalau belum ada.
 *
 * DB URL re-use `PG_DATABASE_URL` Bades (sama DB, beda schema) supaya tidak
 * butuh provisioning DB tambahan.
 */
export const buildStorage = (): PostgresStore => {
  const connectionString = process.env.PG_DATABASE_URL;

  if (connectionString === undefined || connectionString === '') {
    throw new Error(
      'PG_DATABASE_URL tidak terdefinisi — Mastra storage butuh Postgres connection string yang sama dengan core Bades.',
    );
  }

  return new PostgresStore({
    id: 'bades-mastra-storage',
    connectionString,
    schemaName: 'mastra',
  });
};
