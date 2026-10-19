import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { primaryCategorySchema, secondaryCategorySchema } from '~/constants';
import { guidebook } from '~/server/database/schema';
import { useDb } from '~/server/utils/drizzle';
import { invalidateReviewedGuides, listReviewedGuides } from '~/server/utils/guides';
import { isRateLimited, recordAttempt } from '~/server/utils/rate-limit';
import { adminProcedure, publicProcedure, router } from '../trpc';

const contentSchema = z.string().min(1).max(200_000);

export const appRouter = router({
  guideList: publicProcedure
    .input(z.object({
      primaryCategory: primaryCategorySchema.optional(),
    }))
    .query(async ({ input }) => {
      return await listReviewedGuides(input.primaryCategory);
    }),

  new: publicProcedure
    .input(z.object({
      primaryCategory: primaryCategorySchema,
      secondaryCategory: secondaryCategorySchema,
      content: contentSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      if (await isRateLimited(ctx.event, 'submit')) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: '投稿过于频繁，请稍后再试',
        });
      }

      await useDb().insert(guidebook).values(input);
      await recordAttempt(ctx.event, 'submit');
    }),

  guideReviewList: adminProcedure
    .query(async () => {
      return await useDb().query.guidebook.findMany({
        where: eq(guidebook.isReviewed, false),
        orderBy: (fields, operators) => [operators.asc(fields.id)],
      });
    }),

  modify: adminProcedure
    .input(z.object({
      id: z.number().int(),
      primaryCategory: primaryCategorySchema.optional(),
      secondaryCategory: secondaryCategorySchema.optional(),
      content: contentSchema.optional(),
      isReviewed: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const changes: Partial<typeof input> = {};
      if (input.primaryCategory !== undefined)
        changes.primaryCategory = input.primaryCategory;
      if (input.secondaryCategory !== undefined)
        changes.secondaryCategory = input.secondaryCategory;
      if (input.content !== undefined)
        changes.content = input.content;
      if (input.isReviewed !== undefined)
        changes.isReviewed = input.isReviewed;

      await useDb().update(guidebook).set(changes).where(eq(guidebook.id, input.id));
      await invalidateReviewedGuides();
    }),

  remove: adminProcedure
    .input(z.object({
      id: z.number().int(),
    }))
    .mutation(async ({ input }) => {
      await useDb().delete(guidebook).where(eq(guidebook.id, input.id));
      await invalidateReviewedGuides();
    }),
});

export type AppRouter = typeof appRouter;
