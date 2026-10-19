import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '~/server/trpc/context';
import { appRouter } from '~/server/trpc/routers';

export type AppRouter = typeof appRouter;

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const headers = new Headers();
  for (const [key, value] of Object.entries(getRequestHeaders(event))) {
    if (value === undefined)
      continue;
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  // trpc-nuxt's fetch adapter reads getRequestWebStream(), which is empty
  // for Node requests on this Nitro version, so mutations arrived without input.
  const body = event.method === 'GET' || event.method === 'HEAD'
    ? undefined
    : await readRawBody(event);

  const request = new Request(url, {
    method: event.method,
    headers,
    body: body && body.length > 0 ? body : undefined,
  });

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req: request,
    createContext: () => createTRPCContext(event),
  });
});
