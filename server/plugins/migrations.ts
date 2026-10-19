import { migrate } from 'drizzle-orm/libsql/migrator';
import { useDb } from '../utils/drizzle';

export default defineNitroPlugin(async () => {
  if (!import.meta.dev)
    return;

  try {
    await migrate(useDb(), { migrationsFolder: 'server/database/migrations' });
  } catch (error) {
    console.error('Database migrations failed', error);
  }
});
