import type { z } from 'zod';
import type { primaryCategorySchema } from '~/constants';
import { and, eq } from 'drizzle-orm';
import { GUIDE_CACHE_SECONDS } from '~/shared/cache';
import { guidebook } from '../database/schema';
import { useDb } from './drizzle';

export type PrimaryCategory = z.infer<typeof primaryCategorySchema>;

export const listReviewedGuides = defineCachedFunction(async (primaryCategory?: PrimaryCategory) => {
  return await useDb().query.guidebook.findMany({
    where: and(
      eq(guidebook.isReviewed, true),
      primaryCategory ? eq(guidebook.primaryCategory, primaryCategory) : undefined,
    ),
    orderBy: (fields, operators) => [operators.asc(fields.id)],
  });
}, {
  maxAge: GUIDE_CACHE_SECONDS,
  swr: true,
  name: 'reviewed-guides',
  getKey: (primaryCategory?: PrimaryCategory) => primaryCategory ?? 'all',
});

export async function invalidateReviewedGuides() {
  try {
    const storage = useStorage('cache');
    const keys = await storage.getKeys();
    await Promise.all(
      keys
        .filter(key => key.includes('reviewed-guides'))
        .map(key => storage.removeItem(key)),
    );
  } catch (error) {
    console.error('Failed to clear the reviewed-guide cache', error);
  }
}
