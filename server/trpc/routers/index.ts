import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { publicProcedure, router } from '../trpc';
import { useDrizzle } from '~/server/utils/drizzle';
import { guidebook } from '~/server/database/schema';
import { primaryCategorySchema, secondaryCategorySchema } from '~/constants';

export const appRouter = router({
  guide: publicProcedure
    .input(z.object({
      primaryCategory: primaryCategorySchema,
      secondaryCategory: secondaryCategorySchema,
    }))
    .query(async ({ input }) => {
      return await useDrizzle().query.guidebook.findMany({
        where: and(
          eq(guidebook.primaryCategory, input.primaryCategory),
          eq(guidebook.secondaryCategory, input.secondaryCategory),
          // --------------- TEST -vvvvv--------------
          eq(guidebook.isReviewed, false),
        ),
      });
    }),

  new: publicProcedure
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
