import type { Context } from './context';
import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;

const isAdmin = middleware(async ({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '请先登录',
    });
  }

  return next({
    ctx: {
      event: ctx.event,
      user: ctx.user,
    },
  });
});

export const adminProcedure = publicProcedure.use(isAdmin);
