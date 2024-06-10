import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
