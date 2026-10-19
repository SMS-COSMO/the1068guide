import type { H3Event } from 'h3';

export async function createTRPCContext(event: H3Event) {
  const session = await getUserSession(event);
  return {
    event,
    user: session.user?.role === 'admin' ? session.user : null,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
