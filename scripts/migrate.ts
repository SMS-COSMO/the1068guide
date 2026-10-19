import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import process from 'node:process';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { loadProjectEnv } from './load-env.ts';

loadProjectEnv();

const url = process.env.NUXT_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./data/local.db';
const authToken = process.env.NUXT_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined;

if (url.startsWith('file:'))
  mkdirSync(dirname(url.slice('file:'.length)), { recursive: true });

const client = createClient({ url, authToken });
await migrate(drizzle(client), { migrationsFolder: 'server/database/migrations' });
client.close();
console.log(`Migrations applied to ${url}`);
