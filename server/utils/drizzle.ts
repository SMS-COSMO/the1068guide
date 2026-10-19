import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute, resolve, sep } from 'node:path';
import process from 'node:process';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../database/schema';

export const tables = schema;

let database: LibSQLDatabase<typeof schema> | undefined;

// `nuxt preview` starts the server with cwd set to `.output`, so a relative
// file: URL would open an empty database next to the build output.
function resolveDatabaseUrl(url: string) {
  if (!url.startsWith('file:'))
    return url;

  const filePath = url.slice('file:'.length);
  if (filePath.startsWith('//') || isAbsolute(filePath))
    return url;

  const cwd = process.cwd();
  const root = cwd.endsWith(`${sep}.output`) ? resolve(cwd, '..') : cwd;
  return `file:${resolve(root, filePath)}`;
}

export function databaseUrl() {
  const config = useRuntimeConfig();
  const configured = config.tursoDatabaseUrl || (import.meta.dev ? 'file:./data/local.db' : '');
  return configured ? resolveDatabaseUrl(configured) : '';
}

export function useDb() {
  if (!database) {
    const config = useRuntimeConfig();
    const url = databaseUrl();
    if (!url) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database is not configured. Set NUXT_TURSO_DATABASE_URL.',
      });
    }

    if (url.startsWith('file:'))
      mkdirSync(dirname(url.slice('file:'.length)), { recursive: true });

    const client = createClient({
      url,
      authToken: config.tursoAuthToken || undefined,
    });
    database = drizzle(client, { schema });
  }

  return database;
}
