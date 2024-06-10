import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { publicProcedure, router } from '../trpc';
import { useDrizzle } from '~/server/utils/drizzle';
import { guidebook } from '~/server/db/schema';

const primaryCategorySchema = z.enum(['life', 'study', 'tips', 'intl']);
const secondaryCategorySchema = z.enum(['library', 'activity', 'dorm', 'food', 'club', 'humanities', 'science', 'compulsories', 'life', 'study']);

export const appRouter = router({
  getReviewedGuide: publicProcedure
    .input(z.object({
      primaryCategory: primaryCategorySchema,
      secondaryCategory: secondaryCategorySchema,
    }))
    .query(async ({ input }) => {
      return await useDrizzle().query.guidebook.findMany({
        where: and(
          eq(guidebook.primaryCategory, input.primaryCategory),
          eq(guidebook.secondaryCategory, input.secondaryCategory),
          eq(guidebook.isReviewed, true),
        ),
      });
    }),

  submitNewGuide: publicProcedure
    .input(z.object({
      primaryCategory: primaryCategorySchema,
      secondaryCategory: secondaryCategorySchema,
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      await useDrizzle().insert(guidebook).values(input);
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
