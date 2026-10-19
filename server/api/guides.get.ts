import { primaryCategorySchema } from '~/constants';
import { listReviewedGuides } from '~/server/utils/guides';

export default defineEventHandler(async (event) => {
  const raw = getQuery(event).primaryCategory;
  if (raw === undefined || raw === '')
    return await listReviewedGuides();

  const parsed = primaryCategorySchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unknown category',
    });
  }

  return await listReviewedGuides(parsed.data);
});
