import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { useDrizzle } from '~/server/utils/drizzle';
import { guidebook } from '~/server/database/schema';
import { primaryCategorySchema, secondaryCategorySchema } from '~/constants';
import { env } from '~/server/env';

export const appRouter = router({
  guideList: publicProcedure
    .input(z.object({
      primaryCategory: primaryCategorySchema,
    }))
    .query(async ({ input }) => {
      return await useDrizzle().query.guidebook.findMany({
        where: and(
          eq(guidebook.primaryCategory, input.primaryCategory),
          eq(guidebook.isReviewed, true),
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

  checkPassword: publicProcedure
    .input(z.object({
      password: z.string(),
    }))
    .query(async ({ input }) => {
      if (input.password !== env.ADMIN_PASSWORD)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '管理员密码错误' });
    }),

  guideReviewList: publicProcedure
    .input(z.object({
      password: z.string(),
    }))
    .query(async ({ input }) => {
      if (input.password !== env.ADMIN_PASSWORD)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '管理员密码错误' });

      return await useDrizzle().query.guidebook.findMany({
        where: eq(guidebook.isReviewed, false),
      });
    }),

  modify: publicProcedure
    .input(z.object({
      password: z.string(),
      id: z.number().int(),
      primaryCategory: primaryCategorySchema.optional(),
      secondaryCategory: secondaryCategorySchema.optional(),
      content: z.string().optional(),
      isReviewed: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      if (input.password !== env.ADMIN_PASSWORD)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '管理员密码错误' });

      await useDrizzle().update(guidebook).set(input).where(eq(guidebook.id, input.id));
    }),

  remove: publicProcedure
    .input(z.object({
      password: z.string(),
      id: z.number().int(),
    }))
    .mutation(async ({ input }) => {
      if (input.password !== env.ADMIN_PASSWORD)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '管理员密码错误' });

      await useDrizzle().delete(guidebook).where(eq(guidebook.id, input.id));
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
